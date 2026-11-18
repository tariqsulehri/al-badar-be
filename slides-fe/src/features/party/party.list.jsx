import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, RefreshIcon, AddIcon } from "../../components/icons";
import PageHeader from "../../components/common/PageHeader";
import PartyTable from "../party/components/table/party.table.component"
import {getAllParties, deleteParty} from "../../services/apis/partyService";

const PartyList = () => {

  const ROWS_PER_PAGE =10;
  // The API searches parties by name only.
  const SEARCH_BY = "name";

  const navigate = useNavigate();

  const [records, setRecords] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [pageNo, setPageNo] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const getRecords = async (
    nextPage = pageNo,
    nextRowsPerPage = rowsPerPage,
    nextSearchText = searchText
  ) => {
    // partyService already shows an error toast and returns an empty page on failure.
    const { data, totalRecords } = await getAllParties(nextRowsPerPage, nextPage, SEARCH_BY, nextSearchText.trim());
    setRecords(data);
    setTotalRows(totalRecords);
  };

  // State setters are async, so pass the new values to getRecords explicitly
  // instead of letting it read the stale pageNo/rowsPerPage.
  const handleSearch = async () => {
    setPageNo(0);
    setAppliedSearch(searchText.trim());
    await getRecords(0);
  };

  const handleReset = async () => {
    setSearchText("");
    setAppliedSearch("");
    setPageNo(0);
    await getRecords(0, rowsPerPage, "");
  };

  const handleChangePage = async (event, newPage) => {
    setPageNo(newPage);
    await getRecords(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const nextRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(nextRowsPerPage);
    setPageNo(0);
    await getRecords(0, nextRowsPerPage);
  };

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const handleEdit = (id) => {
    navigate(`/party/create?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const party = records?.find((r) => r._id === id);
    if (!window.confirm(`Delete party "${party?.name || id}"? This can't be undone.`)) return;
    // deleteParty shows its own error toast.
    if (await deleteParty(id)) await getRecords();
  };


  const header = (
    <PageHeader
      title="Parties"
      count={records === null ? undefined : totalRows}
      noun="party"
      plural="parties"
      meta={appliedSearch ? `matching "${appliedSearch}"` : null}
      actions={
        <button type="button" className="ui-btn ui-btn--primary" onClick={() => navigate("/party/create")}>
          <AddIcon fontSize="small" /> Create party
        </button>
      }
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon fontSize="small" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search parties by name…"
            aria-label="Search parties by name"
            className="h-9 w-full rounded-lg border border-border-strong bg-bg-surface-strong pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-muted"
          />
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={handleSearch}>
          Search
        </button>
        <button type="button" className="ui-btn" onClick={handleReset}>
          <RefreshIcon fontSize="small" /> Reset
        </button>
      </div>
    </PageHeader>
  );

  return (
    <section className="flex flex-col gap-4">
      {header}
      {records === null ? null : records.length > 0 ? (
        <PartyTable
          records={records}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          pageNo={pageNo}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <div className="rounded-2xl border border-border-soft bg-bg-surface p-10 text-center text-sm text-text-secondary shadow-soft">
          {appliedSearch ? `No parties match "${appliedSearch}".` : "No parties yet."}
        </div>
      )}
    </section>
  );
};

export default PartyList;
