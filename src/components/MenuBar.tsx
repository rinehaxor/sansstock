import React, { useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

interface MenuBarProps {
   editor: Editor;
   onImageClick: () => void;
   onLinkClick: () => void;
}

// Helper function to update wrapper alignment
function updateWrapperAlignment(editor: Editor, align: string | null) {
   const { state, view } = editor;
   const { selection } = state;

   // Find the image node position
   const node = state.doc.nodeAt(selection.from);
   if (node?.type.name !== 'image') return;

   // Get DOM node for the image
   const domPos = view.domAtPos(selection.from);
   let imgElement: HTMLElement | null = null;

   if (domPos.node.nodeType === 1) {
      imgElement = domPos.node as HTMLElement;
   } else if (domPos.node.nodeType === 3) {
      imgElement = domPos.node.parentElement;
   }

   if (!imgElement) return;

   // Find the wrapper
   const wrapper = imgElement.closest('[data-resize-wrapper]') as HTMLElement;
   if (wrapper) {
      if (align) {
         wrapper.setAttribute('data-align', align);
      } else {
         wrapper.removeAttribute('data-align');
      }
   }
}

export default function MenuBar({ editor, onImageClick, onLinkClick }: MenuBarProps) {
   // Read the current editor's state, and re-render the component when it changes
   const editorState = useEditorState({
      editor,
      selector: (ctx) => {
         if (!ctx.editor) return {};
         return {
            isBold: ctx.editor.isActive('bold') ?? false,
            canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
            isItalic: ctx.editor.isActive('italic') ?? false,
            canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
            isStrike: ctx.editor.isActive('strike') ?? false,
            canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
            isCode: ctx.editor.isActive('code') ?? false,
            canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
            canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
            isParagraph: ctx.editor.isActive('paragraph') ?? false,
            isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
            isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
            isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
            isBulletList: ctx.editor.isActive('bulletList') ?? false,
            isOrderedList: ctx.editor.isActive('orderedList') ?? false,
            isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
            isBlockquote: ctx.editor.isActive('blockquote') ?? false,
            canUndo: ctx.editor.can().chain().undo().run() ?? false,
            canRedo: ctx.editor.can().chain().redo().run() ?? false,
            isLink: ctx.editor.isActive('link') ?? false,
            // Image alignment state
            hasSelectedImage: (() => {
               try {
                  const { state } = ctx.editor;
                  const { selection } = state;
                  const node = state.doc.nodeAt(selection.from);
                  return node?.type.name === 'image' || false;
               } catch {
                  return false;
               }
            })(),
            imageAlign: (() => {
               try {
                  const { state } = ctx.editor;
                  const { selection } = state;
                  const node = state.doc.nodeAt(selection.from);
                  if (node?.type.name === 'image') {
                     return node.attrs['data-align'] || null;
                  }
                  return null;
               } catch {
                  return null;
               }
            })(),
         };
      },
   });

   // Sync wrapper alignment when editor state changes
   useEffect(() => {
      if (editorState.hasSelectedImage && editorState.imageAlign) {
         // Small delay to ensure DOM is updated
         const timer = setTimeout(() => {
            updateWrapperAlignment(editor, editorState.imageAlign);
         }, 50);
         return () => clearTimeout(timer);
      }
   }, [editorState.hasSelectedImage, editorState.imageAlign, editor]);

   const handleAlignClick = (align: 'left' | 'center' | 'right') => {
      const { state } = editor;
      const { selection } = state;
      const node = state.doc.nodeAt(selection.from);

      if (node && node.type.name === 'image') {
         const newAlign = editorState.imageAlign === align ? null : align;
         editor.commands.updateAttributes('image', { 'data-align': newAlign });

         // Update wrapper after a short delay to ensure DOM is ready
         setTimeout(() => {
            updateWrapperAlignment(editor, newAlign);
         }, 10);
      }
   };

   return (
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
         {/* Text Formatting */}
         <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBold().run();
               }}
               disabled={!editorState.canBold}
               className={`p-2 rounded hover:bg-gray-200 transition-colors font-bold ${editorState.isBold ? 'bg-gray-200' : ''}`}
               title="Bold (Ctrl+B)"
            >
               B
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleItalic().run();
               }}
               disabled={!editorState.canItalic}
               className={`p-2 rounded hover:bg-gray-200 transition-colors italic ${editorState.isItalic ? 'bg-gray-200' : ''}`}
               title="Italic (Ctrl+I)"
            >
               I
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleStrike().run();
               }}
               disabled={!editorState.canStrike}
               className={`p-2 rounded hover:bg-gray-200 transition-colors line-through ${editorState.isStrike ? 'bg-gray-200' : ''}`}
               title="Strikethrough"
            >
               S
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleCode().run();
               }}
               disabled={!editorState.canCode}
               className={`p-2 rounded hover:bg-gray-200 transition-colors font-mono text-sm ${editorState.isCode ? 'bg-gray-200' : ''}`}
               title="Code"
            >
               {'</>'}
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().unsetAllMarks().run();
               }}
               disabled={!editorState.canClearMarks}
               className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
               title="Clear marks"
            >
               Clear
            </button>
         </div>

         {/* Headings */}
         <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setParagraph().run();
               }}
               className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm ${editorState.isParagraph ? 'bg-gray-200' : ''}`}
               title="Normal Text"
            >
               P
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
               }}
               className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading1 ? 'bg-gray-200' : ''}`}
               title="Heading 1"
            >
               H1
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
               }}
               className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading2 ? 'bg-gray-200' : ''}`}
               title="Heading 2"
            >
               H2
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
               }}
               className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading3 ? 'bg-gray-200' : ''}`}
               title="Heading 3"
            >
               H3
            </button>
         </div>

         {/* Lists */}
         <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBulletList().run();
               }}
               className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isBulletList ? 'bg-gray-200' : ''}`}
               title="Bullet List"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
               </svg>
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleOrderedList().run();
               }}
               className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isOrderedList ? 'bg-gray-200' : ''}`}
               title="Ordered List"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
               </svg>
            </button>
         </div>

         {/* Block Quote & Code Block */}
         <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleBlockquote().run();
               }}
               className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isBlockquote ? 'bg-gray-200' : ''}`}
               title="Blockquote"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
               </svg>
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleCodeBlock().run();
               }}
               className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isCodeBlock ? 'bg-gray-200' : ''}`}
               title="Code Block"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
               </svg>
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setHorizontalRule().run();
               }}
               className="p-2 rounded hover:bg-gray-200 transition-colors"
               title="Horizontal Rule"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
               </svg>
            </button>
         </div>

         {/* Image & Link */}
         <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  onImageClick();
               }}
               className="p-2 rounded hover:bg-gray-200 transition-colors"
               title="Insert Image"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
               </svg>
            </button>
            {/* Image Alignment Buttons - Only show when image is selected */}
            {editorState.hasSelectedImage && (
               <>
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        handleAlignClick('left');
                     }}
                     className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === 'left' ? 'bg-gray-200' : ''}`}
                     title="Align Left (Alt+Shift+L)"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                     </svg>
                  </button>
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        handleAlignClick('center');
                     }}
                     className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === 'center' ? 'bg-gray-200' : ''}`}
                     title="Align Center (Alt+Shift+E)"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                     </svg>
                  </button>
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        handleAlignClick('right');
                     }}
                     className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === 'right' ? 'bg-gray-200' : ''}`}
                     title="Align Right (Alt+Shift+R)"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h12M4 18h16" />
                     </svg>
                  </button>
               </>
            )}
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  onLinkClick();
               }}
               className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isLink ? 'bg-gray-200' : ''}`}
               title="Insert Link"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
               </svg>
            </button>
         </div>

         {/* Undo/Redo */}
         <div className="flex items-center gap-1">
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().undo().run();
               }}
               disabled={!editorState.canUndo}
               className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               title="Undo (Ctrl+Z)"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
               </svg>
            </button>
            <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().redo().run();
               }}
               disabled={!editorState.canRedo}
               className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               title="Redo (Ctrl+Y)"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
               </svg>
            </button>
         </div>
      </div>
   );
}
