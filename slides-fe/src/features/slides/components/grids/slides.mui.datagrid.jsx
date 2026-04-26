import React, { useState, useEffect, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";

const DataGridComponent = ({ rows, columns, filterModel, handleFilterModelChange }) => {
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {}, [rows]);
  useEffect(()=>{},[filterModel])
  

  const memoizedFilterModel = useMemo(() => filterModel, [filterModel]);
  

  return (
    <Box sx={{ height: 600, width: "100%", mt: 2 }}>
      {/* <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Data Grid with Custom Features
      </Typography> */}
      <DataGrid
        getRowId={(row) => {console.log('row::', row._id);return row._id}}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        filterModel={memoizedFilterModel}
        onFilterModelChange={(model) => {handleFilterModelChange(model)}}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 50]}
        // getCellClassName={(params) => {
        //     if (params?.field === 'city' || params?.value != 'Ahmadpur East') {
        //       return '';
        //     }
        //     return params?.value != 'Ahmadpur East';
        // }}
        pagination
        checkboxSelection
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar, // Adds the toolbar with filtering, export, and column toggle
        }}
        // columnVisibilityModel={columnVisibilityModel}
        // onColumnVisibilityModelChange={(newModel) =>
        //   setColumnVisibilityModel(newModel)
        // }
        sortingOrder={["asc", "desc"]}
        sx={{
          m:1,  
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      />
    </Box>
  );
};

export default DataGridComponent;
