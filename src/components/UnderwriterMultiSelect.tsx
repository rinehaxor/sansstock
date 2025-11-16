import * as React from 'react';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';

interface Underwriter {
   id: number;
   name: string;
}

interface UnderwriterMultiSelectProps {
   underwriters: Underwriter[] | string; // Can be array or JSON string
   selected: number[];
   onToggle: (id: number) => void;
   className?: string;
}

export default function UnderwriterMultiSelect({ underwriters: underwritersProp, selected, onToggle, className }: UnderwriterMultiSelectProps) {
   const [open, setOpen] = React.useState(false);
   const [query, setQuery] = React.useState('');
   const containerRef = React.useRef<HTMLDivElement>(null);

   // Parse underwriters if it's a JSON string
   const underwriters: Underwriter[] = React.useMemo(() => {
      if (Array.isArray(underwritersProp)) {
         return underwritersProp;
      }
      if (typeof underwritersProp === 'string') {
         try {
            const parsed = JSON.parse(underwritersProp);
            return Array.isArray(parsed) ? parsed : [];
         } catch {
            return [];
         }
      }
      return [];
   }, [underwritersProp]);

   React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
         }
      }

      if (open) {
         document.addEventListener('mousedown', handleClickOutside);
         return () => document.removeEventListener('mousedown', handleClickOutside);
      }
   }, [open]);

   const filtered = React.useMemo(() => {
      if (!query.trim()) return underwriters;
      const lowerQuery = query.toLowerCase();
      return underwriters.filter((uw) => uw.name.toLowerCase().includes(lowerQuery));
   }, [underwriters, query]);

   const selectedNames = React.useMemo(() => {
      return underwriters.filter((uw) => selected.includes(uw.id)).map((uw) => uw.name);
   }, [underwriters, selected]);

   return (
      <div ref={containerRef} className={cn('relative', className)}>
         <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
               'flex w-full min-h-[42px] items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm',
               'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
               selected.length > 0 ? 'border-blue-500' : 'border-gray-300'
            )}
         >
            <div className="flex flex-wrap gap-1 flex-1 items-center">
               {selected.length === 0 ? (
                  <span className="text-gray-500">Pilih underwriter...</span>
               ) : selected.length <= 2 ? (
                  selectedNames.map((name) => (
                     <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                     >
                        {name}
                        <button
                           type="button"
                           onClick={(e) => {
                              e.stopPropagation();
                              const id = underwriters.find((uw) => uw.name === name)?.id;
                              if (id) onToggle(id);
                           }}
                           className="ml-1 hover:text-blue-900"
                        >
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     </span>
                  ))
               ) : (
                  <span className="text-sm text-gray-700">{selected.length} underwriter dipilih</span>
               )}
            </div>
            <svg
               className={cn('h-4 w-4 text-gray-500 transition-transform', open && 'rotate-180')}
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
         </button>

         {open && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
               <div className="p-2 border-b bg-gray-50">
                  <Input placeholder="Cari underwriter..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-9" autoFocus />
               </div>
               <div className="max-h-56 overflow-auto py-1">
                  {filtered.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</div>}
                  {filtered.map((underwriter) => {
                     const checked = selected.includes(underwriter.id);
                     return (
                        <button
                           key={underwriter.id}
                           type="button"
                           onClick={() => onToggle(underwriter.id)}
                           className={cn(
                              'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors',
                              checked ? 'bg-blue-50/60' : ''
                           )}
                        >
                           <input
                              type="checkbox"
                              readOnly
                              checked={checked}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                           />
                           <span className="truncate">{underwriter.name}</span>
                        </button>
                     );
                  })}
               </div>
               <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-600">{selected.length} dipilih</span>
                  <button
                     type="button"
                     onClick={() => setOpen(false)}
                     className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                     Tutup
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

