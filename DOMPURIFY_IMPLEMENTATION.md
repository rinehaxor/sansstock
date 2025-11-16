# DOMPurify Implementation for Content Sanitization

DOMPurify telah diimplementasikan untuk sanitization konten artikel yang lebih robust.

## Installation

Package sudah terinstall:
```bash
npm install isomorphic-dompurify
```

**Package Version**: `isomorphic-dompurify@^2.32.0`

## Implementation

### 1. DOMPurify Configuration (`src/lib/sanitize.ts`)

Konfigurasi DOMPurify untuk artikel content:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const DOMPURIFY_CONFIG = {
   ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'div', 'span', 'hr', 'del', 'ins', 'sub', 'sup',
   ],
   ALLOWED_ATTR: [
      'class', 'id', 'title',
      'href', 'target', 'rel', 'name',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan',
      'lang',
   ],
   ALLOW_DATA_ATTR: false,
   FORBID_TAGS: ['script', 'style', 'iframe', 'embed', 'object', 'form', 'input', 'button'],
   FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
   // ... other security settings
};
```

### 2. Sanitization Functions

#### `sanitizeHtml()`

Sanitize HTML content menggunakan DOMPurify:

```typescript
export function sanitizeHtml(html: string): string {
   if (!html || typeof html !== 'string') {
      return '';
   }

   try {
      return DOMPurify.sanitize(html, DOMPURIFY_CONFIG);
   } catch (error) {
      // Fallback to basic sanitization if DOMPurify fails
      console.error('[Sanitization Error]', error);
      return escapeHtml(html);
   }
}
```

#### `sanitizeArticleContent()`

Sanitize artikel content sebelum save ke database:

```typescript
export function sanitizeArticleContent(content: string): string {
   if (!content || typeof content !== 'string') {
      return '';
   }

   // Use DOMPurify for robust sanitization
   return sanitizeHtml(content);
}
```

### 3. Applied to Article Endpoints

Sanitization diterapkan di:
- ✅ `/api/articles` - POST (create article)
- ✅ `/api/articles/[id]` - PUT (update article)

**Example Usage**:
```typescript
// Before saving to database
const sanitizedContent = sanitizeArticleContent(content);
await authenticatedClient.from('articles').insert({
   ...otherFields,
   content: sanitizedContent, // Sanitized with DOMPurify
});
```

## Security Features

### ✅ XSS Prevention

DOMPurify automatically removes:
- ✅ `<script>` tags
- ✅ Event handlers (`onclick`, `onerror`, `onload`, etc.)
- ✅ `javascript:` URLs
- ✅ Dangerous `data:` URLs (except safe image data URLs)
- ✅ `<iframe>`, `<embed>`, `<object>` tags
- ✅ Form elements (`<form>`, `<input>`, `<button>`)
- ✅ `<style>` tags (can contain XSS)

### ✅ Safe HTML Preserved

DOMPurify preserves:
- ✅ Text formatting (`<p>`, `<strong>`, `<em>`, etc.)
- ✅ Lists (`<ul>`, `<ol>`, `<li>`)
- ✅ Links (`<a>`) dengan safe URLs
- ✅ Images (`<img>`) dengan safe sources
- ✅ Tables (`<table>`, `<tr>`, `<td>`, etc.)
- ✅ Headings (`<h1>` - `<h6>`)
- ✅ Code blocks (`<code>`, `<pre>`)
- ✅ Blockquotes (`<blockquote>`)

### ✅ URL Validation

DOMPurify validates URLs untuk:
- ✅ Links: Only `https://`, `http://`, `mailto:`, `tel:`, relative URLs
- ✅ Images: Only `https://`, `http://`, safe `data:image/*` URLs
- ✅ Blocks `javascript:`, `vbscript:`, dangerous `data:` URLs

## Configuration Details

### Allowed Tags

