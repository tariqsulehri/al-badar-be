import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSlides, removeSlide } from "../../slice/slidesForPptxSlice";
import { setDraftSlides } from "../../../customerPlan/slice/customerPlanSlice";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
import { showToastNotification } from "../../../../helpers/notificationsHepler";
import { DeleteIcon, PlanIcon } from "../../../../components/icons";
import TablePagination from "../../../../components/common/table/TablePagination";
import "./slide.table.css";

const SelectedDataTableComponent = ({ data = [], columns = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.options?.display !== false),
    [columns]
  );

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const query = searchText.toLowerCase();
    return data.filter((row) =>
      visibleColumns.some((col) => {
        const val = row[col.name];
        return val != null && String(val).toLowerCase().includes(query);
      })
    );
  }, [data, searchText, visibleColumns]);

  const totalRows = filteredData.length;
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleClearAll = () => {
    dispatch(clearSlides());
    showToastNotification("success", "All slides cleared from selection");
  };

  const handleRemoveOne = (e, row) => {
    e.stopPropagation();
    dispatch(removeSlide(row));
    showToastNotification("success", "Slide removed from selection");
  };

  const downloadCsv = () => {
    if (!filteredData.length) return;
    const header = visibleColumns.map((c) => `"${c.label}"`).join(",");
    const rows = filteredData.map((row) =>
      visibleColumns.map((c) => `"${row[c.name] ?? ""}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_slides.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-text-primary">Selected Slides</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-muted text-brand-strong">
            {data.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            placeholder="Search selected..."
            className="h-9 px-3 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary text-xs placeholder:text-text-muted outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!filteredData.length}
            className="h-9 px-3 rounded-lg border border-border-soft bg-bg-surface-strong text-xs font-semibold text-text-primary hover:bg-brand-muted hover:text-brand-strong disabled:opacity-40 transition-colors cursor-pointer"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setDraftSlides(data));
              showToastNotification("success", `Moved ${data.length} slide(s) to Customer Plan`);
              navigate("/customer-plans/create");
            }}
            disabled={!data.length}
            className="h-9 px-3 rounded-lg bg-brand text-on-brand text-xs font-bold hover:bg-brand-strong disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlanIcon fontSize="small" /> Move to Plan
          </button>
          <CustomButton
            id="clearAll"
            name="clearAll"
            label="Clear All"
            handleClick={handleClearAll}
            variant="outlined"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="grid-table">
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.name} className="py-3 px-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="py-8 text-center text-text-muted">
                  No selected slides to display
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={row._id || idx}>
                  {visibleColumns.map((col) => (
                    <td key={col.name} className="py-2.5 px-3 whitespace-nowrap">
                      {row[col.name] ?? "-"}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      aria-label="Remove slide from selection"
                      onClick={(e) => handleRemoveOne(e, row)}
                      className="p-1 rounded-lg text-text-secondary hover:text-danger hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        count={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
};

SelectedDataTableComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
};

export default SelectedDataTableComponent;
