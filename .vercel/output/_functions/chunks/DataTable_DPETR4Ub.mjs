import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { c as cn } from './utils_B05Dmz_H.mjs';
import { I as Input } from './Input_CX_pScQ1.mjs';

const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm rounded-lg", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b bg-gray-50", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";

function DataTable({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Filter...",
  onSearch,
  actions,
  actionMenuItems,
  emptyMessage = "No data available.",
  className,
  enableSelection = false,
  onSelectionChange,
  onMassDelete,
  getRowId,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  paginationBaseUrl,
  buildPaginationUrl,
  defaultSort
}) {
  const getInitialSearchValue = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("search") || "";
    }
    return "";
  };
  const [searchValue, setSearchValue] = React.useState(getInitialSearchValue());
  const [selectedRows, setSelectedRows] = React.useState(/* @__PURE__ */ new Set());
  const [sortConfig, setSortConfig] = React.useState(defaultSort ? { key: defaultSort.key, direction: defaultSort.direction } : { key: null, direction: null });
  const [openActionMenu, setOpenActionMenu] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const actionMenuRefs = React.useRef(/* @__PURE__ */ new Map());
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSearchFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get("search") || "";
        setSearchValue(searchParam);
      };
      updateSearchFromURL();
      window.addEventListener("popstate", updateSearchFromURL);
      return () => window.removeEventListener("popstate", updateSearchFromURL);
    }
  }, []);
  React.useEffect(() => {
    if (openActionMenu === null) return;
    function handleClickOutside(event) {
      const target = event.target;
      const menuIndex = openActionMenu;
      if (menuIndex === null) return;
      const menuElement = actionMenuRefs.current.get(menuIndex);
      if (menuElement && !menuElement.contains(target)) {
        setOpenActionMenu(null);
      }
    }
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openActionMenu]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (buildPaginationUrl) {
      window.location.href = buildPaginationUrl(1, searchValue);
    } else if (paginationBaseUrl) {
      const params = new URLSearchParams();
      if (searchValue) {
        params.set("search", searchValue);
      }
      params.set("page", "1");
      window.location.href = `${paginationBaseUrl}?${params.toString()}`;
    }
  };
  const handleSearchClear = () => {
    setSearchValue("");
    if (buildPaginationUrl) {
      window.location.href = buildPaginationUrl(1);
    } else if (paginationBaseUrl) {
      window.location.href = `${paginationBaseUrl}?page=1`;
    }
    onSearch?.("");
  };
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIndices = new Set(data.map((_, index) => index));
      setSelectedRows(allIndices);
      onSelectionChange?.(data);
    } else {
      setSelectedRows(/* @__PURE__ */ new Set());
      onSelectionChange?.([]);
    }
  };
  const handleSelectRow = (index, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    const selectedData = Array.from(newSelected).map((i) => data[i]);
    onSelectionChange?.(selectedData);
  };
  const handleMassDelete = async () => {
    if (selectedRows.size === 0) return;
    const selectedData = Array.from(selectedRows).map((i) => data[i]);
    const count = selectedData.length;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${count} item yang dipilih?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      if (onMassDelete) {
        await onMassDelete(selectedData);
      }
      setSelectedRows(/* @__PURE__ */ new Set());
      onSelectionChange?.([]);
    } catch (error) {
      console.error("Error deleting items:", error);
      alert("Terjadi error saat menghapus item. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleSort = (columnId) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !column.sortable) return;
    setSortConfig((prev) => {
      if (prev.key === columnId) {
        if (prev.direction === "asc") {
          return { key: columnId, direction: "desc" };
        } else if (prev.direction === "desc") {
          return { key: null, direction: null };
        }
      }
      return { key: columnId, direction: "asc" };
    });
  };
  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }
    const column = columns.find((col) => col.id === sortConfig.key);
    if (!column || !column.sortable) {
      return data;
    }
    const sorted = [...data].sort((a, b) => {
      let aValue;
      let bValue;
      if (column.accessorKey) {
        aValue = a[column.accessorKey];
        bValue = b[column.accessorKey];
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (aValue instanceof Date || typeof aValue === "string" && aValue.match(/^\d{4}-\d{2}-\d{2}/)) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (sortConfig.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    return sorted;
  }, [data, sortConfig, columns]);
  const getPageUrl = (pageNum) => {
    if (buildPaginationUrl) {
      return buildPaginationUrl(pageNum, searchValue);
    }
    if (paginationBaseUrl) {
      const params = new URLSearchParams();
      if (searchValue) {
        params.set("search", searchValue);
      }
      params.set("page", pageNum.toString());
      return `${paginationBaseUrl}?${params.toString()}`;
    }
    return `?page=${pageNum}${searchValue ? `&search=${encodeURIComponent(searchValue)}` : ""}`;
  };
  const generatePaginationItems = () => {
    if (!totalPages || !currentPage) return null;
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    if (startPage > 1) {
      items.push(
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getPageUrl(1),
            className: cn(
              "inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
              currentPage === 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            ),
            children: "1"
          },
          "1"
        )
      );
      if (startPage > 2) {
        items.push(
          /* @__PURE__ */ jsx("span", { className: "px-3 py-2 text-gray-500", children: "..." }, "ellipsis-start")
        );
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getPageUrl(i),
            className: cn(
              "inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
              currentPage === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            ),
            children: i
          },
          i
        )
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          /* @__PURE__ */ jsx("span", { className: "px-3 py-2 text-gray-500", children: "..." }, "ellipsis-end")
        );
      }
      items.push(
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getPageUrl(totalPages),
            className: cn(
              "inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
              currentPage === totalPages ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            ),
            children: totalPages
          },
          totalPages
        )
      );
    }
    return items;
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-4", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      (searchKey || onSearch) && /* @__PURE__ */ jsx("form", { onSubmit: handleSearchSubmit, className: "flex-1 max-w-sm", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Input, { type: "text", placeholder: searchPlaceholder, value: searchValue, onChange: handleSearchChange, className: "w-full pr-10" }),
        searchValue && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleSearchClear,
            className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors",
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors",
            "aria-label": "Search",
            style: { right: searchValue ? "2.5rem" : "0.5rem" },
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: enableSelection && selectedRows.size > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
          selectedRows.size,
          " item dipilih"
        ] }),
        onMassDelete && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleMassDelete,
            disabled: isDeleting,
            className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            children: isDeleting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Menghapus..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
              "Hapus ",
              selectedRows.size,
              " item"
            ] })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "rounded-t-xl", children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-gray-50/50 border-b border-gray-200", children: [
        enableSelection && /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: isAllSelected,
            ref: (input) => {
              if (input) input.indeterminate = isIndeterminate;
            },
            onChange: (e) => handleSelectAll(e.target.checked),
            className: "h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          }
        ) }),
        columns.map((column) => /* @__PURE__ */ jsx(TableHead, { className: cn(column.className, column.sortable && "cursor-pointer select-none hover:bg-gray-100"), onClick: () => column.sortable && handleSort(column.id), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { children: column.header }),
          column.sortable && sortConfig.key === column.id && /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "" })
        ] }) }, column.id)),
        (actions || actionMenuItems) && /* @__PURE__ */ jsx(TableHead, { className: "w-[100px] text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: sortedData.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: columns.length + (enableSelection ? 1 : 0) + (actions || actionMenuItems ? 1 : 0), className: "h-24 text-center", children: emptyMessage }) }) : sortedData.map((row, index) => /* @__PURE__ */ jsxs(TableRow, { className: cn("hover:bg-gray-50/50 transition-colors", selectedRows.has(index) && "bg-blue-50"), children: [
        enableSelection && /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: selectedRows.has(index),
            onChange: (e) => handleSelectRow(index, e.target.checked),
            className: "h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          }
        ) }),
        columns.map((column) => {
          let content;
          if (column.cell) {
            content = column.cell(row);
          } else if (column.accessorKey) {
            content = row[column.accessorKey];
          } else {
            content = null;
          }
          return /* @__PURE__ */ jsx(TableCell, { className: column.className, children: content }, column.id);
        }),
        (actions || actionMenuItems) && /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: actions ? actions(row) : actionMenuItems ? /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative inline-block",
            ref: (el) => {
              if (el) {
                actionMenuRefs.current.set(index, el);
              } else {
                actionMenuRefs.current.delete(index);
              }
            },
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setOpenActionMenu(openActionMenu === index ? null : index);
                  },
                  className: "p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors",
                  "aria-label": "Actions",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" }) })
                }
              ),
              openActionMenu === index && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1", onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100", children: "Actions" }),
                actionMenuItems(row).map((item, itemIndex) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenActionMenu(null);
                      item.onClick();
                    },
                    className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors rounded-md mx-1",
                    children: [
                      item.icon,
                      /* @__PURE__ */ jsx("span", { children: item.label })
                    ]
                  },
                  itemIndex
                ))
              ] })
            ]
          }
        ) : null })
      ] }, index)) })
    ] }) }),
    totalPages && totalPages > 1 && currentPage && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center justify-center gap-2", "aria-label": "Pagination", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: currentPage > 1 ? buildPaginationUrl ? buildPaginationUrl(currentPage - 1, searchValue) : getPageUrl(currentPage - 1) : "#",
            className: cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors",
              currentPage <= 1 ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            ),
            "aria-disabled": currentPage <= 1,
            children: "Previous"
          }
        ),
        generatePaginationItems(),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: currentPage < totalPages ? buildPaginationUrl ? buildPaginationUrl(currentPage + 1, searchValue) : getPageUrl(currentPage + 1) : "#",
            className: cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors",
              currentPage >= totalPages ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            ),
            "aria-disabled": currentPage >= totalPages,
            children: "Next"
          }
        )
      ] }),
      totalItems && itemsPerPage && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-gray-600 text-center", children: [
        "Menampilkan ",
        (currentPage - 1) * itemsPerPage + 1,
        " sampai ",
        Math.min(currentPage * itemsPerPage, totalItems),
        " dari ",
        totalItems,
        " item"
      ] })
    ] })
  ] });
}

export { DataTable as D };
