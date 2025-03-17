'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import Editorextension from './Editorextension'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Download } from 'lucide-react'
import { useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { jsPDF } from 'jspdf'
import { toast } from 'react-hot-toast'

function TextEditor({ FileId }) {
    const { user } = useUser();
    const addNote = useMutation(api.Note.AddNote);
    const notes = useQuery(api.Note.GetNotes, { FileId });
    const [localContent, setLocalContent] = React.useState('');

    // Load initial content
    useEffect(() => {
        if (notes) {
            setLocalContent(notes);
        }
    }, [notes]);

    // Auto-save function with debouncing
    const handleUpdate = ({ editor }) => {
        const content = editor.getHTML();
        setLocalContent(content);

        // Save to database (debounced)
        clearTimeout(window.saveTimeout);
        window.saveTimeout = setTimeout(async () => {
            try {
                await addNote({
                    FileId: FileId,
                    Note: content,
                    CreatedBy: user?.id || ''
                });
                toast.success('Content saved');
            } catch (error) {
                console.error('Save error:', error);
                toast.error('Failed to save content');
            }
        }, 1000);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Start Taking Your Notes Here...' }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
                defaultAlignment: 'left',
            }),
            Underline
        ],
        content: localContent || notes || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            }
        },
        onUpdate: handleUpdate
    });

    // Sync editor content when notes change
    useEffect(() => {
        if (editor && notes && !localContent) {
            editor.commands.setContent(notes);
        }
    }, [notes, editor, localContent]);

    // PDF Download function remains unchanged
    const handleDownloadPDF = () => {
        try {
            if (!editor) return;
            const content = editor.getHTML(); // Get HTML instead of plain text

            const pdf = new jsPDF();
            pdf.setFont('helvetica');
            pdf.setFontSize(12);

            // Split content into pages if needed
            const splitText = pdf.splitTextToSize(content.replace(/<[^>]+>/g, ' '), 180);
            pdf.text(splitText, 10, 10);
            
            const filename = `notes_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="w-full">
            <div className="p-2">
                <Editorextension editor={editor} />
            </div>
            <div className='overflow-scroll h-[90vh]'>
                <EditorContent editor={editor} className="min-h-[500px] p-3" />
            </div>
        </div>
    );
}

export default TextEditor;
