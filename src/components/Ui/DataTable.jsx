import { useState, useMemo, useEffect } from "react"; // useEffect qo'shildi
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
     storageKey = "dataTableLimit", // Har xil jadvallar uchun turli key ishlatish imkoni
     currentPage: currentPageProp,
     entries: entriesProp,
}) {
     const { theme } = useTheme();
     const [searchQuery, setSearchQuery] = useState("");
     
     const isEntriesControlled = typeof entriesProp === "number";
     const initialEntries = Number(localStorage.getItem(storageKey)) || countOptions[0];
     const [entries, setEntries] = useState(initialEntries);
     const entriesValue = isEntriesControlled ? entriesProp : entries;

     const isPageControlled = typeof currentPageProp === "number";
     const [currentPage, setCurrentPage] = useState(currentPageProp ?? 1);

     useEffect(() => {
          if (isEntriesControlled && entriesProp !== entries) {
               setEntries(entriesProp);
          }
     }, [entriesProp, entries, isEntriesControlled]);

     useEffect(() => {
          if (isPageControlled && currentPageProp !== currentPage) {
               setCurrentPage(currentPageProp);
          }
     }, [currentPageProp, currentPage, isPageControlled]);

     const isServerSide = totalCount !== undefined;

     /* 🔍 SEARCH */
     const filteredData = useMemo(() => {
          if (!Array.isArray(data)) return [];
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
     const pagesCount = Math.ceil(total / entriesValue);

     const indexOfLast = currentPage * entriesValue;
     const indexOfFirst = indexOfLast - entriesValue;

     const currentData = isServerSide ? data : filteredData?.slice(indexOfFirst, indexOfLast);

     // 2. Entries o'zgarganda ham statega, ham LocalStoragega yozamiz
     const handleEntriesChange = (e) => {
          const newLimit = Number(e);
          if (!isEntriesControlled) {
               setEntries(newLimit);
               localStorage.setItem(storageKey, newLimit); // Saqlash
          }
          setCurrentPage(1);
          if (onEntriesChange) onEntriesChange(newLimit);
     };

     const handlePageChangeInternal = (e, value) => {
          if (!isPageControlled) {
               setCurrentPage(value);
          }
          if (onPageChange) onPageChange(e, value);
     };

     const handleSearch = (e) => {
          const value = e.target.value;
          if (value.length === 0 && onSearch) {
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
               {/* ... (Header qismi o'zgarishsiz qoladi) */}
               {title ?
                    <div className="d-flex justify-content-between">
                         <h5 className="fs-6">{title}</h5>
                         {button}
                    </div> : ""}

               <div className="d-flex justify-content-end align-items-center border-bottom">
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
                                   {columns.map((col, idx) => (
                                        <th key={idx}>{col}</th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody>
                              {children(currentData)}
                         </tbody>
                    </Table>
               </div>

               {total > 0 && (
                    <div className="d-flex justify-content-between align-items-center">
                         <span className="text-muted small">
                              {indexOfFirst + 1} dan {Math.min(indexOfLast, total)} gacha, jami {total} ta
                         </span>

                         <div className="d-flex align-items-center gap-2">
                              <EntriesSelect
                                   options={countOptions}
                                   value={entriesValue}
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
                                        },
                                        '& .Mui-selected': {
                                             backgroundColor: '#0d6dfd !important',
                                             color: '#fff'
                                        }
                                   }}
                              />
                         </div>
                    </div>
               )}
          </div>
     );
}

export default DataTable;
