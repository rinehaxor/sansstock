import * as React from 'react';
import toast from 'react-hot-toast';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Button } from './ui/Button';

export default function UnderwriterImportForm() {
   const [jsonData, setJsonData] = React.useState('');
   const [isLoading, setIsLoading] = React.useState(false);
   const [importResult, setImportResult] = React.useState<any>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setImportResult(null);

      try {
         // Parse JSON to validate
         const data = JSON.parse(jsonData);

         if (!Array.isArray(data)) {
            toast.error('Data harus berupa array');
            setIsLoading(false);
            return;
         }

         if (data.length === 0) {
            toast.error('Array tidak boleh kosong');
            setIsLoading(false);
            return;
         }

         // Send to API
         const response = await fetch('/api/underwriters/import', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ data }),
         });

         const result = await response.json();

         if (response.ok) {
            toast.success(result.message || 'Import berhasil');
            setImportResult(result.results);
            setJsonData(''); // Clear form
         } else {
            toast.error(result.error || 'Import gagal');
            setImportResult(result);
         }
      } catch (error) {
         toast.error('Error parsing JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
         setIsLoading(false);
      } finally {
         setIsLoading(false);
      }
   };

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         try {
            const text = event.target?.result as string;
            setJsonData(text);
            toast.success('File berhasil dibaca');
         } catch (error) {
            toast.error('Error membaca file');
         }
      };
      reader.readAsText(file);
   };

   return (
      <div className="space-y-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label htmlFor="json-data" className="block text-sm font-medium text-gray-700 mb-2">
                  Data JSON
               </Label>
               <textarea
                  id="json-data"
                  rows={15}
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder='Paste JSON data di sini atau upload file...&#10;&#10;Format:&#10;["PT BCA Sekuritas", "PT Mandiri Sekuritas", ...]&#10;atau&#10;[{"name": "PT BCA Sekuritas"}, {"name": "PT Mandiri Sekuritas"}, ...]'
                  required
               />
            </div>

            <div>
               <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Atau Upload File JSON
               </Label>
               <input
                  id="file-upload"
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
               />
            </div>

            <div className="flex gap-2">
               <Button type="submit" disabled={isLoading} className="px-6 py-2">
                  {isLoading ? 'Mengimport...' : 'Import Data'}
               </Button>
            </div>
         </form>

         {/* Import Results */}
         {importResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Hasil Import</h3>

               {importResult.success > 0 && (
                  <div className="mb-4">
                     <p className="text-sm font-medium text-green-700 mb-2">
                        ✅ Berhasil: {importResult.success} underwriter
                     </p>
                     {importResult.imported && importResult.imported.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 max-h-40 overflow-y-auto">
                           <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                              {importResult.imported.slice(0, 20).map((item: any, idx: number) => (
                                 <li key={idx}>{item.name || item}</li>
                              ))}
                              {importResult.imported.length > 20 && (
                                 <li className="text-gray-600">... dan {importResult.imported.length - 20} lainnya</li>
                              )}
                           </ul>
                        </div>
                     )}
                  </div>
               )}

               {importResult.skipped && importResult.skipped.length > 0 && (
                  <div className="mb-4">
                     <p className="text-sm font-medium text-yellow-700 mb-2">
                        ⏭️ Dilewati (sudah ada): {importResult.skipped.length} underwriter
                     </p>
                     <div className="bg-yellow-50 border border-yellow-200 rounded p-3 max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                           {importResult.skipped.slice(0, 20).map((name: string, idx: number) => (
                              <li key={idx}>{name}</li>
                           ))}
                           {importResult.skipped.length > 20 && (
                              <li className="text-gray-600">... dan {importResult.skipped.length - 20} lainnya</li>
                           )}
                        </ul>
                     </div>
                  </div>
               )}

               {importResult.failed > 0 && (
                  <div className="mb-4">
                     <p className="text-sm font-medium text-red-700 mb-2">❌ Gagal: {importResult.failed} underwriter</p>
                     {importResult.errors && importResult.errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 max-h-40 overflow-y-auto">
                           <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                              {importResult.errors.slice(0, 10).map((error: string, idx: number) => (
                                 <li key={idx}>{error}</li>
                              ))}
                              {importResult.errors.length > 10 && (
                                 <li className="text-gray-600">... dan {importResult.errors.length - 10} error lainnya</li>
                              )}
                           </ul>
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

