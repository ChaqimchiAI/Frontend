import { useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import EntriesSelect from "./EntriesSelect";

function DataTable({
     title,
     data,
     columns,
     children,
     searchKeys = [],
     countOptions = [10, 25, 50, 100],
}) {
     const [searchQuery, setSearchQuery] = useState("");
     const [entries, setEntries] = useState(countOptions[0]);
     const [currentPage, setCurrentPage] = useState(1);

     /* 🔍 SEARCH */
     const filteredData = useMemo(() => {
          if (!searchQuery) return data;

          return data.filter(item =>
               searchKeys.some(key =>
                    String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
               )
          );
     }, [data, searchQuery, searchKeys]);

     /* 📄 PAGINATION */
     const totalPages = Math.ceil(filteredData.length / entries);
     const indexOfLast = currentPage * entries;
     const indexOfFirst = indexOfLast - entries;
     const currentData = filteredData.slice(indexOfFirst, indexOfLast);

     const handleEntriesChange = (e) => {
          setEntries(e);
          setCurrentPage(1);
     };

     return (
          <div className="card-body">
               {/* TITLE */}
               <h5>{title}</h5>

               {/* ENTRIES */}
               <EntriesSelect
                    options={countOptions}
                    value={entries}
                    onChange={handleEntriesChange}
               />

               {/* SEARCH */}
               <div className="d-flex justify-content-end">
                    <input
                         type="search"
                         className="form-control my-3 w-25"
                         placeholder="Search..."
                         value={searchQuery}
                         onChange={e => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                         }}
                    />
               </div>

               {/* TABLE */}
               <div className="table-responsive">
                    <table className="table table-hover align-middle">
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
                    </table>
               </div>

               {/* FOOTER */}
               <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                         Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1}
                         {" "}to{" "}
                         {Math.min(indexOfLast, filteredData.length)}
                         {" "}of {filteredData.length} entries
                    </span>

                    <Pagination
                         count={totalPages}
                         page={currentPage}
                         onChange={(e, value) => setCurrentPage(value)}
                         size="small"
                         shape="rounded"
                         sx={{
                              '& .MuiPaginationItem-root': {
                                   color: 'rgba(255,255,255,0.85)',
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
                                   color: 'rgba(255,255,255,0.6)'
                              }
                         }}
                    />
               </div>
          </div>
     );
}

export default DataTable;
