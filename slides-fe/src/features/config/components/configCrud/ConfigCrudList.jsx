import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { EditOutlinedIcon, DeleteOutlineIcon, AddIcon, SearchIcon, RefreshIcon } from "../../../../components/icons";
import PageHeader from "../../../../components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import TablePagination from "../../../../components/common/table/TablePagination";
import { showToastNotification } from "../../../../helpers/notificationsHepler";
import "./configCrud.css";

const ConfigCrudList = ({
  singularLabel,
  collectionLabel,
  routeBase,
  getAllItems,
  deleteItem,
}) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async (
    nextPage = pageNo,
    nextRowsPerPage = rowsPerPage,
    nextSearchText = searchText
  ) => {
    setIsLoading(true);
    try {
      // The API searches lookups by name.
      const response = await getAllItems(nextRowsPerPage, nextPage, "name", nextSearchText.trim());
      setRecords(response?.data || []);
      setTotalRows(response?.totalRecords || 0);
    } catch (error) {
      showToastNotification("error", `Failed to load ${collectionLabel.toLowerCase()}`);
      setRecords([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  // What the current list reflects (search applied on Search/Enter, not per keystroke).
  const [appliedSearch, setAppliedSearch] = useState("");

  const handleSearch = () => {
    setPageNo(0);
    setAppliedSearch(searchText.trim());
    fetchRecords(0, rowsPerPage, searchText);
  };

  const handleRefresh = () => {
    setSearchText("");
    setAppliedSearch("");
    setPageNo(0);
    fetchRecords(0, rowsPerPage, "");
  };

  const handleDelete = async (id) => {
    const record = records.find((r) => r._id === id);
    if (!window.confirm(`Delete ${singularLabel.toLowerCase()} "${record?.name || id}"? This can't be undone.`)) return;
    try {
      await deleteItem(id);
      showToastNotification("success", `${singularLabel} deleted successfully`);
      fetchRecords();
    } catch (error) {
      showToastNotification("error", `Failed to delete ${singularLabel.toLowerCase()}`);
    }
  };

  return (
    <section className="config-crud page-section">
      <PageHeader
        title={collectionLabel}
        count={isLoading ? undefined : totalRows}
        noun={singularLabel.toLowerCase()}
        plural={collectionLabel.toLowerCase()}
        meta={appliedSearch ? `matching "${appliedSearch}"` : null}
        actions={
          <button type="button" className="ui-btn ui-btn--primary" onClick={() => navigate(`${routeBase}/create`)}>
            <AddIcon fontSize="small" /> Create {singularLabel.toLowerCase()}
          </button>
        }
      >
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon fontSize="small" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder={`Search ${collectionLabel.toLowerCase()} by name…`}
              aria-label={`Search ${collectionLabel.toLowerCase()} by name`}
              className="h-9 w-full rounded-lg border border-border-strong bg-bg-surface-strong pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-muted"
            />
          </div>
          <button type="button" className="ui-btn ui-btn--primary" onClick={handleSearch}>
            Search
          </button>
          <button type="button" className="ui-btn" onClick={handleRefresh}>
            <RefreshIcon fontSize="small" /> Reset
          </button>
        </div>
      </PageHeader>

      <article className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="grid-table table-fixed">
            <thead>
              <tr>
                <th>Name</th>
                <th className="w-[16%]">Status</th>
                <th className="hidden w-[30%] lg:table-cell">ID</th>
                <th className="w-[180px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row._id}>
                  <td>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="avatar" aria-hidden="true">{(row.name || "?").trim().charAt(0).toUpperCase()}</span>
                      <span className="cell-title truncate">{row.name || "-"}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`chip ${row.is_active ? "chip--success" : "chip--neutral"}`}>
                      {row.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="num hidden truncate text-[13px] text-text-muted lg:table-cell">{row._id}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${row.name || "item"}`}
                        className="row-btn row-btn--info"
                        onClick={() => navigate(`${routeBase}/create?id=${row._id}`)}
                      >
                        <EditOutlinedIcon fontSize="small" /> Edit
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${row.name || "item"}`}
                        className="row-btn row-btn--danger"
                        onClick={() => handleDelete(row._id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && records.length === 0 && (
          <div className="py-8 text-center text-sm text-text-muted">
            No {collectionLabel.toLowerCase()} records found for the current search.
          </div>
        )}

        <TablePagination
          count={totalRows}
          page={pageNo}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => {
            setPageNo(newPage);
            fetchRecords(newPage);
          }}
          onRowsPerPageChange={(event) => {
            const nextRows = parseInt(event.target.value, 10);
            setRowsPerPage(nextRows);
            setPageNo(0);
            fetchRecords(0, nextRows);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </article>
    </section>
  );
};

ConfigCrudList.propTypes = {
  singularLabel: PropTypes.string.isRequired,
  collectionLabel: PropTypes.string.isRequired,
  routeBase: PropTypes.string.isRequired,
  getAllItems: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};

export default ConfigCrudList;
