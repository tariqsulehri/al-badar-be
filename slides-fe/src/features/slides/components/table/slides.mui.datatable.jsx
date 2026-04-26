import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TablePagination, TextField, Typography } from "@mui/material";
import { addSlide, removeSlide, setPagination } from "../../../../features/slides/slice/slidesForPptxSlice";
import { setSlideId } from "../../../../features/slides/slice/slideSlice";
import "./slide.table.css";

const columns = [
  { name: "_id",           label: "ID",             options: { display: false, filter: false, sort: false } },
  { name: "code",          label: "Code" },
  { name: "provence",      label: "Province" },
  { name: "city",          label: "City" },
  { name: "area",          label: "Area" },
  { name: "subArea",       label: "Sub Area" },
  { name: "supplier",      label: "Supplier" },
  { name: "mediaType",     label: "Media Type" },
  { name: "dimension",     label: "Dimension" },
  { name: "height_feets",  label: "Height" },
  { name: "width_feets",   label: "Width" },
  { name: "lights",        label: "Lights" },
  { name: "supQuotedPrice",label: "Supplier Quote" },
  { name: "finalPrice",    label: "Final Price" },
  { name: "status",        label: "Status" },
];

const SlidesDataTable = ({
  data = [],
  totalRows,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const selectedSlideIds = useSelector((state) => state.slidesForPptx.selectedSlideIds);
  const totalPages = Math.max(Math.ceil((totalRows || 0) / (rowsPerPage || 10)), 1);
  const [pageInput, setPageInput] = useState(String((page || 0) + 1));

  useEffect(() => {
    setPageInput(String((page || 0) + 1));
  }, [page]);

  const rowsSelected = useMemo(() =>
    data.map((row, i) => (selectedSlideIds?.[row?._id] ? i : -1)).filter((i) => i !== -1),
    [data, selectedSlideIds]
  );

  const options = {
    filter: false,
    search: false,
    download: false,
    print: false,
    viewColumns: true,
    selectableRows: "multiple",
    selectableRowsOnClick: false,
    rowsSelected,
    pagination: false,
    serverSide: true,
    responsive: "standard",
    elevation: 0,
    textLabels: {
      body: { noMatch: loading ? "Loading slides..." : "No slides found" },
    },
    setTableProps: () => ({ className: "slides-table" }),
    onRowClick: (_, rowMeta) => {
      const row = data[rowMeta.dataIndex];
      if (row?._id) {
        dispatch(setSlideId(row._id));
        navigate("/slides/create");
      }
    },
    onRowSelectionChange: (_, allRowsSelected) => {
      const selectedIndexes = allRowsSelected.map((r) => r.dataIndex);
      const selectedData    = selectedIndexes.map((i) => data[i]).filter(Boolean);
      const selectedIds     = new Set(selectedData.map((s) => s?._id).filter(Boolean));
      const currentPageIds  = new Set(data.map((s) => s?._id).filter(Boolean));
      const onCurrentPage   = new Set([...selectedIds].filter((id) => currentPageIds.has(id)));

      const toRemove = data
        .filter((s) => selectedSlideIds?.[s?._id])
        .filter((s) => !onCurrentPage.has(s._id));

      toRemove.forEach((s) => dispatch(removeSlide(s)));
      if (selectedData.length > 0) dispatch(addSlide(selectedData));
    },
    customToolbar: () => null,
    customToolbarSelect: () => null,
    onRowsDelete: () => false,
  };

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(Number(nextPage) || 1, 1), totalPages) - 1;
    dispatch(setPagination({ page: safePage, rowsPerPage }));
    onPageChange(safePage);
  };

  const handleRowsPerPageChange = (event) => {
    const nextRowsPerPage = Number(event.target.value);
    dispatch(setPagination({ page: 0, rowsPerPage: nextRowsPerPage }));
    onRowsPerPageChange(nextRowsPerPage);
  };

  return (
    <div className="slides-table-shell page-card">
      <MUIDataTable title={null} data={data} columns={columns} options={options} />
      <Box className="slides-pagination-bar">
        <TablePagination
          component="div"
          count={totalRows || 0}
          rowsPerPage={rowsPerPage || 10}
          page={Math.min(page || 0, totalPages - 1)}
          onPageChange={(_, nextPage) => goToPage(nextPage + 1)}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
        />
        <Box className="slides-page-jump">
          <Typography component="span" variant="body2">
            Page
          </Typography>
          <TextField
            value={pageInput}
            type="number"
            size="small"
            inputProps={{ min: 1, max: totalPages }}
            onChange={(event) => setPageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                goToPage(pageInput);
              }
            }}
          />
          <Typography component="span" variant="body2">
            of {totalPages}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => goToPage(pageInput)}>
            Go
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SlidesDataTable;
