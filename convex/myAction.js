import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ConvexVectorStore.fromTexts(
        args.splitText,
        args.fileId,
        new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY, // Changed to use environment variable
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );
      return { success: true };
    } catch (error) {
      console.error("Embedding error:", error);
      throw error;
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    FileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey:process.env.GOOGLE_API_KEY , // Changed to use correct environment variable
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });

      // Initialize vector store
      const vectorStore = new ConvexVectorStore(embeddings, { ctx });

      // Perform similarity search
      const results = await vectorStore.similaritySearch(args.query, 1);

      // Format results to match Convex types
      const formattedResults = results.map(doc => ({
        content: doc.pageContent,
        metadata: {
          fileId: doc.metadata.fileId || args.FileId,
          score: doc.metadata.score || 0
        }
      }));

      console.log("Formatted search results:", formattedResults);
      return formattedResults;

    } catch (error) {
      console.error("Search error:", {
        message: error.message,
        query: args.query,
        FileId: args.FileId
      });
      throw error;
    }
  },
});
