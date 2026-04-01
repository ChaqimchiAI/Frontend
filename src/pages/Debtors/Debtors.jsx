import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import { useDebtorsStudents } from "../../data/queries/billing.queries";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";

const Debtors = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // 1. FILTRLAR: Limit endi state ichida va API ga yuboriladi
  const [filters, setFilters] = useState({
    page: 1,
    limit: Number(localStorage.getItem("debtorsLimit")) || 10,
    ordering: "balance",
  });

  // 2. API SO'ROVI: Hamma filtrlar (limit ham!) birga ketadi
  const { data: response, isLoading } = useDebtorsStudents(filters);

  const debtorsData = response?.results || [];
  const totalCount = response?.total_debtors || 0;
  const totalDebtSum = response?.total_debt_sum || 0;

  // 3. LIMIT O'ZGARISHI: LocalStorage ga saqlaymiz va sahifani 1-ga qaytaramiz
  const handleLimitChange = (newLimit) => {
    localStorage.setItem("debtorsLimit", newLimit);
    setFilters(prev => ({ 
      ...prev, 
      limit: Number(newLimit), 
      page: 1 
    }));
  };

  const orderingStatuses = [
    { key: "balance", label: "Qarz: Yuqoridan pastga" },
    { key: "-balance", label: "Qarz: Pastdan yuqoriga" },
  ];

  const formatMoney = (val) => Math.abs(Number(val) || 0).toLocaleString("uz-UZ");

  return (
    <div className="card card-body border-0 shadow-sm" style={{ minHeight: "85vh" }}>
      
      {/* Header & KPI Cards */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Qarzdorlik Nazorati</h2>
          <p className="text-muted small mt-1">Jami {totalCount} ta qarzdor aniqlangan</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="p-3 rounded-3 border-0 shadow-sm" 
               style={{ background: !theme ? "#1a1616" : "#fff5f5", borderLeft: "5px solid #dc3545" }}>
            <span className="text-muted small fw-bold">UMUMIY QARZ</span>
            <h2 className="fw-bold text-danger mb-0 mt-1">{formatMoney(totalDebtSum)} <small className="fs-6">UZS</small></h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 rounded-3 border-0 shadow-sm" 
               style={{ background: !theme ? "#111827" : "#f0f9ff", borderLeft: "5px solid #0d6efd" }}>
            <span className="text-muted small fw-bold">QARZDORLAR SONI</span>
            <h2 className="fw-bold text-primary mb-0 mt-1">{totalCount} <small className="fs-6">nafar</small></h2>
          </div>
        </div>
      </div>

      {/* DataTable: Limit endi ishlaydi! */}
      {isLoading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
      ) : (
        <DataTable
          data={debtorsData}
          totalCount={totalCount}
          columns={["№", "O'quvchi", "Telefon / Filial", "Qarzdorlik", ""]}
          
          // PAGINATION & LIMIT SOZLAMALARI
          page={filters.page}
          limit={filters.limit} // DataTable ichidagi tanlangan limit
          onPageChange={(e, v) => setFilters(p => ({ ...p, page: v }))}
          onEntriesChange={handleLimitChange} // Mana shu funksiya limitni o'zgartiradi
          
          searchKeys={["first_name", "last_name", "phone"]}
          filter={
            <StatusDropdown
              statuses={orderingStatuses}
              currentItem={orderingStatuses.find(s => s.key === filters.ordering) || orderingStatuses[0]}
              setCurrentItem={(item) => setFilters(p => ({ ...p, ordering: item.key, page: 1 }))}
              style={{ width: "200px" }}
            />
          }
        >
          {(currentData) =>
            currentData.map((debtor, index) => {
              const isCritical = Math.abs(Number(debtor.balance)) >= 1000000;
              return (
                <tr 
                  key={debtor.id} 
                  className="align-middle border-bottom" 
                  onClick={() => navigate(`/students/${debtor.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-muted">{(filters.page - 1) * filters.limit + index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2 py-1">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                           style={{ 
                             width: "35px", height: "35px", 
                             background: isCritical ? "#dc354515" : "#0d6efd15", 
                             color: isCritical ? "#dc3545" : "#0d6efd",
                             fontSize: "12px", border: "1px solid"
                           }}>
                        {debtor.first_name?.[0]}
                      </div>
                      <div className="fw-bold" style={{ fontSize: "13.5px" }}>
                        {debtor.first_name} {debtor.last_name}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium" style={{ fontSize: "12px" }}>{debtor.phone || "—"}</div>
                    <div className="small text-muted" style={{ fontSize: "11px" }}>{debtor.branch_name}</div>
                  </td>
                  <td>
                    <div className="fw-bold text-danger" style={{ fontSize: "14px" }}>
                      -{formatMoney(debtor.balance)}
                    </div>
                    {isCritical && <span className="badge bg-danger p-1" style={{ fontSize: '8px' }}>KRITIK</span>}
                  </td>
                  <td className="text-end pe-3">
                    <Icon icon="solar:alt-arrow-right-linear" className="text-muted opacity-50" width="18" />
                  </td>
                </tr>
              );
            })
          }
        </DataTable>
      )}
    </div>
  );
};

export default Debtors;