Tags yang diizinkan untuk rich text content:
- Text: `p`, `br`, `strong`, `em`, `u`, `s`, `b`, `i`
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Lists: `ul`, `ol`, `li`
- Code: `code`, `pre`, `blockquote`
- Links: `a`
- Images: `img`
- Tables: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`
- Other: `div`, `span`, `hr`, `del`, `ins`, `sub`, `sup`

### Allowed Attributes

Attributes yang diizinkan:
- Common: `class`, `id`, `title`
- Links: `href`, `target`, `rel`, `name`
- Images: `src`, `alt`, `width`, `height`
- Tables: `colspan`, `rowspan`
- Code: `lang`

### Forbidden Tags

Tags yang dilarang (auto-removed):
- `script`, `style`
- `iframe`, `embed`, `object`
- `form`, `input`, `button`

### Forbidden Attributes

Attributes yang dilarang (auto-removed):
- Event handlers: `onerror`, `onload`, `onclick`, `onmouseover`, `onfocus`, `onblur`
- Dan semua event handler lainnya

## Error Handling

Jika DOMPurify gagal (rare), fallback ke basic sanitization:

```typescript
try {
   return DOMPurify.sanitize(html, DOMPURIFY_CONFIG);
} catch (error) {
   console.error('[Sanitization Error]', error);
   return escapeHtml(html); // Fallback to basic HTML entity encoding
}
```

## Testing

Test sanitization dengan:

### 1. XSS Prevention Test

```javascript
// Input dengan XSS
const malicious = '<script>alert("XSS")</script><p>Safe content</p>';

// Output (sanitized)
const sanitized = sanitizeArticleContent(malicious);
// Result: '<p>Safe content</p>'
// Script tag di-remove
```

### 2. Event Handler Test

```javascript
// Input dengan event handler
const withEvent = '<p onclick="alert(\'XSS\')">Click me</p>';

// Output (sanitized)
const sanitized = sanitizeArticleContent(withEvent);
// Result: '<p>Click me</p>'
// onclick attribute di-remove
```

### 3. JavaScript URL Test

```javascript
// Input dengan javascript: URL
const jsUrl = '<a href="javascript:alert(\'XSS\')">Link</a>';

// Output (sanitized)
const sanitized = sanitizeArticleContent(jsUrl);
// Result: '<a>Link</a>'
// href dengan javascript: di-remove
```

### 4. Safe HTML Preserved Test

```javascript
// Input dengan safe HTML
const safe = '<p><strong>Bold</strong> and <em>italic</em></p>';

// Output (sanitized)
const sanitized = sanitizeArticleContent(safe);
// Result: '<p><strong>Bold</strong> and <em>italic</em></p>'
// Safe HTML di-preserve
```

## Benefits

✅ **Robust XSS Prevention**: DOMPurify is industry-standard untuk HTML sanitization  
✅ **Well Maintained**: Actively maintained dan widely used  
✅ **Performance**: Fast sanitization dengan proper HTML parsing  
✅ **Configurable**: Bisa customize allowed tags/attributes  
✅ **Server-side**: Works di Node.js environment (isomorphic-dompurify)  
✅ **Fallback Support**: Fallback ke basic sanitization jika error  

## Comparison: Before vs After

### Before (Basic Sanitization)
```typescript
// Basic regex-based sanitization
function sanitizeHtml(html: string): string {
   return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
}
// ❌ Bisa miss beberapa edge cases
// ❌ Tidak parse HTML dengan benar
```

### After (DOMPurify)
```typescript
// DOMPurify dengan proper HTML parsing
function sanitizeHtml(html: string): string {
   return DOMPurify.sanitize(html, DOMPURIFY_CONFIG);
}
// ✅ Robust XSS prevention
// ✅ Proper HTML parsing
// ✅ Well-tested library
```

## Kesimpulan

DOMPurify telah diimplementasikan untuk:
- ✅ Robust XSS prevention
- ✅ Safe HTML preservation
- ✅ URL validation
- ✅ Error handling dengan fallback

Content sanitization sekarang menggunakan industry-standard library yang lebih aman dan robust.

