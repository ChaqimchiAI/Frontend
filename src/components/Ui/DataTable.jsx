import { useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import EntriesSelect from "./EntriesSelect";
import { Table } from "react-bootstrap";
import { Input } from "./Input";
import { useTheme } from "../../Context/Context";

function DataTable({
     title,
     data,
     columns,
     button,
     children,
     totalCount,
     onPageChange,
     onEntriesChange,
     filter,
     onSearch,
     searchKeys = [],
     countOptions = [10, 25, 50, 100],
}) {
     const { theme } = useTheme();
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
          if (value.length === 0) {
               onSearch("");
          }
          setSearchQuery(value);
     };

     const handleKeyDown = (e) => {
          if (e.key === "Enter") {
               setCurrentPage(1);

               if (onSearch && searchQuery.length > 0) onSearch(searchQuery);
          }
     };

     return (
          <div className="card-body">
               {title ?
                    <div className="d-flex justify-content-between">
                         <h5 className="fs-6">{title}</h5>
                         {button}
                    </div> : ""}

               <div className="d-flex justify-content-end border-bottom">
                    <div className="d-flex align-items-center gap-2">
                         <Input
                              type="search"
                              placeholder="Qidirish..."
                              className="my-3"
                              style={{ width: "250px" }}
                              value={searchQuery}
                              onChange={handleSearch}
                              onKeyDown={handleKeyDown}
                         />
                         {filter}
                    </div>
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
                         {total === 0 ? 0 : indexOfFirst + 1}
                         {" "}dan{" "}
                         {Math.min(indexOfLast, total)}
                         {" "}ga qadar, jami {total} ta
                    </span>

                    <div className="d-flex align-items-center gap-2">
                         <EntriesSelect
                              options={countOptions}
                              value={entries}
                              onChange={handleEntriesChange}
                         />

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
                                        color: !theme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                                   }
                              }}
                         />
                    </div>
               </div>
          </div>
     );
}

export default DataTable;
