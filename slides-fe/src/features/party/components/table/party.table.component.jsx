import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ModeEditOutlineIcon, DeleteIcon, ChevronRightIcon } from "../../../../components/icons";
import TablePagination from "../../../../components/common/table/TablePagination";
import StatusBadge from "../../../../components/common/StatusBadge";
import DetailPanel, { DetailItem, DetailSection } from "../../../../components/common/DetailPanel";

const initialOf = (name) => (name || "?").trim().charAt(0).toUpperCase();
const statusOf = (row) => row.status || (row.is_active === false ? "Inactive" : row.is_active ? "Active" : null);

const PartyDetailPanel = ({ party, onEdit, onDelete, onClose, onPrev, onNext, position }) => (
  <DetailPanel
    open
    title={party.name || "Party"}
    subtitle={[party.partyType, party.city, party.provence].filter(Boolean).join(" · ")}
    onClose={onClose}
    onPrev={onPrev}
    onNext={onNext}
    position={position}
    actions={
      <>
        <button type="button" className="row-btn row-btn--danger h-9" onClick={onDelete}>
          <DeleteIcon fontSize="small" /> Delete
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[13px] font-medium text-on-brand transition-colors hover:bg-brand-strong"
        >
          <ModeEditOutlineIcon fontSize="small" /> Edit
        </button>
      </>
    }
  >
    <DetailSection title="Overview">
      <DetailItem label="Type" value={party.partyType} />
      <DetailItem label="Status" value={statusOf(party) ? <StatusBadge status={statusOf(party)} /> : null} />
      <DetailItem label="Province" value={party.provence} />
      <DetailItem label="City" value={party.city} />
    </DetailSection>

    <DetailSection title="Contact">
      <DetailItem label="Contact person" value={party.contactPerson} />
      <DetailItem label="Contact email" value={party.contactPersonEmail} />
      <DetailItem label="Company email" value={party.email} />
      <DetailItem label="Website" value={party.website} />
      <DetailItem label="Cell" value={party.cellNo} mono />
      <DetailItem label="Phone" value={party.phoneNo} mono />
      <DetailItem label="Fax" value={party.fax} mono wide />
    </DetailSection>

    <DetailSection title="Tax & banking">
      <DetailItem label="NTN" value={party.ntn} mono />
      <DetailItem label="GST" value={party.gst} mono />
      <DetailItem label="Bank" value={party.bankName} />
      <DetailItem label="Account number" value={party.accountNumber} mono />
    </DetailSection>

    <DetailSection title="Internal">
      <DetailItem label="GL code" value={party.gl_code} mono />
      <DetailItem label="GL name" value={party.gl_name} />
      <DetailItem label="Remarks" value={party.remarks_internal} wide />
      <DetailItem label="Record ID" value={party._id} mono wide />
    </DetailSection>
  </DetailPanel>
);

PartyDetailPanel.propTypes = {
  party: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  position: PropTypes.node,
};

const PartyTable = ({
  records,
  totalRows,
  rowsPerPage,
  pageNo,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDelete,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => setOpenIndex(null), [records]);

  if (!records || records.length === 0) return null;
  const openParty = openIndex === null ? null : records[openIndex];

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
      {/* Fixed layout + wrapping: fits the container, no horizontal scroll. */}
      <table className="grid-table table-fixed">
        <thead>
          <tr>
            <th>Party</th>
            <th className="hidden w-[14%] md:table-cell">Type</th>
            <th className="hidden w-[22%] lg:table-cell">Contact</th>
            <th className="hidden w-[14%] xl:table-cell">Cell</th>
            <th className="hidden w-[11%] sm:table-cell">Status</th>
            <th className="w-[200px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((row, index) => (
            <tr
              key={row._id || index}
              onClick={() => setOpenIndex(index)}
              aria-selected={index === openIndex}
              className="cursor-pointer"
            >
              <td>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="avatar" aria-hidden="true">{initialOf(row.name)}</span>
                  <div className="min-w-0">
                    <div className="cell-title line-clamp-2 break-words">{row.name || "-"}</div>
                    <div className="cell-meta truncate">
                      {[row.city, row.provence].filter(Boolean).join(", ") || "No location"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell">
                {row.partyType ? <span className="chip chip--brand">{row.partyType}</span> : "-"}
              </td>
              <td className="hidden lg:table-cell">
                <div className="truncate">{row.contactPerson || <span className="text-text-muted">—</span>}</div>
                <div className="cell-meta truncate">{row.contactPersonEmail || row.email || ""}</div>
              </td>
              <td className="num hidden xl:table-cell">{row.cellNo || <span className="text-text-muted">—</span>}</td>
              <td className="hidden sm:table-cell">
                {statusOf(row) ? <StatusBadge status={statusOf(row)} /> : <span className="text-text-muted">—</span>}
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="row-btn row-btn--info"
                    aria-label={`Edit ${row.name || "party"}`}
                    onClick={stop(() => handleEdit(row._id))}
                  >
                    <ModeEditOutlineIcon fontSize="small" /> Edit
                  </button>
                  <button
                    type="button"
                    className="row-btn row-btn--danger"
                    aria-label={`Delete ${row.name || "party"}`}
                    onClick={stop(() => handleDelete(row._id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                  <ChevronRightIcon fontSize="small" className="text-text-muted" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        count={totalRows || 0}
        rowsPerPage={rowsPerPage}
        page={pageNo}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      {openParty && (
        <PartyDetailPanel
          party={openParty}
          onEdit={() => handleEdit(openParty._id)}
          onDelete={() => handleDelete(openParty._id)}
          onClose={() => setOpenIndex(null)}
          onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
          onNext={openIndex < records.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined}
          position={`${pageNo * rowsPerPage + openIndex + 1} of ${totalRows}`}
        />
      )}
    </div>
  );
};

PartyTable.propTypes = {
  records: PropTypes.array,
  totalRows: PropTypes.number,
  rowsPerPage: PropTypes.number,
  pageNo: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default PartyTable;
