import { useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import EntriesSelect from "./EntriesSelect";
import { Table } from "react-bootstrap";

function DataTable({
     title,
     data,
     columns,
     button,
     children,
     totalCount,
     onPageChange,
     onEntriesChange,
     onSearch,
     searchKeys = [],
     countOptions = [10, 25, 50, 100],
     theme
}) {
     const [searchQuery, setSearchQuery] = useState("");
     const [entries, setEntries] = useState(countOptions[0]);
     const [currentPage, setCurrentPage] = useState(1);

     // Server-side yoki Local paginatsiyani aniqlash
     const isServerSide = totalCount !== undefined;

     /* 🔍 SEARCH */
     const filteredData = useMemo(() => {
          if (!searchQuery) return data;

          return data.filter(item =>
               searchKeys.some(key => {
                    const value = item[key];
                    return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
               })
          );
     }, [data, searchQuery, searchKeys]);

     /* 📄 PAGINATION */
     const total = isServerSide ? totalCount : filteredData.length;
     const pagesCount = Math.ceil(total / entries);

     const indexOfLast = currentPage * entries;
     const indexOfFirst = indexOfLast - entries;

     const currentData = isServerSide ? data : filteredData.slice(indexOfFirst, indexOfLast);

     const handleEntriesChange = (e) => {
          setEntries(e);
          setCurrentPage(1);
          if (onEntriesChange) onEntriesChange(e);
     };

     const handlePageChangeInternal = (e, value) => {
          setCurrentPage(value);
          if (onPageChange) onPageChange(e, value);
     };

     const handleSearch = (e) => {
          const value = e.target.value;
          setSearchQuery(value);
          setCurrentPage(1);

          if (onSearch) onSearch(value); // ✅ to‘g‘ri qiymat
     };

     const handleKeyDown = (e) => {
          if (e.key === "Enter") {
               setCurrentPage(1);
               if (onSearch) onSearch(searchQuery);
          }
     };

     return (
          <div className="card-body">
               <div className="d-flex justify-content-between">
                    {title ? <h5 className="fs-6">{title}</h5> : ""}
                    {button}
               </div>

               <div className="d-flex justify-content-between border-bottom">
                    <EntriesSelect
                         options={countOptions}
                         value={entries}
                         onChange={handleEntriesChange}
                    />

                    <input
                         type="search"
                         className="form-control my-3 w-25"
                         placeholder="Search..."
                         value={searchQuery}
                         onChange={handleSearch}
                    // onKeyDown={handleKeyDown}
                    />
               </div>

               <div className="table-responsive">
                    <Table hover className="align-middle">
                         <thead>
                              <tr>
                                   {columns.map(col => (
                                        <th key={col}>{col}</th>
                                   ))}
                              </tr>
                         </thead>

                         <tbody>
                              {children(currentData)}
                         </tbody>
                    </Table>
               </div>

               <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                         Showing {total === 0 ? 0 : indexOfFirst + 1}
                         {" "}to{" "}
                         {Math.min(indexOfLast, total)}
                         {" "}of {total} entries
                    </span>

                    <Pagination
                         count={pagesCount}
                         page={currentPage}
                         onChange={handlePageChangeInternal}
                         size="small"
                         shape="rounded"
                         sx={{
                              '& .MuiPaginationItem-root': {
                                   color: !theme ? '#ffffffd9' : '#000000d9',
                                   backgroundColor: 'transparent',
                                   border: 'none'
                              },
                              '& .MuiPaginationItem-root:hover': {
                                   backgroundColor: 'rgba(255,255,255,0.06)'
                              },
                              '& .Mui-selected': {
                                   backgroundColor: '#0d6dfd !important',
                                   color: '#fff'
                              },
                              '& .MuiPaginationItem-ellipsis': {
                                   color: 'rgba(255,255,255,0.6)'
                              },
                              '& .Mui-disabled': {
                                   opacity: 0.65,
                                   color: theme ? "rgba(255,255,255,0.6)" : ""
                              }
                         }}
                    />
               </div>
          </div>
     );
}

export default DataTable;
