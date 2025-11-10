import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useEditorState, useEditor, EditorContext, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { M as MediaLibrary, L as Label, T as Textarea } from './MediaLibrary_BbcgqFG1.mjs';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter, B as Button } from './dialog_DPQSnEoR.mjs';
import { I as Input } from './Input_CX_pScQ1.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from './Card_CppDnIQN.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select_BiE2BCUc.mjs';
import { c as cn } from './utils_B05Dmz_H.mjs';

function updateWrapperAlignment(editor, align) {
  const { state, view } = editor;
  const { selection } = state;
  const node = state.doc.nodeAt(selection.from);
  if (node?.type.name !== "image") return;
  const domPos = view.domAtPos(selection.from);
  let imgElement = null;
  if (domPos.node.nodeType === 1) {
    imgElement = domPos.node;
  } else if (domPos.node.nodeType === 3) {
    imgElement = domPos.node.parentElement;
  }
  if (!imgElement) return;
  const wrapper = imgElement.closest("[data-resize-wrapper]");
  if (wrapper) {
    if (align) {
      wrapper.setAttribute("data-align", align);
    } else {
      wrapper.removeAttribute("data-align");
    }
  }
}
function MenuBar({ editor, onImageClick, onLinkClick }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      const text = ctx.editor.state.doc.textContent;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const charactersWithoutSpaces = text.replace(/\s/g, "").length;
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        wordCount: words,
        characterCount: characters,
        characterCountWithoutSpaces: charactersWithoutSpaces,
        // Image alignment state
        hasSelectedImage: (() => {
          try {
            const { state } = ctx.editor;
            const { selection } = state;
            const node = state.doc.nodeAt(selection.from);
            return node?.type.name === "image" || false;
          } catch {
            return false;
          }
        })(),
        imageAlign: (() => {
          try {
            const { state } = ctx.editor;
            const { selection } = state;
            const node = state.doc.nodeAt(selection.from);
            if (node?.type.name === "image") {
              return node.attrs["data-align"] || null;
            }
            return null;
          } catch {
            return null;
          }
        })()
      };
    }
  });
  useEffect(() => {
    if (editorState.hasSelectedImage && editorState.imageAlign) {
      const timer = setTimeout(() => {
        updateWrapperAlignment(editor, editorState.imageAlign);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editorState.hasSelectedImage, editorState.imageAlign, editor]);
  const handleAlignClick = (align) => {
    const { state } = editor;
    const { selection } = state;
    const node = state.doc.nodeAt(selection.from);
    if (node && node.type.name === "image") {
      const newAlign = editorState.imageAlign === align ? null : align;
      editor.commands.updateAttributes("image", { "data-align": newAlign });
      setTimeout(() => {
        updateWrapperAlignment(editor, newAlign);
      }, 10);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          },
          disabled: !editorState.canBold,
          className: `p-2 rounded hover:bg-gray-200 transition-colors font-bold ${editorState.isBold ? "bg-gray-200" : ""}`,
          title: "Bold (Ctrl+B)",
          children: "B"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          },
          disabled: !editorState.canItalic,
          className: `p-2 rounded hover:bg-gray-200 transition-colors italic ${editorState.isItalic ? "bg-gray-200" : ""}`,
          title: "Italic (Ctrl+I)",
          children: "I"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          },
          disabled: !editorState.canStrike,
          className: `p-2 rounded hover:bg-gray-200 transition-colors line-through ${editorState.isStrike ? "bg-gray-200" : ""}`,
          title: "Strikethrough",
          children: "S"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          },
          disabled: !editorState.canCode,
          className: `p-2 rounded hover:bg-gray-200 transition-colors font-mono text-sm ${editorState.isCode ? "bg-gray-200" : ""}`,
          title: "Code",
          children: "</>"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().unsetAllMarks().run();
          },
          disabled: !editorState.canClearMarks,
          className: "p-2 rounded hover:bg-gray-200 transition-colors text-xs",
          title: "Clear marks",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().setParagraph().run();
          },
          className: `px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm ${editorState.isParagraph ? "bg-gray-200" : ""}`,
          title: "Normal Text",
          children: "P"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          },
          className: `px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading1 ? "bg-gray-200" : ""}`,
          title: "Heading 1",
          children: "H1"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          },
          className: `px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading2 ? "bg-gray-200" : ""}`,
          title: "Heading 2",
          children: "H2"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          },
          className: `px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${editorState.isHeading3 ? "bg-gray-200" : ""}`,
          title: "Heading 3",
          children: "H3"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          },
          className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isBulletList ? "bg-gray-200" : ""}`,
          title: "Bullet List",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          },
          className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isOrderedList ? "bg-gray-200" : ""}`,
          title: "Ordered List",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          },
          className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isBlockquote ? "bg-gray-200" : ""}`,
          title: "Blockquote",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          },
          className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isCodeBlock ? "bg-gray-200" : ""}`,
          title: "Code Block",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          },
          className: "p-2 rounded hover:bg-gray-200 transition-colors",
          title: "Horizontal Rule",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 12h14" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            onImageClick();
          },
          className: "p-2 rounded hover:bg-gray-200 transition-colors",
          title: "Insert Image",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            }
          ) })
        }
      ),
      editorState.hasSelectedImage && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              handleAlignClick("left");
            },
            className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === "left" ? "bg-gray-200" : ""}`,
            title: "Align Left (Alt+Shift+L)",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h8m-8 6h16" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              handleAlignClick("center");
            },
            className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === "center" ? "bg-gray-200" : ""}`,
            title: "Align Center (Alt+Shift+E)",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12h18M3 6h18M3 18h18" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              handleAlignClick("right");
            },
            className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.imageAlign === "right" ? "bg-gray-200" : ""}`,
            title: "Align Right (Alt+Shift+R)",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M8 12h12M4 18h16" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            onLinkClick();
          },
          className: `p-2 rounded hover:bg-gray-200 transition-colors ${editorState.isLink ? "bg-gray-200" : ""}`,
          title: "Insert Link",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border-r border-gray-300 pr-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          },
          disabled: !editorState.canUndo,
          className: "p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          title: "Undo (Ctrl+Z)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          },
          disabled: !editorState.canRedo,
          className: "p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          title: "Redo (Ctrl+Y)",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto text-xs text-gray-600", children: [
      /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-gray-100 rounded", title: "Word Count", children: [
        editorState.wordCount?.toLocaleString() || 0,
        " kata"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-gray-100 rounded", title: "Character Count", children: [
        editorState.characterCount?.toLocaleString() || 0,
        " karakter"
      ] })
    ] })
  ] });
}

function ArticleEditor({ content = "", onChange, placeholder = "Mulai menulis artikel Anda di sini...", className = "" }) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState("url");
  const [imageAlt, setImageAlt] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    // Required for SSR compatibility (Astro)
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      Image.configure({
        inline: false,
        // Images as block elements (not inline)
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true
        },
        HTMLAttributes: {
          class: "tiptap-image"
        }
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            alt: {
              default: null,
              parseHTML: (element) => element.getAttribute("alt"),
              renderHTML: (attributes) => {
                if (!attributes.alt) {
                  return {};
                }
                return {
                  alt: attributes.alt
                };
              }
            },
            "data-align": {
              default: null,
              parseHTML: (element) => element.getAttribute("data-align"),
              renderHTML: (attributes) => {
                if (!attributes["data-align"]) {
                  return {};
                }
                return {
                  "data-align": attributes["data-align"]
                };
              }
            },
            "data-description": {
              default: null,
              parseHTML: (element) => element.getAttribute("data-description"),
              renderHTML: (attributes) => {
                if (!attributes["data-description"]) {
                  return {};
                }
                return {
                  "data-description": attributes["data-description"]
                };
              }
            }
          };
        }
      }),
      Dropcursor.configure({
        color: "#3b82f6",
        width: 2
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800"
        }
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none min-h-[400px] p-4"
      },
      handleKeyDown: (view, event) => {
        if (event.altKey && event.shiftKey || event.metaKey && event.shiftKey) {
          const { state } = view;
          const { selection } = state;
          const node = state.doc.nodeAt(selection.from);
          if (node?.type.name === "image") {
            if (event.key === "L" || event.key === "l") {
              event.preventDefault();
              const currentAlign = node.attrs["data-align"];
              view.dispatch(
                view.state.tr.setNodeMarkup(selection.from, void 0, {
                  ...node.attrs,
                  "data-align": currentAlign === "left" ? null : "left"
                })
              );
              return true;
            }
            if (event.key === "E" || event.key === "e") {
              event.preventDefault();
              const currentAlign = node.attrs["data-align"];
              view.dispatch(
                view.state.tr.setNodeMarkup(selection.from, void 0, {
                  ...node.attrs,
                  "data-align": currentAlign === "center" ? null : "center"
                })
              );
              return true;
            }
            if (event.key === "R" || event.key === "r") {
              event.preventDefault();
              const currentAlign = node.attrs["data-align"];
              view.dispatch(
                view.state.tr.setNodeMarkup(selection.from, void 0, {
                  ...node.attrs,
                  "data-align": currentAlign === "right" ? null : "right"
                })
              );
              return true;
            }
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor: editor2 }) => {
      const html = editor2.getHTML();
      if (onChange) {
        onChange(html);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("articleEditorChange", {
            detail: { content: html }
          })
        );
      }
    }
  });
  useEffect(() => {
    const handler = (e) => {
      const custom = e;
      const url = custom.detail?.url;
      if (!url || !editor) return;
      editor.chain().focus().setImage({ src: url }).run();
      setImageUrl(url);
      setShowMediaLibrary(false);
      setShowImageDialog(false);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mediaLibrarySelect", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mediaLibrarySelect", handler);
      }
    };
  }, [editor]);
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  useEffect(() => {
    if (!editor) return;
    const addImageDescriptions = () => {
      const editorElement = editor.view.dom;
      if (!editorElement) return;
      const images = editorElement.querySelectorAll("img[data-description]");
      images.forEach((img) => {
        const imgElement = img;
        const description = imgElement.getAttribute("data-description");
        if (!description) return;
        const existingDesc = imgElement.nextElementSibling;
        if (existingDesc && existingDesc.classList.contains("image-description")) {
          existingDesc.textContent = description;
          return;
        }
        const descElement = document.createElement("div");
        descElement.className = "image-description";
        descElement.textContent = description;
        descElement.style.marginTop = "-1em";
        descElement.style.paddingTop = "0";
        descElement.style.paddingBottom = "0.5em";
        descElement.style.borderBottom = "1px solid #e5e7eb";
        descElement.style.fontSize = "12px";
        descElement.style.lineHeight = "1.2";
        descElement.style.color = "#6b7280";
        const nextSibling = imgElement.nextSibling;
        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent?.trim() === "") {
          imgElement.parentNode?.removeChild(nextSibling);
        }
        imgElement.parentNode?.insertBefore(descElement, imgElement.nextSibling);
      });
    };
    const handleUpdate = () => {
      setTimeout(addImageDescriptions, 0);
    };
    editor.on("update", handleUpdate);
    editor.on("create", handleUpdate);
    setTimeout(addImageDescriptions, 100);
    return () => {
      editor.off("update", handleUpdate);
      editor.off("create", handleUpdate);
    };
  }, [editor]);
  const providerValue = useMemo(() => ({ editor }), [editor]);
  if (!editor) {
    return null;
  }
  return /* @__PURE__ */ jsxs(EditorContext.Provider, { value: providerValue, children: [
    /* @__PURE__ */ jsxs("div", { className: `border border-gray-300 rounded-lg bg-white ${className}`, children: [
      editor && /* @__PURE__ */ jsx(
        MenuBar,
        {
          editor,
          onImageClick: () => {
            const { state } = editor;
            const { selection } = state;
            const node = state.doc.nodeAt(selection.from);
            if (node?.type.name === "image") {
              setIsEditingImage(true);
              setImageUrl(node.attrs.src || "");
              setImageAlt(node.attrs.alt || "");
              setImageDescription(node.attrs["data-description"] || "");
              setImageUploadMethod("url");
              setShowImageDialog(true);
            } else {
              setIsEditingImage(false);
              setImageUrl("");
              setImageAlt("");
              setImageDescription("");
              setImageUploadMethod("url");
              setShowImageDialog(true);
            }
          },
          onLinkClick: () => {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, " ");
            setLinkText(selectedText);
            if (editor.isActive("link")) {
              const attrs = editor.getAttributes("link");
              setLinkUrl(attrs.href || "");
            }
            setShowLinkDialog(true);
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "prose-wrapper overflow-auto max-h-[600px] tiptap-editor", children: /* @__PURE__ */ jsx(EditorContent, { editor }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
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
         
         .tiptap-editor .ProseMirror img[data-description] {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
         }
         
         /* Image with description */
         .tiptap-editor .ProseMirror .image-with-description {
            display: block;
            margin: 1rem 0;
         }
         
         .tiptap-editor .ProseMirror .image-description {
            font-size: 12px !important;
            line-height: 1.2 !important;
            color: #6b7280;
            margin-top: -1em !important;
            margin-bottom: 1rem;
            padding-top: 0 !important;
            padding-bottom: 0.5em !important;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
            font-style: italic;
            display: block;
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
      ` }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: showImageDialog,
        onOpenChange: (open) => {
          setShowImageDialog(open);
          if (!open) {
            setImageUrl("");
            setImageFile(null);
            setImagePreview("");
            setImageAlt("");
            setImageDescription("");
            setImageUploadMethod("url");
            setIsEditingImage(false);
          }
        },
        children: /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: isEditingImage ? "Edit Image" : "Insert Image" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: isEditingImage ? "Edit image URL and alt text" : "Upload an image file or enter an image URL" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
            !isEditingImage && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 border-b border-gray-200 pb-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setImageUploadMethod("url"),
                  className: `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageUploadMethod === "url" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                  children: "From URL"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setImageUploadMethod("file"),
                  className: `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageUploadMethod === "file" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                  children: "Upload File"
                }
              ),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowMediaLibrary(true), className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-100 text-indigo-700 hover:bg-indigo-200", children: "Pilih dari Media Library" })
            ] }),
            !isEditingImage && imageUploadMethod === "url" || isEditingImage ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Image URL" }),
                /* @__PURE__ */ jsx(Input, { type: "url", value: imageUrl, onChange: (e) => setImageUrl(e.target.value), placeholder: "https://example.com/image.jpg", autoFocus: true }),
                imageUrl && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: "Preview",
                    className: "max-w-full h-40 object-contain border border-gray-200 rounded-lg",
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                  "Deskripsi Gambar (Alt Text) ",
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(Opsional)" })
                ] }),
                /* @__PURE__ */ jsx(Input, { type: "text", value: imageAlt, onChange: (e) => setImageAlt(e.target.value), placeholder: "Contoh: Grafik pertumbuhan ekonomi Q4 2024", className: "text-sm" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Jelaskan gambar untuk aksesibilitas dan SEO" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                  "Deskripsi Gambar ",
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(Opsional)" })
                ] }),
                /* @__PURE__ */ jsx(Input, { type: "text", value: imageDescription, onChange: (e) => setImageDescription(e.target.value), placeholder: "Deskripsi yang akan ditampilkan di bawah gambar", className: "text-sm" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Deskripsi akan ditampilkan di bawah gambar dengan teks kecil" })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Image File" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "file",
                      accept: "image/*",
                      onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      },
                      className: "cursor-pointer"
                    }
                  ),
                  imagePreview && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                    /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Preview", className: "max-w-full h-40 object-contain border border-gray-200 rounded-lg" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [
                      "File: ",
                      imageFile?.name,
                      " (",
                      (imageFile?.size || 0) / 1024,
                      " KB)"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                  "Deskripsi Gambar (Alt Text) ",
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(Opsional)" })
                ] }),
                /* @__PURE__ */ jsx(Input, { type: "text", value: imageAlt, onChange: (e) => setImageAlt(e.target.value), placeholder: "Contoh: Grafik pertumbuhan ekonomi Q4 2024", className: "text-sm" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Jelaskan gambar untuk aksesibilitas dan SEO" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                  "Deskripsi Gambar ",
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(Opsional)" })
                ] }),
                /* @__PURE__ */ jsx(Input, { type: "text", value: imageDescription, onChange: (e) => setImageDescription(e.target.value), placeholder: "Deskripsi yang akan ditampilkan di bawah gambar", className: "text-sm" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Deskripsi akan ditampilkan di bawah gambar dengan teks kecil" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => {
                  setShowImageDialog(false);
                  setImageUrl("");
                  setImageFile(null);
                  setImagePreview("");
                  setImageAlt("");
                  setImageDescription("");
                  setImageUploadMethod("url");
                },
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                onClick: async () => {
                  if (isEditingImage) {
                    editor.chain().focus().updateAttributes("image", {
                      src: imageUrl,
                      alt: imageAlt || void 0,
                      "data-description": imageDescription || void 0
                    }).run();
                    setShowImageDialog(false);
                    setImageUrl("");
                    setImageAlt("");
                    setImageDescription("");
                    setIsEditingImage(false);
                  } else if (imageUploadMethod === "url" && imageUrl.trim()) {
                    editor.chain().focus().setImage({
                      src: imageUrl,
                      alt: imageAlt || void 0
                    }).run();
                    if (imageDescription) {
                      setTimeout(() => {
                        const { state } = editor;
                        const { selection } = state;
                        const node = state.doc.nodeAt(selection.from);
                        if (node?.type.name === "image") {
                          editor.chain().focus().updateAttributes("image", {
                            "data-description": imageDescription
                          }).run();
                        }
                      }, 10);
                    }
                    setShowImageDialog(false);
                    setImageUrl("");
                    setImageAlt("");
                    setImageDescription("");
                  } else if (imageUploadMethod === "file" && imagePreview) {
                    editor.chain().focus().setImage({
                      src: imagePreview,
                      alt: imageAlt || void 0
                    }).run();
                    if (imageDescription) {
                      setTimeout(() => {
                        const { state } = editor;
                        const { selection } = state;
                        const node = state.doc.nodeAt(selection.from);
                        if (node?.type.name === "image") {
                          editor.chain().focus().updateAttributes("image", {
                            "data-description": imageDescription
                          }).run();
                        }
                      }, 10);
                    }
                    setShowImageDialog(false);
                    setImageFile(null);
                    setImagePreview("");
                    setImageAlt("");
                    setImageDescription("");
                  }
                },
                disabled: isEditingImage ? !imageUrl.trim() : imageUploadMethod === "url" && !imageUrl.trim() || imageUploadMethod === "file" && !imagePreview,
                children: isEditingImage ? "Update" : "Insert"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: showMediaLibrary, onOpenChange: setShowMediaLibrary, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-5xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Pilih Gambar dari Media Library" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Gunakan gambar yang sudah diupload atau upload baru" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(MediaLibrary, {}) }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setShowMediaLibrary(false), children: "Tutup" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showLinkDialog, onOpenChange: setShowLinkDialog, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editor.isActive("link") ? "Edit Link" : "Insert Link" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Add a link to selected text or insert a new link" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Link URL" }),
          /* @__PURE__ */ jsx(Input, { type: "url", value: linkUrl, onChange: (e) => setLinkUrl(e.target.value), placeholder: "https://example.com", autoFocus: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Link Text (optional)" }),
          /* @__PURE__ */ jsx(Input, { type: "text", value: linkText, onChange: (e) => setLinkText(e.target.value), placeholder: "Link text" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              }
              setShowLinkDialog(false);
              setLinkUrl("");
              setLinkText("");
            },
            children: editor.isActive("link") ? "Remove Link" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: () => {
              if (linkUrl.trim()) {
                if (linkText.trim()) {
                  editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
                } else {
                  editor.chain().focus().setLink({ href: linkUrl }).run();
                }
                setShowLinkDialog(false);
                setLinkUrl("");
                setLinkText("");
              }
            },
            children: editor.isActive("link") ? "Update" : "Insert"
          }
        )
      ] })
    ] }) })
  ] });
}

