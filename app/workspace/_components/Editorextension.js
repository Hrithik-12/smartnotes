import { useAction, useMutation } from 'convex/react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2, Code, Strikethrough, AlignLeft, AlignCenter, AlignRight, Sparkles, Download } from 'lucide-react'
import React from 'react'
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { ChatSession } from '@google/generative-ai';
import { startChat } from '@/config/AImodel';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { jsPDF } from 'jspdf'

function Editorextension({editor}) {
    const searchai = useAction(api.myAction.search);
    const params = useParams();
    const FileId = params?.FileId;
    const AddNote=useMutation(api.Note.AddNote);
    const {user}=useUser();

    if (!editor) return null;

    const onAiclick = async () => {
        // Get the selected text using better method
        let selectedText = '';
        
        if (editor.view.state.selection) {
            const { from, to } = editor.view.state.selection;
            if (from !== to) {
                selectedText = editor.view.state.doc.textBetween(
                    from,
                    to,
                    ' ', // Block separator
                    ' '  // Node separator
                );
            }
        }

        // Debug logging
        console.log('Selection details:', {
            text: selectedText,
            fileId: FileId,
            hasSelection: selectedText.length > 0
        });

        // Validate selection
        if (!selectedText || selectedText.trim().length === 0) {
            console.log('Please select some text first');
            return;
        }

        try {
            if (!FileId) {
                console.error('FileId is missing');
                return;
            }

            // Show generating response toast
            const toastId = toast.loading('Generating AI response...', {
                position: 'bottom-right'
            });

            const searchResult = await searchai({
                query: selectedText.trim(),
                FileId: FileId
            });

            // Debug log the raw response
            console.log('Raw search result:', searchResult);

            // No need to JSON.parse since the result is already an object
            let answer = '';
            if (Array.isArray(searchResult)) {
                searchResult.forEach(element => {
                    if (element && element.content) {
                        answer += element.content;
                    }
                });
            }

            if (!answer) {
                console.error('No valid content found in search results');
                return;
            }

            const prompt = `Generate a clear and structured response for this question. 
            Format the response using appropriate HTML tags (h2, h3, p, ul, li) for better readability. 
            Avoid any preamble or conclusion text. Focus only on the direct answer.
            Question: "${selectedText}"
            Context: ${answer}`;
            
            // Find and fade out previous AI responses
            const currentContent = editor.getHTML();
            const updatedContent = currentContent.replace(
                /<div class="ai-response">/g, 
                '<div class="ai-response fade">'
            );
            editor.commands.setContent(updatedContent);

            // Format new AI response with the ai-response class
            const chatSession = await startChat();
            const result = await chatSession.sendMessage(prompt);
            const rawResponse = await result.response.text();
            
            // Clean and wrap AI response with structured format
            const cleanResponse = rawResponse
                .replace(/```html/g, '')
                .replace(/```/g, '')
                .trim();
                
            const aiResponse = `
                <div class="ai-response">
                    <div class="bg-gray-50 p-4 rounded-lg my-2">
                        <div class="border-b border-gray-200 pb-2 mb-2">
                            <span class="text-gray-700 text-base font-medium">Question:</span>
                            <p class="text-gray-600 mt-0.5 text-sm leading-normal">${selectedText}</p>
                        </div>
                        <div>
                            <span class="text-gray-700 text-base font-medium">Answer:</span>
                            <div class="mt-0.5 text-sm text-gray-600 leading-normal space-y-1">
                                ${cleanResponse
                                    .replace(/<h1[^>]*>/g, '')
                                    .replace(/<\/h1>/g, '')
                                    .replace(/<h2[^>]*>/g, '<p class="font-medium text-gray-700 mt-1">')
                                    .replace(/<\/h2>/g, '</p>')
                                    .replace(/<ul>/g, '<ul class="list-disc pl-4 space-y-0.5">')
                                    .replace(/<li>/g, '<li class="text-gray-600 leading-normal">')
                                    .replace(/\n\n/g, '<br/>')
                                    .replace(/<p>/g, '<p class="mb-1">')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Update content and show success toast
            const latestContent = editor.getHTML();
            editor.commands.setContent(latestContent + aiResponse);

            // // Clear the selection
            // editor.commands.unsetAllMarks();
            // editor.commands.setTextSelection({
            //     from: editor.state.selection.from,
            //     to: editor.state.selection.from
            // });
            AddNote({Note:editor.getHTML(),
              FileId:FileId,
              CreatedBy:user?.primaryEmailAddress?.emailAddress
            })

            toast.success('Response generated!', {
                id: toastId,
                duration: 2000
            });

        } catch (error) {
            console.error('AI search error:', error);
            toast.error('Failed to generate response', {
                duration: 3000
            });
            // Log the full error details
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                data: error.data
            });
        }
    }

    // PDF Download handler
    const handleDownloadPDF = () => {
        try {
            if (!editor) return;
            const content = editor.getHTML();

            const pdf = new jsPDF();
            pdf.setFont('helvetica');
            pdf.setFontSize(12);

            // Split content into pages if needed
            const splitText = pdf.splitTextToSize(content.replace(/<[^>]+>/g, ' '), 180);
            pdf.text(splitText, 10, 10);
            
            const filename = `notes_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            toast.success('PDF downloaded successfully');
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        }
    };

  return (
    <div className='px-4 py-2 border-2 border-slate-400 rounded-full sticky top-0 bg-white z-10'>
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-2">
          {/* Text Styling Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().toggleBold().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('bold') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Bold size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('italic') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Italic size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleUnderline().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('underline') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Underline size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleStrike().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('strike') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Strikethrough size={16}/>
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          {/* Headings Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Heading1 size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Heading2 size={16}/>
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          {/* List Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().toggleBulletList().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('bulletList') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <List size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleOrderedList().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('orderedList') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <ListOrdered size={16}/>
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          {/* Alignment Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <AlignLeft size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <AlignCenter size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <AlignRight size={16}/>
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          {/* Quote and Code Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().toggleBlockquote().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('blockquote') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Quote size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleCode().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${editor.isActive('code') ? 'bg-gray-100 text-blue-500' : ''}`}
            >
              <Code size={16}/>
            </button>
          </div>
          
          <div className="w-px h-4 bg-gray-300" />
          
          {/* History and Special Features Group */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => editor.chain().focus().undo().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${!editor.can().undo() ? 'opacity-50' : ''}`} 
              disabled={!editor.can().undo()}
            >
              <Undo size={16}/>
            </button>
            <button 
              onClick={() => editor.chain().focus().redo().run()} 
              className={`p-2 hover:bg-gray-100 rounded-lg ${!editor.can().redo() ? 'opacity-50' : ''}`} 
              disabled={!editor.can().redo()}
            >
              <Redo size={16}/>
            </button>
            <button 
              onClick={() => onAiclick()} 
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Sparkles size={16}/>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Download size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editorextension