import React from "react";
import IOSSwitch from "../../../../components/common/switch/Switch";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, Paper, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, TablePagination, Typography } from "@mui/material";
import "./slide.table.css";

const SlideTable = ({ records, totalRows, rowsPerPage, pageNo, handleChangePage, handleChangeRowsPerPage, handleEdit, handleDelete }) => {
  
  if (records && records.length > 0) {
    return (
      <div>
        {/* <Box> */}
          <TableContainer component="Box" style={{ width: "100%" }}>
            <Table size="small">
              <TableHead>
                <TableRow className="table-header-wrapper">
                  <TableCell className="header-row">Id</TableCell>
                  <TableCell className="header-row">Supplior</TableCell>
                  <TableCell className="header-row">Media</TableCell>
                  <TableCell className="header-row">Provence</TableCell>
                  <TableCell className="header-row">City</TableCell>
                  <TableCell className="header-row">Area</TableCell>
                  <TableCell className="header-row">Sub-Area</TableCell>
                  <TableCell className="header-row">Sup-FPirce</TableCell>
                  <TableCell className="header-row">Cus-FPrice</TableCell>
                  <TableCell className="header-row">Status</TableCell>
                  <TableCell className="header-row">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-body-style" style={{ minHeight: "60v !important" }}>
                {records.map((row, index) => {
                  return (
                    <TableRow key={row._id+index} style={{ height: "20px" }}>
                      <TableCell variant="caption">{row._id || "-"}</TableCell>
                      <TableCell variant="caption">{row.supplior || "-"}</TableCell>
                      <TableCell variant="caption">{row.mediaType || "-"}</TableCell>
                      <TableCell variant="caption">{row.provence || "-"}</TableCell>
                      <TableCell variant="caption">{row.city || "-"}</TableCell>
                      <TableCell variant="caption">{row.area || "-"}</TableCell>
                      <TableCell variant="caption">{row.subArea || "-"}</TableCell>
                      <TableCell variant="caption">{row.finalPrice || "-"}</TableCell>
                      <TableCell variant="caption">{row.customerFinalPrice || "-"}</TableCell>
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

export default SlideTable;
