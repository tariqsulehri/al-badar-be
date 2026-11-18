import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PptxGenJS from "pptxgenjs";
import { AddIcon, DownloadIcon } from "../../components/icons";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/searchBar/search.bar.component";
import { getAllSlides, getSlidesBySearch } from "../../services/apis/slideService";
import { getAllCitiesForSelection } from "../../services/apis/config/cityService";
import { getAllAreasForSelection } from "../../services/apis/config/areaService";
import { getAllSubAreasForSelection } from "../../services/apis/config/subAreaService";
import { getAllSuppliersForSelection } from "../../services/apis/partyService";
import SlidesDataTable from "../../features/slides/components/table/slides.mui.datatable";
import { showToastNotification } from "../../helpers/notificationsHepler";
import { addSlide, clearSlides } from "../../features/slides/slice/slidesForPptxSlice";
import pptxHelper from "./components/helpers/pptxHelper";
import { category } from "../../constant/data";

const emptyFilters = {
  city: "",
  area: "",
  subArea: "",
  supplier: "",
  category: "",
};

const SlideList = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const selectedSlides = useSelector((state) => state.slidesForPptx.slidesForPptx);
  const selectedCount  = selectedSlides.length;

  const [slides,      setSlides]      = useState([]);
  const [totalRows,   setTotalRows]   = useState(0);
  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchBy,    setSearchBy]    = useState("code");
  const [searchText,  setSearchText]  = useState("");
  const [filters,     setFilters]     = useState(emptyFilters);
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    areas: [],
    subAreas: [],
    suppliers: [],
    categories: category,
  });
  const [loading,     setLoading]     = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const activeSearchLabel = [
    searchText ? `matching ${searchBy} "${searchText}"` : "",
    activeFilterCount ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const fetchSlides = async (
    nextPage        = page,
    nextRowsPerPage = rowsPerPage,
    nextSearchBy    = searchBy,
    nextSearchText  = searchText,
    nextFilters     = filters,
  ) => {
    setLoading(true);
    try {
      const response = await getAllSlides(nextRowsPerPage, nextPage + 1, nextSearchBy, nextSearchText, nextFilters);
      setSlides(response?.data || []);
      setTotalRows(response?.totalRecords || 0);
    } catch {
      showToastNotification("error", "Failed to fetch slides");
      setSlides([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only on paging; search calls fetchSlides itself
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [cities, areas, subAreas, suppliers] = await Promise.all([
          getAllCitiesForSelection(),
          getAllAreasForSelection(),
          getAllSubAreasForSelection(),
          getAllSuppliersForSelection(),
        ]);

        setFilterOptions({
          cities,
          areas,
          subAreas,
          suppliers,
          categories: category,
        });
      } catch {
        showToastNotification("error", "Failed to load advanced filter options");
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSearch = (nextSearchBy, nextSearchText, nextFilters = filters) => {
    setSearchBy(nextSearchBy);
    setSearchText(nextSearchText);
    setFilters(nextFilters);
    // On another page, resetting to page 0 triggers the page effect (which sees the
    // new search state); only fetch directly when already on page 0, to avoid a double request.
    if (page === 0) fetchSlides(0, rowsPerPage, nextSearchBy, nextSearchText, nextFilters);
    else setPage(0);
  };

  const handleSelectPage = () => {
    dispatch(addSlide(slides.filter(Boolean)));
    showToastNotification("success", `${slides.length} slides on this page selected`);
  };

  const getActiveSearchSlides = async () => {
    const matchedSlides = await getSlidesBySearch(searchBy, searchText, totalRows, filters);
    return matchedSlides.filter(Boolean);
  };

  const handleSelectAllMatching = async () => {
    if (!totalRows) {
      showToastNotification("info", "No slides match the current search");
      return;
    }

    setExportLoading(true);
    try {
      const matchedSlides = await getActiveSearchSlides();
      dispatch(addSlide(matchedSlides));
      showToastNotification("success", `${matchedSlides.length} matching slides selected`);
    } catch {
      showToastNotification("error", "Failed to select matching slides");
    } finally {
      setExportLoading(false);
    }
  };

  const handleReset = () => {
    dispatch(clearSlides());
    showToastNotification("success", "Selection cleared");
  };

  const handleGeneratePptx = async () => {
    if (!selectedCount) {
      showToastNotification("error", "Select slides first");
      return;
    }
    try {
      const pptx = new PptxGenJS();
      await pptxHelper.createPptx(pptx, selectedSlides);
      await pptx.writeFile("slides-export.pptx");
      showToastNotification("success", `PPTX generated for ${selectedCount} slides`);
    } catch {
      showToastNotification("error", "Failed to create PPTX");
    }
  };

  const handleGenerateSearchPptx = async () => {
    if (!totalRows) {
      showToastNotification("info", "No slides match the current search");
      return;
    }

    setExportLoading(true);
    try {
      const matchedSlides = await getActiveSearchSlides();

      if (!matchedSlides.length) {
        showToastNotification("info", "No slides match the current search");
        return;
      }

      const pptx = new PptxGenJS();
      await pptxHelper.createPptx(pptx, matchedSlides);
      await pptx.writeFile("searched-slides-export.pptx");
      showToastNotification("success", `PPTX generated for ${matchedSlides.length} matching slides`);
    } catch {
      showToastNotification("error", "Failed to create PPTX for search");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <section className="page-section surface-grid">

      {/* ── Header: title + count, then the PPTX export toolbar ── */}
      <PageHeader
        title="Slides"
        count={loading ? undefined : totalRows || 0}
        noun="slide"
        meta={activeSearchLabel || null}
        actions={
          <button type="button" className="ui-btn ui-btn--primary" onClick={() => navigate("/slides/create")}>
            <AddIcon fontSize="small" /> Create slide
          </button>
        }
      >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`chip ${selectedCount ? "chip--brand" : "chip--neutral"}`}>
              PPTX queue <span className="num">{selectedCount}</span>
            </span>
            <button
              type="button"
              className="ui-btn"
              onClick={handleSelectPage}
              disabled={loading || exportLoading || !slides.length}
            >
              Select page
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={handleSelectAllMatching}
              disabled={loading || exportLoading || !totalRows}
            >
              Select all matching <span className="ui-btn__count">{totalRows || 0}</span>
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={() => navigate("/slides/selected_slides")}
              disabled={!selectedCount}
            >
              View queue
            </button>
            {selectedCount > 0 && (
              <button type="button" className="ui-btn ui-btn--ghost" onClick={handleReset}>
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="ui-btn"
              onClick={handleGenerateSearchPptx}
              disabled={loading || exportLoading || !totalRows}
              title="Export every slide matching the current search"
            >
              <DownloadIcon fontSize="small" /> Export search <span className="ui-btn__count">{totalRows || 0}</span>
            </button>
            <button
              type="button"
              className="ui-btn ui-btn--primary"
              onClick={handleGeneratePptx}
              disabled={exportLoading || !selectedCount}
              title="Export the slides in the PPTX queue"
            >
              <DownloadIcon fontSize="small" />
              {exportLoading ? "Exporting…" : "Export queue"}
              <span className="ui-btn__count">{selectedCount}</span>
            </button>
          </div>
      </PageHeader>

      <SearchBar onSearch={handleSearch} filterOptions={filterOptions} />

      <SlidesDataTable
        data={slides}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        onPageChange={setPage}
        onRowsPerPageChange={(value) => { setRowsPerPage(value); setPage(0); }}
      />
    </section>
  );
};

export default SlideList;
