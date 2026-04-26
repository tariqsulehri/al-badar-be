import React from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, TablePagination, Box } from "@mui/material";
import "./party.table.css";

const PartyTable = ({ records, totalRows, rowsPerPage, pageNo, handleChangePage, handleChangeRowsPerPage, handleEdit, handleDelete }) => {
  if (records && records.length > 0) {
    return (
      <div>
        {/* <Box> */}
          <TableContainer component="Box" style={{ width: "100%" }}>
            <Table size="small">
              <TableHead>
                <TableRow className="table-header-wrapper">
                  <TableCell className="header-row">Id</TableCell>
                  <TableCell className="header-row">Party Name</TableCell>
                  <TableCell className="header-row">Type</TableCell>
                  <TableCell className="header-row">Provence</TableCell>
                  <TableCell className="header-row">City</TableCell>
                  <TableCell className="header-row">Cell No</TableCell>
                  <TableCell className="header-row">Email</TableCell>
                  <TableCell className="header-row">Contact Person</TableCell>
                  <TableCell className="header-row">Contact Email</TableCell>
                  <TableCell className="header-row">Status</TableCell>
                  <TableCell className="header-row">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-body-style" style={{ minHeight: "60v !important" }}>
                {records.map((row, index) => {
                  return (
                    <TableRow key={row._id+index} style={{ height: "20px" }}>
                      <TableCell variant="caption">{row._id || "-"}</TableCell>
                      <TableCell variant="caption">{row.name || "-"}</TableCell>
                      <TableCell variant="caption">{row.partyType || "-"}</TableCell>
                      <TableCell variant="caption">{row.provence || "-"}</TableCell>
                      <TableCell variant="caption">{row.city || "-"}</TableCell>
                      <TableCell variant="caption">{row.cellNo || "-"}</TableCell>
                      <TableCell variant="caption">{row.email || "-"}</TableCell>
                      <TableCell variant="caption">{row.contactPerson || "-"}</TableCell>
                      <TableCell variant="caption">{row.contactPersonEmail || "-"}</TableCell>
                      <TableCell variant="caption">{row.status || "-"}</TableCell>
                      <TableCell variant="caption">
                        <IconButton
                          size="small"
                          key={row.id + "-Edit"}
                          className="custom-icon-button"
                          onClick={() => {
                            handleEdit(row._id);
                          }}
                        >
                          <ModeEditOutlineIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          key={row.id + "-Delete"}
                          className="custom-icon-button"
                          onClick={() => {
                            handleDelete(row._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="Box"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={pageNo}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        {/* </Box> */}
      </div>
    );
  }
};

export default PartyTable;
