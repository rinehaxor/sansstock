import * as React from 'react';
import UnderwriterMultiSelect from './UnderwriterMultiSelect';

interface Underwriter {
   id: number;
   name: string;
}

interface UnderwriterSelectWrapperProps {
   underwriters: string; // JSON string from Astro
   selectedIds?: number[];
   inputId?: string;
}

export default function UnderwriterSelectWrapper({ underwriters: underwritersJson, selectedIds = [], inputId = 'underwriterIds' }: UnderwriterSelectWrapperProps) {
   const [selected, setSelected] = React.useState<number[]>(selectedIds);
   const hiddenInputRef = React.useRef<HTMLInputElement>(null);

   const underwriters: Underwriter[] = React.useMemo(() => {
      try {
         return JSON.parse(underwritersJson || '[]');
      } catch {
         return [];
      }
   }, [underwritersJson]);

   // Sync selectedIds from parent
   React.useEffect(() => {
      setSelected(selectedIds);
   }, [selectedIds]);

   React.useEffect(() => {
      // Update hidden input whenever selected changes
      if (hiddenInputRef.current) {
         hiddenInputRef.current.value = JSON.stringify(selected);
      }
   }, [selected]);

   const handleToggle = (id: number) => {
      setSelected((prev) => {
         if (prev.includes(id)) {
            return prev.filter((item) => item !== id);
         } else {
            return [...prev, id];
         }
      });
      
      // Also trigger change event for form
      if (hiddenInputRef.current) {
         const event = new Event('change', { bubbles: true });
         hiddenInputRef.current.dispatchEvent(event);
      }
   };

   return (
      <>
         <input type="hidden" id={inputId} name={inputId} ref={hiddenInputRef} value={JSON.stringify(selected)} />
         <UnderwriterMultiSelect underwriters={underwriters} selected={selected} onToggle={handleToggle} />
      </>
   );
}

