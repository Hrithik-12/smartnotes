import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function GET(req) {
    try {
        // Fix searchParams casing and URL parsing
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get('fileurl');

        if (!fileUrl) {
            return NextResponse.json({ 
                error: 'File URL is required' 
            }, { 
                status: 400 
            });
        }

        // Fetch and process PDF
        const resp = await fetch(fileUrl);
        if (!resp.ok) {
            throw new Error(`Failed to fetch PDF: ${resp.statusText}`);
        }

        const data = await resp.blob();
        const loader = new WebPDFLoader(data);
        const docs = await loader.load();

        // Combine PDF content
        let pdfTextContent = docs.map(doc => doc.pageContent).join(' ');

        // Split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 20,
        });
        const output = await splitter.createDocuments([pdfTextContent]);

        // Extract split content
        const splitterList = output.map(doc => doc.pageContent);

        return NextResponse.json({
            success: true,
            message: splitterList
        });

    } catch (error) {
        console.error('PDF processing error:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { 
            status: 500 
        });
    }
}