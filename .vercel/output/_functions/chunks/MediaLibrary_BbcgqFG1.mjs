import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { C as Card, d as CardContent } from './Card_CppDnIQN.mjs';
import { I as Input } from './Input_CX_pScQ1.mjs';
import { c as cn } from './utils_B05Dmz_H.mjs';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { B as Button, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog_DPQSnEoR.mjs';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background shadow-sm transition-colors placeholder:text-muted-foreground hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

const labelVariants = cva(
  "text-sm font-semibold leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState(/* @__PURE__ */ new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editAltText, setEditAltText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    fetchMedia();
  }, [search]);
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }
      params.append("limit", "100");
      const response = await fetch(`/api/media?${params.toString()}`, {
        credentials: "include"
      });
      if (response.ok) {
        const result = await response.json();
        setMediaItems(result.data || []);
      } else {
        console.error("Failed to fetch media");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleSelectItem = (id) => {
    const idStr = String(id);
    const newSelected = new Set(selectedItems);
    if (newSelected.has(idStr)) {
      newSelected.delete(idStr);
    } else {
      newSelected.add(idStr);
    }
    setSelectedItems(newSelected);
  };
  const handleSelectAll = () => {
    if (selectedItems.size === mediaItems.length) {
      setSelectedItems(/* @__PURE__ */ new Set());
    } else {
      setSelectedItems(new Set(mediaItems.map((item) => String(item.id))));
    }
  };
  const handleMediaClick = (item) => {
    setSelectedMedia(item);
    setShowPreview(true);
    setEditAltText(item.alt_text || "");
    setEditDescription(item.description || "");
  };
  const handleSaveMetadata = async () => {
    if (!selectedMedia) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          alt_text: editAltText || null,
          description: editDescription || null,
          file_path: selectedMedia.file_path || null
        }),
        credentials: "include"
      });
      if (response.ok) {
        const result = await response.json();
        setMediaItems(
          (prev) => prev.map(
            (item) => item.id === selectedMedia.id ? { ...item, alt_text: editAltText, description: editDescription } : item
          )
        );
        setSelectedMedia({
          ...selectedMedia,
          alt_text: editAltText,
          description: editDescription
        });
        setShowEditDialog(false);
        alert("Metadata berhasil diperbarui!");
      } else {
        const error = await response.json();
        alert("Error: " + (error.error || "Gagal memperbarui metadata"));
      }
    } catch (error) {
      alert("Error: Gagal memperbarui metadata");
    } finally {
      setSaving(false);
    }
  };
  const copyUrlToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL berhasil disalin!");
  };
  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      if (uploadAltText.trim()) {
        formData.append("alt_text", uploadAltText.trim());
      }
      const response = await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (response.ok) {
        const result = await response.json();
        if (result.path) {
          setMediaItems((prev) => {
            const exists = prev.some((i) => i.file_path === result.path);
            if (exists) {
              return prev.map(
                (i) => i.file_path === result.path ? { ...i, alt_text: uploadAltText.trim() || i.alt_text, url: result.url || i.url } : i
              );
            }
            return prev;
          });
        }
        setUploadFile(null);
        setUploadPreview("");
        setUploadAltText("");
        setShowUploadDialog(false);
        fetchMedia();
        toast.success("Gambar berhasil diupload!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal mengupload gambar");
      }
    } catch (error) {
      toast.error("Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(String(id));
          return newSet;
        });
        if (selectedMedia?.id === id) {
          setShowPreview(false);
          setSelectedMedia(null);
        }
        toast.success("Gambar berhasil dihapus!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menghapus gambar");
      }
    } catch (error) {
      toast.error("Gagal menghapus gambar");
    } finally {
      setDeleting(false);
    }
  };
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.size} gambar?`)) {
      return;
    }
    setDeleting(true);
    try {
      const deletePromises = Array.from(selectedItems).map(
        (id) => fetch(`/api/media/${id}`, {
          method: "DELETE",
          credentials: "include"
        })
      );
      const results = await Promise.allSettled(deletePromises);
      const successCount = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;
      const failCount = selectedItems.size - successCount;
      setMediaItems((prev) => prev.filter((item) => !selectedItems.has(String(item.id))));
      setSelectedItems(/* @__PURE__ */ new Set());
      if (failCount === 0) {
        toast.success(`${successCount} gambar berhasil dihapus!`);
      } else {
        toast.error(`${successCount} gambar berhasil dihapus, ${failCount} gagal.`);
      }
    } catch (error) {
      toast.error("Gagal menghapus gambar");
    } finally {
      setDeleting(false);
    }
  };
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          placeholder: "Cari media...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "default",
            size: "sm",
            onClick: () => setShowUploadDialog(true),
            children: "Upload Gambar"
          }
        ),
        selectedItems.size > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: handleBulkDelete,
            disabled: deleting,
            children: [
              "Hapus (",
              selectedItems.size,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: viewMode === "grid" ? "default" : "outline",
            size: "sm",
            onClick: () => setViewMode("grid"),
            children: "Grid"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: viewMode === "list" ? "default" : "outline",
            size: "sm",
            onClick: () => setViewMode("list"),
            children: "List"
          }
        )
      ] })
    ] }),
    mediaItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: selectedItems.size === mediaItems.length && mediaItems.length > 0,
          onChange: handleSelectAll,
          className: "rounded border-input"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: selectedItems.size > 0 ? `${selectedItems.size} item dipilih` : "Pilih semua" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Memuat media..." }) }) : mediaItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-16 h-16 text-gray-400 mb-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "Belum ada media" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Upload gambar pertama Anda melalui form artikel" })
    ] }) : /* @__PURE__ */ jsx(
      "div",
      {
        className: viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2",
        children: mediaItems.map((item) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${selectedItems.has(String(item.id)) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"} ${viewMode === "list" ? "flex items-center gap-4 p-3" : ""}`,
            onClick: () => handleMediaClick(item),
            children: viewMode === "grid" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-2 left-2 z-10",
                  onClick: (e) => {
                    e.stopPropagation();
                    handleSelectItem(item.id);
                  },
                  children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: selectedItems.has(String(item.id)),
                      onChange: () => {
                      },
                      className: "rounded border-input w-5 h-5 cursor-pointer"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.url,
                  alt: item.name,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform",
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-700 truncate", title: item.name, children: item.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: formatFileSize(item.size) })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedItems.has(String(item.id)),
                  onChange: (e) => {
                    e.stopPropagation();
                    handleSelectItem(item.id);
                  },
                  className: "rounded border-input"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.url,
                  alt: item.name,
                  className: "w-full h-full object-cover",
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: item.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                  formatFileSize(item.size),
                  " • ",
                  formatDate(item.created_at)
                ] })
              ] })
            ] })
          },
          item.id
        ))
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: showPreview, onOpenChange: setShowPreview, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: selectedMedia?.name }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Detail Media" })
      ] }),
      selectedMedia && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-full bg-gray-100 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: selectedMedia.url,
            alt: selectedMedia.name,
            className: "w-full h-auto max-h-96 object-contain mx-auto"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-700", children: "Ukuran File" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: formatFileSize(selectedMedia.size) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-700", children: "Tanggal Upload" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: formatDate(selectedMedia.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2 border-t", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "font-medium text-gray-700 mb-1", children: [
              "Alt Text ",
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(untuk aksesibilitas & SEO)" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: selectedMedia.alt_text || /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "Belum diatur" }) })
          ] }),
          selectedMedia.description && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-700 mb-1", children: "Deskripsi" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: selectedMedia.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-700 mb-2", children: "URL" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                value: selectedMedia.url,
                readOnly: true,
                className: "flex-1 font-mono text-xs"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => copyUrlToClipboard(selectedMedia.url),
                children: "Salin"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setShowEditDialog(true);
                },
                children: "Edit Metadata"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  if (selectedMedia) {
                    handleDelete(selectedMedia.id);
                  }
                },
                disabled: deleting,
                children: "Hapus"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  copyUrlToClipboard(selectedMedia.url);
                },
                children: "Salin URL"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => {
                  copyUrlToClipboard(selectedMedia.url);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("mediaLibrarySelect", {
                        detail: { url: selectedMedia.url }
                      })
                    );
                  }
                  setShowPreview(false);
                },
                children: "Gunakan Gambar"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Metadata" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Tambahkan atau edit alt text dan deskripsi untuk gambar ini" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "edit_alt_text", children: [
            "Alt Text ",
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(untuk aksesibilitas & SEO)" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "edit_alt_text",
              type: "text",
              value: editAltText,
              onChange: (e) => setEditAltText(e.target.value),
              placeholder: "Contoh: Grafik pertumbuhan IHSG bulan November 2024",
              className: "text-sm"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Jelaskan apa yang ada di gambar untuk screen reader dan SEO" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "edit_description", children: "Deskripsi (Opsional)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "edit_description",
              value: editDescription,
              onChange: (e) => setEditDescription(e.target.value),
              placeholder: "Deskripsi tambahan tentang gambar ini",
              rows: 3,
              className: "text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setShowEditDialog(false);
              setEditAltText(selectedMedia?.alt_text || "");
              setEditDescription(selectedMedia?.description || "");
            },
            disabled: saving,
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(Button, { onClick: handleSaveMetadata, disabled: saving, children: saving ? "Menyimpan..." : "Simpan" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showUploadDialog, onOpenChange: setShowUploadDialog, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Upload Gambar" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Upload gambar baru ke media library" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "upload_file", children: "Pilih File Gambar" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "upload_file",
              type: "file",
              accept: "image/*",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadPreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              },
              className: "mt-2 cursor-pointer"
            }
          ),
          uploadPreview && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: uploadPreview,
                alt: "Preview",
                className: "max-w-full h-40 object-contain border border-gray-200 rounded-lg"
              }
            ),
            uploadFile && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [
              "File: ",
              uploadFile.name,
              " (",
              (uploadFile.size / 1024).toFixed(2),
              " KB)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "upload_alt_text", children: [
            "Deskripsi Gambar (Alt Text) ",
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-normal", children: "(Opsional)" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "upload_alt_text",
              type: "text",
              value: uploadAltText,
              onChange: (e) => setUploadAltText(e.target.value),
              placeholder: "Contoh: Grafik pertumbuhan ekonomi Q4 2024",
              className: "mt-2 text-sm"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Jelaskan gambar untuk aksesibilitas dan SEO" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setShowUploadDialog(false);
              setUploadFile(null);
              setUploadPreview("");
              setUploadAltText("");
            },
            disabled: uploading,
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(Button, { onClick: handleUpload, disabled: uploading || !uploadFile, children: uploading ? "Mengupload..." : "Upload" })
      ] })
    ] }) })
  ] }) });
}

export { Label as L, MediaLibrary as M, Textarea as T };
