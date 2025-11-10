import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { c as cn } from './utils_B05Dmz_H.mjs';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      className: cn(
        "flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";

export { Input as I };
