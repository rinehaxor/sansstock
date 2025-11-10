import * as React from 'react';
import toast from 'react-hot-toast';

export default function IPOImportForm() {
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

         // Send to API
         const response = await fetch('/api/ipo-listings/import', {
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
               <label htmlFor="json-data" className="block text-sm font-medium text-gray-700 mb-2">
                  Data JSON
               </label>
               <textarea
                  id="json-data"
                  rows={15}
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Paste JSON data di sini atau upload file..."
                  required
               />
            </div>

            <div>
               <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Atau Upload File JSON
               </label>
               <input
                  id="file-upload"
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
               />
            </div>

            <div className="flex gap-2">
               <button
                  type="submit"
                  disabled={isLoading || !jsonData.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {isLoading ? 'Mengimport...' : 'Import Data'}
               </button>
               <button
                  type="button"
                  onClick={() => setJsonData('')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
               >
                  Clear
               </button>
            </div>
         </form>

         {importResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
               <h3 className="text-lg font-semibold mb-2">Hasil Import</h3>
               <div className="space-y-2 text-sm">
                  <p>
                     <span className="font-medium text-green-600">Berhasil:</span> {importResult.success}
                  </p>
                  <p>
                     <span className="font-medium text-red-600">Gagal:</span> {importResult.failed}
                  </p>
                  {importResult.errors && importResult.errors.length > 0 && (
                     <div className="mt-4">
                        <p className="font-medium text-red-600 mb-2">Errors:</p>
                        <ul className="list-disc list-inside space-y-1 text-red-600">
                           {importResult.errors.map((error: string, idx: number) => (
                              <li key={idx} className="text-xs">{error}</li>
                           ))}
                        </ul>
                     </div>
                  )}
                  {importResult.imported && importResult.imported.length > 0 && (
                     <div className="mt-4">
                        <p className="font-medium text-green-600 mb-2">Data yang diimport:</p>
                        <ul className="list-disc list-inside space-y-1 text-green-600">
                           {importResult.imported.slice(0, 10).map((item: any, idx: number) => (
                              <li key={idx} className="text-xs">{item.ticker_symbol}</li>
                           ))}
                           {importResult.imported.length > 10 && (
                              <li className="text-xs">... dan {importResult.imported.length - 10} lainnya</li>
                           )}
                        </ul>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