function ArticleForm({ mode = "create", articleId, initialArticle, categories, sources, tags, selectedTagIds = [] }) {
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [summary, setSummary] = useState(initialArticle?.summary || "");
  const [metaTitle, setMetaTitle] = useState(initialArticle?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialArticle?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(initialArticle?.meta_keywords || "");
  const [content, setContent] = useState(initialArticle?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialArticle?.thumbnail_url || "");
  const [thumbnailPreview, setThumbnailPreview] = useState(initialArticle?.thumbnail_url || "");
  const [thumbnailAlt, setThumbnailAlt] = useState(initialArticle?.thumbnail_alt || "");
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 0);
  const [sourceId, setSourceId] = useState(initialArticle?.source_id || null);
  const [status, setStatus] = useState(initialArticle?.status || "draft");
  const [selectedTags, setSelectedTags] = useState(selectedTagIds);
  const [urlOriginal, setUrlOriginal] = useState(initialArticle?.url_original || "");
  const [featured, setFeatured] = useState(initialArticle?.featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  useEffect(() => {
    if (mode === "create") {
      const timer = setTimeout(() => {
        const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        setSlug(generatedSlug);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [title, mode]);
  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e2) => {
      if (e2.target?.result) {
        setThumbnailPreview(e2.target.result);
      }
    };
    reader.readAsDataURL(file);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      if (thumbnailAlt.trim()) {
        uploadFormData.append("alt_text", thumbnailAlt.trim());
      }
      const uploadResponse = await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: uploadFormData,
        credentials: "include"
      });
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        setThumbnailUrl(uploadResult.url);
        setThumbnailPreview(uploadResult.url);
      } else {
        const error = await uploadResponse.json();
        alert("Error uploading image: " + (error.error || "Upload failed"));
        e.target.value = "";
        setThumbnailPreview(initialArticle?.thumbnail_url || "");
      }
    } catch (error) {
      alert("Error: Gagal mengupload gambar");
      e.target.value = "";
      setThumbnailPreview(initialArticle?.thumbnail_url || "");
    }
  };
  useEffect(() => {
    const handler = (e) => {
      const custom = e;
      const url = custom.detail?.url;
      if (!url) return;
      setThumbnailUrl(url);
      setThumbnailPreview(url);
      setShowMediaLibrary(false);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mediaLibrarySelect", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mediaLibrarySelect", handler);
      }
    };
  }, []);
  const handleRemoveThumbnail = () => {
    setThumbnailUrl("");
    setThumbnailPreview("");
    setThumbnailAlt("");
  };
  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      title,
      slug,
      summary: summary || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywords || null,
      content,
      thumbnail_url: thumbnailUrl || null,
      thumbnail_alt: thumbnailAlt.trim() || null,
      category_id: categoryId,
      source_id: sourceId || null,
      status,
      tag_ids: selectedTags,
      url_original: urlOriginal || null,
      featured
    };
    try {
      const url = mode === "edit" && articleId ? `/api/articles/${articleId}` : "/api/articles";
      const method = mode === "edit" ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
      });
      if (response.ok) {
        toast.success(mode === "edit" ? "Artikel berhasil diperbarui!" : "Artikel berhasil dibuat!");
        setTimeout(() => {
          window.location.href = "/dashboard/articles";
        }, 500);
      } else {
        const error = await response.json();
        toast.error(error.error || (mode === "edit" ? "Gagal memperbarui artikel" : "Gagal membuat artikel"));
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(mode === "edit" ? "Gagal memperbarui artikel" : "Gagal membuat artikel");
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "border-2 w-full", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b bg-gradient-to-r from-blue-50 to-indigo-50", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-gray-900", children: mode === "edit" ? "Edit Artikel" : "Buat Artikel Baru" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "title", children: [
                "Judul Artikel ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(Input, { id: "title", type: "text", value: title, onChange: (e) => setTitle(e.target.value), required: true, placeholder: "Masukkan judul artikel" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "slug", children: [
                "Slug (URL) ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(Input, { id: "slug", type: "text", value: slug, onChange: (e) => setSlug(e.target.value), required: true, placeholder: "judul-artikel-url-friendly" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "URL-friendly version dari judul" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "summary", children: "Ringkasan" }),
              /* @__PURE__ */ jsx(Textarea, { id: "summary", value: summary, onChange: (e) => setSummary(e.target.value), rows: 3, placeholder: "Ringkasan singkat artikel (akan muncul di preview)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "content", children: [
                "Konten ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(ArticleEditor, { content, onChange: setContent })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "url_original", children: "URL Original (jika disadur)" }),
              /* @__PURE__ */ jsx(Input, { type: "url", id: "url_original", value: urlOriginal, onChange: (e) => setUrlOriginal(e.target.value), placeholder: "https://example.com/article" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-6", children: [
            /* @__PURE__ */ jsxs(Card, { className: "border border-gray-200", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Publishing" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "status", children: "Status" }),
                  /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { id: "status", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: "Draft" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "published", children: "Published" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "archived", children: "Archived" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "category_id", children: [
                    "Kategori ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxs(Select, { value: categoryId > 0 ? categoryId.toString() : void 0, onValueChange: (value) => setCategoryId(parseInt(value)), required: true, children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { id: "category_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih Kategori" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.id.toString(), children: cat.name }, cat.id)) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "source_id", children: "Sumber" }),
                  /* @__PURE__ */ jsxs(Select, { value: sourceId ? sourceId.toString() : void 0, onValueChange: (value) => setSourceId(value ? parseInt(value) : null), children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { id: "source_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih Sumber" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: sources.map((source) => /* @__PURE__ */ jsx(SelectItem, { value: source.id.toString(), children: source.name }, source.id)) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 pt-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      id: "featured",
                      checked: featured,
                      onChange: (e) => setFeatured(e.target.checked),
                      className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    }
                  ),
                  /* @__PURE__ */ jsx(Label, { htmlFor: "featured", className: "text-sm font-medium cursor-pointer", children: "Featured Article ⭐" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "border border-gray-200", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Tags" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "relative", id: "tags", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-3 min-h-[2rem]", children: [
                  selectedTags.map((id) => {
                    const t = tags.find((x) => x.id === id);
                    if (!t) return null;
                    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs", children: [
                      t.name,
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleTagToggle(id), className: "-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-100", "aria-label": `Hapus tag ${t.name}`, children: "×" })
                    ] }, id);
                  }),
                  selectedTags.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Belum ada tag" })
                ] }),
                /* @__PURE__ */ jsx(TagMultiSelect, { allTags: tags, selected: selectedTags, onToggle: handleTagToggle })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "border border-gray-200", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Featured Image" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(Input, { type: "file", id: "thumbnail_file", accept: "image/jpeg,image/jpg,image/png,image/webp,image/gif", onChange: handleThumbnailChange, className: "cursor-pointer text-sm" }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "secondary", size: "sm", onClick: () => setShowMediaLibrary(true), className: "w-full", children: "Pilih dari Media Library" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Max 5MB. Format: JPG, PNG, WebP, GIF" }),
                thumbnailPreview && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("img", { src: thumbnailPreview, alt: thumbnailAlt || "Thumbnail preview", className: "w-full h-32 object-cover rounded-lg border" }),
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: handleRemoveThumbnail, className: "w-full text-destructive hover:text-destructive", children: "Hapus Gambar" })
                ] }),
                (thumbnailPreview || thumbnailUrl) && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "thumbnail_alt", className: "text-sm", children: [
                    "Alt Text ",
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs font-normal", children: "(SEO)" })
                  ] }),
                  /* @__PURE__ */ jsx(Input, { id: "thumbnail_alt", type: "text", value: thumbnailAlt, onChange: (e) => setThumbnailAlt(e.target.value), placeholder: "Deskripsi gambar", className: "text-sm" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "border border-gray-200", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "SEO Settings" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "meta_title", className: "text-sm", children: "Meta Title" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "meta_title",
                      type: "text",
                      value: metaTitle,
                      onChange: (e) => setMetaTitle(e.target.value),
                      placeholder: title || "Judul SEO",
                      maxLength: 60,
                      className: "text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                    metaTitle.length || title.length,
                    "/60"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "meta_description", className: "text-sm", children: "Meta Description" }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      id: "meta_description",
                      value: metaDescription,
                      onChange: (e) => setMetaDescription(e.target.value),
                      rows: 3,
                      placeholder: "Deskripsi untuk SEO (150-160 karakter)",
                      maxLength: 160,
                      className: "text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                    metaDescription.length,
                    "/160"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "meta_keywords", className: "text-sm", children: "Meta Keywords" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "meta_keywords",
                      type: "text",
                      value: metaKeywords,
                      onChange: (e) => setMetaKeywords(e.target.value),
                      placeholder: "keyword1, keyword2",
                      className: "text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Pisahkan dengan koma" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 pt-6 mt-6 border-t", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "/dashboard/articles", children: "Batal" }) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Menyimpan..." : mode === "edit" ? "Simpan Perubahan" : "Simpan Artikel" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showMediaLibrary, onOpenChange: setShowMediaLibrary, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-5xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Pilih Thumbnail dari Media Library" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Gunakan gambar yang sudah diupload atau upload baru" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(MediaLibrary, {}) }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setShowMediaLibrary(false), children: "Tutup" }) })
    ] }) })
  ] });
}
function TagMultiSelect({ allTags, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = query ? allTags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())) : allTags;
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsx("span", { className: cn("truncate", selected.length ? "text-foreground" : "text-muted-foreground"), children: selected.length > 0 ? `${selected.length} tag dipilih` : "Pilih tags..." }),
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 opacity-70", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z", clipRule: "evenodd" }) })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2 border-b bg-gray-50", children: /* @__PURE__ */ jsx(Input, { placeholder: "Cari tag...", value: query, onChange: (e) => setQuery(e.target.value), className: "h-9", autoFocus: true }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-h-56 overflow-auto py-1", children: [
        filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-sm text-muted-foreground", children: "Tidak ada hasil" }),
        filtered.map((tag) => {
          const checked = selected.includes(tag.id);
          return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onToggle(tag.id), className: cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50", checked ? "bg-blue-50/60" : ""), children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", readOnly: true, checked, className: "h-4 w-4 rounded border-input text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: tag.name })
          ] }, tag.id);
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t bg-gray-50 px-2 py-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          selected.length,
          " dipilih"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setOpen(false), children: "Tutup" }),
          /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", onClick: () => setOpen(false), children: "Selesai" })
        ] })
      ] })
    ] })
  ] });
}

export { ArticleForm as A };
