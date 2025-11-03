import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import MenuBar from './MenuBar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ArticleEditorProps {
   content: string;
   onChange: (content: string) => void;
   placeholder?: string;
   className?: string;
}

export default function ArticleEditor({ content = '', onChange, placeholder = 'Mulai menulis artikel Anda di sini...', className = '', id }: ArticleEditorProps) {
   const [showImageDialog, setShowImageDialog] = useState(false);
   const [isEditingImage, setIsEditingImage] = useState(false);
   const [imageUrl, setImageUrl] = useState('');
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string>('');
   const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'file'>('url');
   const [imageAlt, setImageAlt] = useState('');
   const [showLinkDialog, setShowLinkDialog] = useState(false);
   const [linkUrl, setLinkUrl] = useState('');
   const [linkText, setLinkText] = useState('');

   const editor = useEditor({
      immediatelyRender: false, // Required for SSR compatibility (Astro)
      extensions: [
         StarterKit.configure({
            heading: {
               levels: [1, 2, 3],
            },
            bulletList: {
               keepMarks: true,
               keepAttributes: false,
            },
            orderedList: {
               keepMarks: true,
               keepAttributes: false,
            },
         }),
         Placeholder.configure({
            placeholder,
         }),
         Image.configure({
            inline: false, // Images as block elements (not inline)
            allowBase64: true,
            resize: {
               enabled: true,
               directions: ['top', 'bottom', 'left', 'right'],
               minWidth: 50,
               minHeight: 50,
               alwaysPreserveAspectRatio: true,
            },
            HTMLAttributes: {
               class: 'tiptap-image',
            },
         }).extend({
            addAttributes() {
               return {
                  ...this.parent?.(),
                  alt: {
                     default: null,
                     parseHTML: (element) => element.getAttribute('alt'),
                     renderHTML: (attributes) => {
                        if (!attributes.alt) {
                           return {};
                        }
                        return {
                           alt: attributes.alt,
                        };
                     },
                  },
                  'data-align': {
                     default: null,
                     parseHTML: (element) => element.getAttribute('data-align'),
                     renderHTML: (attributes) => {
                        if (!attributes['data-align']) {
                           return {};
                        }
                        return {
                           'data-align': attributes['data-align'],
                        };
                     },
                  },
               };
            },
         }),
         Dropcursor.configure({
            color: '#3b82f6',
            width: 2,
         }),
         Link.configure({
            openOnClick: false,
            HTMLAttributes: {
               class: 'text-blue-600 underline hover:text-blue-800',
            },
         }),
      ],
      content,
      editorProps: {
         attributes: {
            class: 'tiptap-content focus:outline-none min-h-[400px] p-4',
         },
         handleKeyDown: (view, event) => {
            // Image alignment keyboard shortcuts
            if ((event.altKey && event.shiftKey) || (event.metaKey && event.shiftKey)) {
               const { state } = view;
               const { selection } = state;
               const node = state.doc.nodeAt(selection.from);

               if (node?.type.name === 'image') {
                  if (event.key === 'L' || event.key === 'l') {
                     event.preventDefault();
                     const currentAlign = node.attrs['data-align'];
                     view.dispatch(
                        view.state.tr.setNodeMarkup(selection.from, undefined, {
                           ...node.attrs,
                           'data-align': currentAlign === 'left' ? null : 'left',
                        })
                     );
                     return true;
                  }
                  if (event.key === 'E' || event.key === 'e') {
                     event.preventDefault();
                     const currentAlign = node.attrs['data-align'];
                     view.dispatch(
                        view.state.tr.setNodeMarkup(selection.from, undefined, {
                           ...node.attrs,
                           'data-align': currentAlign === 'center' ? null : 'center',
                        })
                     );
                     return true;
                  }
                  if (event.key === 'R' || event.key === 'r') {
                     event.preventDefault();
                     const currentAlign = node.attrs['data-align'];
                     view.dispatch(
                        view.state.tr.setNodeMarkup(selection.from, undefined, {
                           ...node.attrs,
                           'data-align': currentAlign === 'right' ? null : 'right',
                        })
                     );
                     return true;
                  }
               }
            }
            return false;
         },
      },
      onUpdate: ({ editor }) => {
         const html = editor.getHTML();
         if (onChange) {
            onChange(html);
         }
         // Also dispatch global event for Astro script
         if (typeof window !== 'undefined') {
            window.dispatchEvent(
               new CustomEvent('articleEditorChange', {
                  detail: { content: html },
               })
            );
         }
      },
   });

   // Update editor content when prop changes
   useEffect(() => {
      if (editor && content !== editor.getHTML()) {
         editor.commands.setContent(content);
      }
   }, [content, editor]);

   // Memoize the provider value to avoid unnecessary re-renders
   const providerValue = useMemo(() => ({ editor }), [editor]);

   if (!editor) {
      return null;
   }

   return (
      <EditorContext.Provider value={providerValue}>
         <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
            {/* Toolbar - Using MenuBar component with useEditorState for optimized re-renders */}
            {editor && (
               <MenuBar
                  editor={editor}
                  onImageClick={() => {
                     // Check if an image is selected
                     const { state } = editor;
                     const { selection } = state;
                     const node = state.doc.nodeAt(selection.from);

                     if (node?.type.name === 'image') {
                        // Edit existing image
                        setIsEditingImage(true);
                        setImageUrl(node.attrs.src || '');
                        setImageAlt(node.attrs.alt || '');
                        setImageUploadMethod('url'); // Always show URL mode for editing
                        setShowImageDialog(true);
                     } else {
                        // Insert new image
                        setIsEditingImage(false);
                        setImageUrl('');
                        setImageAlt('');
                        setImageUploadMethod('url');
                        setShowImageDialog(true);
                     }
                  }}
                  onLinkClick={() => {
                     const { from, to } = editor.state.selection;
                     const selectedText = editor.state.doc.textBetween(from, to, ' ');
                     setLinkText(selectedText);
                     if (editor.isActive('link')) {
                        const attrs = editor.getAttributes('link');
                        setLinkUrl(attrs.href || '');
                     }
                     setShowLinkDialog(true);
                  }}
               />
            )}

            {/* Editor Content */}
            <div className="prose-wrapper overflow-auto max-h-[600px] tiptap-editor">
               <EditorContent editor={editor} />
            </div>
         </div>

         {/* Custom Styles for Tiptap Editor */}
         <style>{`
         .tiptap-editor .ProseMirror {
            outline: none;
         }
         
         .tiptap-editor .ProseMirror h1 {
            font-size: 2em !important;
            font-weight: 700 !important;
            margin-top: 0.67em !important;
            margin-bottom: 0.67em !important;
            line-height: 1.2 !important;
         }
         
         .tiptap-editor .ProseMirror h2 {
            font-size: 1.5em !important;
            font-weight: 600 !important;
            margin-top: 0.83em !important;
            margin-bottom: 0.83em !important;
            line-height: 1.3 !important;
         }
         
         .tiptap-editor .ProseMirror h3 {
            font-size: 1.17em !important;
            font-weight: 600 !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
            line-height: 1.4 !important;
         }
         
         .tiptap-editor .ProseMirror h4 {
            font-size: 1em !important;
            font-weight: 600 !important;
            margin-top: 1.33em !important;
            margin-bottom: 1.33em !important;
         }
         
         .tiptap-editor .ProseMirror h5 {
            font-size: 0.83em !important;
            font-weight: 600 !important;
            margin-top: 1.67em !important;
            margin-bottom: 1.67em !important;
         }
         
         .tiptap-editor .ProseMirror h6 {
            font-size: 0.67em !important;
            font-weight: 600 !important;
            margin-top: 2.33em !important;
            margin-bottom: 2.33em !important;
         }
         
         .tiptap-editor .ProseMirror p {
            margin-top: 1em !important;
            margin-bottom: 1em !important;
         }
         
         .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
         }
         
         .tiptap-editor .ProseMirror ul,
         .tiptap-editor .ProseMirror ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
         }
         
         .tiptap-editor .ProseMirror blockquote {
            border-left: 3px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
         }
         
         .tiptap-editor .ProseMirror code {
            background-color: #f3f4f6;
            border-radius: 0.25rem;
            padding: 0.125rem 0.25rem;
            font-size: 0.875em;
         }
         
         .tiptap-editor .ProseMirror pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
         }
         
         .tiptap-editor .ProseMirror pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
         }
         
         .tiptap-editor .ProseMirror img {
            display: block;
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
            cursor: default;
         }
         
         /* Resizable Image Handles */
         .tiptap-editor .ProseMirror [data-resize-handle] {
            position: absolute;
            background: rgba(59, 130, 246, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 2px;
            z-index: 10;
            transition: background 0.2s;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle]:hover {
            background: rgba(59, 130, 246, 1);
         }
         
         /* Corner handles */
         .tiptap-editor .ProseMirror [data-resize-handle='top-left'],
         .tiptap-editor .ProseMirror [data-resize-handle='top-right'],
         .tiptap-editor .ProseMirror [data-resize-handle='bottom-left'],
         .tiptap-editor .ProseMirror [data-resize-handle='bottom-right'] {
            width: 8px;
            height: 8px;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='top-left'] {
            top: -4px;
            left: -4px;
            cursor: nwse-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='top-right'] {
            top: -4px;
            right: -4px;
            cursor: nesw-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='bottom-left'] {
            bottom: -4px;
            left: -4px;
            cursor: nesw-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='bottom-right'] {
            bottom: -4px;
            right: -4px;
            cursor: nwse-resize;
         }
         
         /* Edge handles */
         .tiptap-editor .ProseMirror [data-resize-handle='top'],
         .tiptap-editor .ProseMirror [data-resize-handle='bottom'] {
            height: 6px;
            left: 8px;
            right: 8px;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='top'] {
            top: -3px;
            cursor: ns-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='bottom'] {
            bottom: -3px;
            cursor: ns-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='left'],
         .tiptap-editor .ProseMirror [data-resize-handle='right'] {
            width: 6px;
            top: 8px;
            bottom: 8px;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='left'] {
            left: -3px;
            cursor: ew-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-handle='right'] {
            right: -3px;
            cursor: ew-resize;
         }
         
         .tiptap-editor .ProseMirror [data-resize-state="true"] [data-resize-wrapper] {
            outline: 1px solid rgba(59, 130, 246, 0.5);
            border-radius: 0.5rem;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper] {
            position: relative;
            display: inline-block;
            max-width: 100%;
         }
         
         /* Apply data-align to wrapper via JavaScript will handle this, but CSS backup */
         .tiptap-editor .ProseMirror [data-resize-wrapper][data-align="left"],
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="left"]) {
            float: left !important;
            clear: left !important;
            margin-right: 1rem !important;
            margin-bottom: 1rem !important;
            margin-left: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper][data-align="right"],
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="right"]) {
            float: right !important;
            clear: right !important;
            margin-left: 1rem !important;
            margin-bottom: 1rem !important;
            margin-right: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper][data-align="center"],
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="center"]) {
            float: none !important;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
         }
         
         /* Image Alignment Styles */
         .tiptap-editor .ProseMirror img[data-align="left"] {
            float: left !important;
            margin-right: 1rem !important;
            margin-bottom: 1rem !important;
            margin-left: 0 !important;
            clear: left !important;
         }
         
         .tiptap-editor .ProseMirror img[data-align="center"] {
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
            clear: none !important;
         }
         
         .tiptap-editor .ProseMirror img[data-align="right"] {
            float: right !important;
            margin-left: 1rem !important;
            margin-bottom: 1rem !important;
            margin-right: 0 !important;
            clear: right !important;
         }
         
         .tiptap-editor .ProseMirror img:not([data-align]) {
            display: block !important;
            float: none !important;
            margin-left: auto !important;
            margin-right: auto !important;
         }
         
         /* Ensure wrapper respects float for alignment */
         .tiptap-editor .ProseMirror [data-resize-wrapper] {
            display: inline-block !important;
            position: relative !important;
         }
         
         /* Float the wrapper itself for alignment */
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="left"]) {
            float: left !important;
            clear: left !important;
            margin-right: 1rem !important;
            margin-bottom: 1rem !important;
            margin-left: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="right"]) {
            float: right !important;
            clear: right !important;
            margin-left: 1rem !important;
            margin-bottom: 1rem !important;
            margin-right: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper]:has(img[data-align="center"]) {
            float: none !important;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper] img[data-align="left"] {
            float: left !important;
            display: block !important;
            margin: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper] img[data-align="right"] {
            float: right !important;
            display: block !important;
            margin: 0 !important;
         }
         
         .tiptap-editor .ProseMirror [data-resize-wrapper] img[data-align="center"] {
            float: none !important;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
         }
         
         /* Fix parent container for float alignment - use clearfix technique */
         .tiptap-editor .ProseMirror p:has([data-resize-wrapper]:has(img[data-align="right"])),
         .tiptap-editor .ProseMirror p:has(img[data-align="right"]),
         .tiptap-editor .ProseMirror div:has([data-resize-wrapper]:has(img[data-align="right"])),
         .tiptap-editor .ProseMirror div:has(img[data-align="right"]) {
            display: block !important;
            width: 100% !important;
            overflow: hidden !important;
            clear: both !important;
         }
         
         .tiptap-editor .ProseMirror p:has([data-resize-wrapper]:has(img[data-align="left"])),
         .tiptap-editor .ProseMirror p:has(img[data-align="left"]),
         .tiptap-editor .ProseMirror div:has([data-resize-wrapper]:has(img[data-align="left"])),
         .tiptap-editor .ProseMirror div:has(img[data-align="left"]) {
            display: block !important;
            width: 100% !important;
            overflow: hidden !important;
            clear: both !important;
         }
         
         .tiptap-editor .ProseMirror a {
            color: #2563eb;
            text-decoration: underline;
         }
         
         .tiptap-editor .ProseMirror a:hover {
            color: #1d4ed8;
         }
      `}</style>

         {/* Image Insert Dialog */}
         <Dialog
            open={showImageDialog}
            onOpenChange={(open) => {
               setShowImageDialog(open);
               if (!open) {
                  // Reset state when dialog closes
                  setImageUrl('');
                  setImageFile(null);
                  setImagePreview('');
                  setImageAlt('');
                  setImageUploadMethod('url');
                  setIsEditingImage(false);
               }
            }}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{isEditingImage ? 'Edit Image' : 'Insert Image'}</DialogTitle>
                  <DialogDescription>{isEditingImage ? 'Edit image URL and alt text' : 'Upload an image file or enter an image URL'}</DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  {/* Upload Method Toggle - Hide when editing */}
                  {!isEditingImage && (
                     <div className="flex gap-2 border-b border-gray-200 pb-3">
                        <button
                           type="button"
                           onClick={() => setImageUploadMethod('url')}
                           className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageUploadMethod === 'url' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                           From URL
                        </button>
                        <button
                           type="button"
                           onClick={() => setImageUploadMethod('file')}
                           className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageUploadMethod === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                           Upload File
                        </button>
                     </div>
                  )}

                  {(!isEditingImage && imageUploadMethod === 'url') || isEditingImage ? (
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                           <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" autoFocus />
                           {imageUrl && (
                              <div className="mt-3">
                                 <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-w-full h-40 object-contain border border-gray-200 rounded-lg"
                                    onError={(e) => {
                                       (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                 />
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deskripsi Gambar (Alt Text) <span className="text-xs text-gray-500 font-normal">(Opsional)</span>
                           </label>
                           <Input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Contoh: Grafik pertumbuhan ekonomi Q4 2024" className="text-sm" />
                           <p className="text-xs text-gray-500 mt-1">Jelaskan gambar untuk aksesibilitas dan SEO</p>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Select Image File</label>
                           <div className="space-y-3">
                              <Input
                                 type="file"
                                 accept="image/*"
                                 onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                       setImageFile(file);
                                       // Create preview
                                       const reader = new FileReader();
                                       reader.onloadend = () => {
                                          setImagePreview(reader.result as string);
                                       };
                                       reader.readAsDataURL(file);
                                    }
                                 }}
                                 className="cursor-pointer"
                              />
                              {imagePreview && (
                                 <div className="mt-3">
                                    <img src={imagePreview} alt="Preview" className="max-w-full h-40 object-contain border border-gray-200 rounded-lg" />
                                    <p className="text-xs text-gray-500 mt-2">
                                       File: {imageFile?.name} ({(imageFile?.size || 0) / 1024} KB)
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deskripsi Gambar (Alt Text) <span className="text-xs text-gray-500 font-normal">(Opsional)</span>
                           </label>
                           <Input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Contoh: Grafik pertumbuhan ekonomi Q4 2024" className="text-sm" />
                           <p className="text-xs text-gray-500 mt-1">Jelaskan gambar untuk aksesibilitas dan SEO</p>
                        </div>
                     </div>
                  )}
               </div>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                        setShowImageDialog(false);
                        setImageUrl('');
                        setImageFile(null);
                        setImagePreview('');
                        setImageAlt('');
                        setImageUploadMethod('url');
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     onClick={async () => {
                        if (isEditingImage) {
                           // Update existing image attributes
                           editor
                              .chain()
                              .focus()
                              .updateAttributes('image', {
                                 src: imageUrl,
                                 alt: imageAlt || undefined,
                              })
                              .run();
                           setShowImageDialog(false);
                           setImageUrl('');
                           setImageAlt('');
                           setIsEditingImage(false);
                        } else if (imageUploadMethod === 'url' && imageUrl.trim()) {
                           // Insert new image from URL
                           editor
                              .chain()
                              .focus()
                              .setImage({ src: imageUrl, alt: imageAlt || undefined })
                              .run();
                           setShowImageDialog(false);
                           setImageUrl('');
                           setImageAlt('');
                        } else if (imageUploadMethod === 'file' && imagePreview) {
                           // Insert new image from file
                           editor
                              .chain()
                              .focus()
                              .setImage({ src: imagePreview, alt: imageAlt || undefined })
                              .run();
                           setShowImageDialog(false);
                           setImageFile(null);
                           setImagePreview('');
                           setImageAlt('');
                        }
                     }}
                     disabled={isEditingImage ? !imageUrl.trim() : (imageUploadMethod === 'url' && !imageUrl.trim()) || (imageUploadMethod === 'file' && !imagePreview)}
                  >
                     {isEditingImage ? 'Update' : 'Insert'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Link Insert Dialog */}
         <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{editor.isActive('link') ? 'Edit Link' : 'Insert Link'}</DialogTitle>
                  <DialogDescription>Add a link to selected text or insert a new link</DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                     <Input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" autoFocus />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Link Text (optional)</label>
                     <Input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Link text" />
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                        if (editor.isActive('link')) {
                           editor.chain().focus().unsetLink().run();
                        }
                        setShowLinkDialog(false);
                        setLinkUrl('');
                        setLinkText('');
                     }}
                  >
                     {editor.isActive('link') ? 'Remove Link' : 'Cancel'}
                  </Button>
                  <Button
                     type="button"
                     onClick={() => {
                        if (linkUrl.trim()) {
                           if (linkText.trim()) {
                              // Replace selected text with link
                              editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
                           } else {
                              // Apply link to selected text
                              editor.chain().focus().setLink({ href: linkUrl }).run();
                           }
                           setShowLinkDialog(false);
                           setLinkUrl('');
                           setLinkText('');
                        }
                     }}
                  >
                     {editor.isActive('link') ? 'Update' : 'Insert'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </EditorContext.Provider>
   );
}
