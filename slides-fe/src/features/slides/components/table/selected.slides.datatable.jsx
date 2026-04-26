import React from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { addSlide, clearSlides, removeSlide } from "../../slice/slidesForPptxSlice";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
import { showToastNotification } from "../../../../helpers/notificationsHepler";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import "./slide.table.css";

const SelectedDataTableComponent = ({data, columns}) => {
  const dispatch = useDispatch();

  // Transform data to match column order
  const transformedData = data.map((row, idx) => {
    // Add a remove button at the end of each row
    const rowData = columns.map(col => row[col.name] || '');
    rowData.push(
      <IconButton
        aria-label="remove"
        color="error"
        size="small"
        onClick={e => {
          e.stopPropagation();
          dispatch(removeSlide(row));
          showToastNotification("success", "Slide removed from selection");
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    );
    return rowData;
  });

  // Add a column for the remove button
  const columnsWithRemove = [
    ...columns,
    { name: "remove", label: "Remove", options: { filter: false, sort: false, searchable: false } }
  ];

  // Custom options for the table
  const options = {
    filterType: "dropdown",
    search: true,
    searchOpen: true,
    selectableRows: "none", // Disable row selection entirely
    pagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    customToolbar: () => {
      return (
        <CustomButton 
          id="clearAll" 
          name="clearAll" 
          label="Clear All" 
          handleClick={() => {
            dispatch(clearSlides());
            showToastNotification("success", "All slides cleared from selection");
          }}
          variant="outlined"
        />
      );
     },
    customToolbarSelect: () => {
      return null; // Disable the default toolbar
    },
    onRowClick: (rowData, rowMeta) => {
      handleRemoveSlide(rowMeta.dataIndex);
    },
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
      // Get the indexes of selected rows
      const selectedIndexes = allRowsSelected.map((row) => row.dataIndex);
      const selectedData = selectedIndexes.map((index) => data[index]).filter(Boolean);

      // Find which slides are newly selected and which are deselected
      const selectedIds = new Set(selectedData.map(slide => slide._id));
      const prevSelectedIds = new Set(Object.keys(selectedSlideIds).filter(id => selectedSlideIds[id]));

      // Slides to remove: previously selected but not in current selection
      const toRemove = [...prevSelectedIds].filter(id => !selectedIds.has(id));
      // Slides to add: currently selected but not previously selected
      const toAdd = selectedData.filter(slide => !prevSelectedIds.has(slide._id));

      toRemove.forEach(id => {
        const slide = data.find(s => s._id === id);
        if (slide) dispatch(removeSlide(slide));
      });
      if (toAdd.length > 0) {
        dispatch(addSlide(toAdd));
      }
    },
    textLabels: {
      body: {
        noMatch: "No matching records found",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of"
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table"
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET"
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns"
      },
      selectedRows: {
        text: "rows selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows"
      }
    },
    setTableProps: () => ({
      style: {
        fontSize: '0.8125rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    }),
    setRowProps: () => ({
      style: {
        fontSize: '0.8125rem',
        height: '32px',
        padding: '4px 8px'
      }
    }),
    setHeaderProps: () => ({
      style: {
        fontSize: '0.8125rem',
        fontWeight: 600,
        height: '40px',
        padding: '4px 8px'
      }
    }),
    responsive: 'standard',
    tableBodyHeight: 'auto',
    tableBodyMaxHeight: 'calc(100vh - 200px)',
    fixedHeader: true,
    elevation: 0,
    downloadOptions: {
      filename: 'selected_slides.csv',
      separator: ',',
    },
    print: true,
    viewColumns: true,
    filter: true
  };

  return (
    <div style={{ padding: '12px' }}>
      <MUIDataTable
        title="Selected Slides"
        data={transformedData}
        columns={columnsWithRemove}
        options={options}
      />
    </div>
  );
};

export default SelectedDataTableComponent;
