import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';

interface QuickEditModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   article: {
      id: number;
      title: string;
      status: string;
      category_id?: number;
   };
   categories: Array<{ id: number; name: string }>;
   onSuccess: () => void;
}

export default function QuickEditModal({
   open,
   onOpenChange,
   article,
   categories,
   onSuccess,
}: QuickEditModalProps) {
   const [status, setStatus] = React.useState(article.status);
   const [categoryId, setCategoryId] = React.useState<number | undefined>(article.category_id);
   const [isSubmitting, setIsSubmitting] = React.useState(false);

   React.useEffect(() => {
      if (open) {
         setStatus(article.status);
         setCategoryId(article.category_id);
      }
   }, [open, article]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const updateData: any = {};
         
         if (status !== article.status) {
            updateData.status = status;
            // If changing to published, set published_at
            if (status === 'published' && article.status !== 'published') {
               updateData.published_at = new Date().toISOString();
            }
         }

         if (categoryId !== article.category_id) {
            updateData.category_id = categoryId;
         }

         // Only update if there are changes
         if (Object.keys(updateData).length === 0) {
            onOpenChange(false);
            return;
         }

         const response = await fetch(`/api/articles/${article.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updateData),
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Gagal mengupdate artikel');
         }

         const updatedArticle = await response.json();
         toast.success('Artikel berhasil diupdate');
         onSuccess();
         onOpenChange(false);
      } catch (error) {
         console.error('Error updating article:', error);
         toast.error(error instanceof Error ? error.message : 'Gagal mengupdate artikel');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Quick Edit</DialogTitle>
                  <DialogDescription>
                     Edit cepat untuk artikel: <strong>{article.title}</strong>
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  {/* Status */}
                  <div className="grid gap-2">
                     <label htmlFor="status" className="text-sm font-medium">
                        Status
                     </label>
                     <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                           <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="draft">Draft</SelectItem>
                           <SelectItem value="published">Published</SelectItem>
                           <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {/* Category */}
                  <div className="grid gap-2">
                     <label htmlFor="category" className="text-sm font-medium">
                        Kategori
                     </label>
                     <Select
                        value={categoryId?.toString() || ''}
                        onValueChange={(value) => setCategoryId(value ? parseInt(value) : undefined)}
                     >
                        <SelectTrigger id="category">
                           <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                           {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                 {cat.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                     disabled={isSubmitting}
                  >
                     Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

