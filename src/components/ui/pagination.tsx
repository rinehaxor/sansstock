import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '../../lib/utils';
import { buttonVariants } from './Button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(({ className, ...props }, ref) => <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
   isActive?: boolean;
   size?: 'default' | 'sm' | 'lg' | 'icon';
} & React.ComponentProps<'a'>;

const PaginationLink = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, PaginationLinkProps>(({ className, isActive, size = 'icon', href, ...props }, ref) => {
   const baseClassName = cn(
      buttonVariants({
         variant: isActive ? 'outline' : 'ghost',
         size,
      }),
      className
   );

   // If href is undefined, render as button for accessibility
   if (href === undefined) {
      return (
         <button ref={ref as React.ForwardedRef<HTMLButtonElement>} aria-current={isActive ? 'page' : undefined} aria-disabled={true} disabled={true} tabIndex={-1} className={baseClassName} {...(props as React.ComponentProps<'button'>)} />
      );
   }

   // Otherwise render as anchor link
   return <a ref={ref as React.ForwardedRef<HTMLAnchorElement>} href={href} aria-current={isActive ? 'page' : undefined} className={baseClassName} {...props} />;
});
PaginationLink.displayName = 'PaginationLink';

type PaginationPreviousProps = {
   className?: string;
   href?: string;
} & Omit<React.ComponentProps<'a'>, 'href'>;

const PaginationPrevious = ({ className, href, ...props }: PaginationPreviousProps) => (
   <PaginationLink aria-label="Go to previous page" size="default" className={cn('gap-1 pl-2.5', className)} href={href} {...props}>
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
   </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

type PaginationNextProps = {
   className?: string;
   href?: string;
} & Omit<React.ComponentProps<'a'>, 'href'>;

const PaginationNext = ({ className, href, ...props }: PaginationNextProps) => (
   <PaginationLink aria-label="Go to next page" size="default" className={cn('gap-1 pr-2.5', className)} href={href} {...props}>
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
   </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
   <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
   </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
