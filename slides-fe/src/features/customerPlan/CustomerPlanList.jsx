import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import {
  AddIcon,
  DownloadIcon,
  DeleteIcon,
  EditOutlinedIcon,
  SearchIcon,
  RefreshIcon,
} from "../../components/icons";
import TablePagination from "../../components/common/table/TablePagination";
import {
  getAllCustomerPlans,
  deleteCustomerPlan,
} from "../../services/apis/customerPlanService";
import { exportPlanToExcel } from "./helpers/planExcelHelper";
import { formatAmount } from "../../utils/format";
import { showToastNotification } from "../../helpers/notificationsHepler";

const CustomerPlanList = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlans = async (
    nextPage = page,
    nextRowsPerPage = rowsPerPage,
    nextSearch = searchText
  ) => {
    setLoading(true);
    try {
      const response = await getAllCustomerPlans(nextRowsPerPage, nextPage, nextSearch);
      setPlans(response?.data || []);
      setTotalRows(response?.totalRecords || 0);
    } catch {
      setPlans([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPlans(0, rowsPerPage, searchText);
  };

  const handleDelete = async (e, plan) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete plan ${plan.serial_number}?`)) {
      const success = await deleteCustomerPlan(plan._id);
      if (success) {
        fetchPlans();
      }
    }
  };

  const handleDirectExcelDownload = async (e, plan) => {
    e.stopPropagation();
    try {
      await exportPlanToExcel(plan);
      showToastNotification("success", `Excel downloaded for ${plan.serial_number}`);
    } catch (err) {
      showToastNotification("error", `Failed to export Excel: ${err.message}`);
    }
  };

  return (
    <section className="page-section surface-grid space-y-4">
      {/* ── Page Header ── */}
      <PageHeader
        title="Customer Media Plans"
        count={loading ? undefined : totalRows}
        noun="plan"
        meta={searchText ? `matching "${searchText}"` : null}
        actions={
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            onClick={() => navigate("/customer-plans/create")}
          >
            <AddIcon fontSize="small" /> Create Media Plan
          </button>
        }
      />

      {/* ── Search Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px]">
          <SearchIcon
            fontSize="small"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by serial number (e.g. MP-1001), client name, title..."
            className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setPage(0);
              fetchPlans(0, rowsPerPage, "");
            }}
            className="h-10 px-3 rounded-xl border border-border-soft text-xs font-semibold text-text-secondary hover:bg-neutral-bg transition-colors"
          >
            <RefreshIcon fontSize="small" className="inline mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* ── Plans Data Table ── */}
      <div className="w-full overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="py-3 px-3 whitespace-nowrap">Serial #</th>
                <th className="py-3 px-3 whitespace-nowrap">Client Name</th>
                <th className="py-3 px-3 whitespace-nowrap">Plan Date</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Sites</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Total Sqft</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Grand Total</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Status</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-xs">
                    Loading customer plans...
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted text-xs">
                    No customer plans found. Click &quot;Create Media Plan&quot; to start.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => {
                  const slideCount = plan.slides?.length || 0;
                  const dateStr = plan.plan_date
                    ? new Date(plan.plan_date).toLocaleDateString()
                    : "-";

                  return (
                    <tr
                      key={plan._id}
                      onClick={() => navigate(`/customer-plans/edit/${plan._id}`)}
                      className="cursor-pointer hover:bg-neutral-bg/60 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-brand whitespace-nowrap">
                        {plan.serial_number}
                      </td>
                      <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">
                        {plan.client_name}
                      </td>
                      <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-bg text-text-primary">
                          {slideCount}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-text-secondary whitespace-nowrap">
                        {Math.round(plan.totalSqft || 0).toLocaleString("en-US")}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-text-primary whitespace-nowrap">
                        {formatAmount(plan.grandTotal)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-muted text-brand-strong">
                          {plan.planStatus || "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            title="Download Excel format"
                            onClick={(e) => handleDirectExcelDownload(e, plan)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand hover:bg-brand-muted/20 transition-colors"
                          >
                            <DownloadIcon fontSize="small" />
                          </button>
                          <button
                            type="button"
                            title="Edit Plan"
                            onClick={() => navigate(`/customer-plans/edit/${plan._id}`)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand hover:bg-brand-muted/20 transition-colors"
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </button>
                          <button
                            type="button"
                            title="Delete Plan"
                            onClick={(e) => handleDelete(e, plan)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-red-500/10 transition-colors"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          count={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setPage(0);
          }}
        />
      </div>
    </section>
  );
};

export default CustomerPlanList;
