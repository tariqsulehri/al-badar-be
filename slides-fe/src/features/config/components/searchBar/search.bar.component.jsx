import React from "react";
import SearchIcon from "@mui/icons-material/Search";

import { IconButton, InputLabel, MenuItem, Select, FormControl, InputBase, Paper, Box } from "@mui/material";
import "./search.bar.css";

const SearchBar = ({searchBy, searchText ,onChangeSearchBy, onSearchChange, handleSearch }) => {
  return (
    <div className="page-wrapper">
      <Box className="table-header">
        <Box className="searchWrapper">
          <FormControl fullWidth sx={{ width: 140, height: 40 }}>
            <InputLabel id="demo-simple-select-label">Search </InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" sx={{ height: 40 }} label="Search Types" value={searchBy} onChange={onChangeSearchBy}>
              <MenuItem selected value="_id">
                Id
              </MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>

          <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400, height: "40px" }}>
            <InputBase onChange={onSearchChange} value={searchText} sx={{ ml: 1, flex: 1 }} placeholder="Search by id, user" />
            <IconButton onClick={handleSearch} type="button" sx={{ p: "4px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default SearchBar;
