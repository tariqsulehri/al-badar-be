import React, { useEffect, useMemo, useState } from "react";
import {
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../components/form-controls/buttons/customButton";
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
  const [searchBy, setSearchBy] = useState("_id");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async (nextPage = pageNo, nextRowsPerPage = rowsPerPage, nextSearchBy = searchBy, nextSearchText = searchText) => {
    setIsLoading(true);
    try {
      const response = await getAllItems(nextRowsPerPage, nextPage, nextSearchBy, nextSearchText);
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
  }, []);

  const meta = useMemo(
    () => [
      { label: "Collection", value: collectionLabel },
      { label: "Records", value: String(totalRows || records.length || 0).padStart(2, "0") },
      { label: "Search Type", value: searchBy === "_id" ? "ID" : "Name" },
    ],
    [collectionLabel, records.length, searchBy, totalRows]
  );

  const handleSearch = () => {
    setPageNo(0);
    fetchRecords(0, rowsPerPage, searchBy, searchText);
  };

  const handleRefresh = () => {
    setSearchBy("_id");
    setSearchText("");
    setPageNo(0);
    fetchRecords(0, rowsPerPage, "_id", "");
  };

  const handleDelete = async (id) => {
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
      <header className="config-crud__hero page-card">
        <div>
          <span className="page-header__eyebrow">Collection Manager</span>
          <h1>{collectionLabel}</h1>
          <p>
            Search, review, and manage canonical {collectionLabel.toLowerCase()} records from a cleaner,
            faster operational table.
          </p>
        </div>

        <div className="config-crud__hero-actions">
          <CustomButton
            label={`Create ${singularLabel}`}
            handleClick={() => navigate(`${routeBase}/create`)}
          />
        </div>
      </header>

      <div className="config-crud__meta">
        {meta.map((item) => (
          <article key={item.label} className="page-card config-crud__meta-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <article className="page-card config-crud__search">
        <Select value={searchBy} onChange={(event) => setSearchBy(event.target.value)} size="small">
          <MenuItem value="_id">Search by ID</MenuItem>
          <MenuItem value="name">Search by Name</MenuItem>
        </Select>

        <TextField
          size="small"
          label="Search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={`Find ${singularLabel.toLowerCase()} records`}
        />

        <CustomButton label="Search" handleClick={handleSearch} />
        <CustomButton label="Reset" handleClick={handleRefresh} variant="outlined" />
      </article>

      <article className="page-card config-crud__table">
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`config-crud__status ${
                        row.is_active ? "config-crud__status--active" : "config-crud__status--inactive"
                      }`}
                    >
                      {row.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <div className="config-crud__table-actions">
                      <IconButton
                        className="config-crud__icon-btn"
                        onClick={() => navigate(`${routeBase}/create?id=${row._id}`)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton className="config-crud__icon-btn" onClick={() => handleDelete(row._id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && records.length === 0 && (
          <div className="config-crud__empty">
            No {collectionLabel.toLowerCase()} records found for the current search.
          </div>
        )}

        <TablePagination
          component="div"
          count={totalRows}
          page={pageNo}
          onPageChange={(_, newPage) => {
            setPageNo(newPage);
            fetchRecords(newPage);
          }}
          rowsPerPage={rowsPerPage}
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

export default ConfigCrudList;
