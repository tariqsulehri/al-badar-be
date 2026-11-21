import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PptxGenJS from "pptxgenjs";

import PageHeader from "../../components/common/PageHeader";
import {
  AddIcon,
  DownloadIcon,
  DeleteIcon,
  ChevronLeftIcon,
  SlidesIcon,
} from "../../components/icons";
import { showToastNotification } from "../../helpers/notificationsHepler";
import { getAllClientsForSelection } from "../../services/apis/partyService";
import {
  createCustomerPlan,
  updateCustomerPlan,
  findCustomerPlanById,
  getNextSerialNumber,
} from "../../services/apis/customerPlanService";
import {
  updateSlideRow,
  removeSlideFromDraft,
  addSlidesToDraft,
  setDraftClient,
  setDraftMetadata,
  loadExistingPlan,
  resetDraftPlan,
  setDraftSlides,
} from "./slice/customerPlanSlice";
import { exportPlanToExcel } from "./helpers/planExcelHelper";
import SlidePickerModal from "./components/SlidePickerModal";
import pptxHelper from "../slides/components/helpers/pptxHelper";
import { formatAmount } from "../../utils/format";
import "./customerPlan.css";

const STATUS_OPTIONS = [
  "Available",
  "Booked",
  "Reserved",
  "Hold",
  "Under Maintenance",
  "Occupied",
];

const PLAN_STATUS_OPTIONS = [
  "Draft",
  "Sent",
  "Approved",
  "Active",
  "Archived",
];

const CustomerPlanEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const draft = useSelector((state) => state.customerPlan.draft);
  const selectedSlidesFromQueue = useSelector((state) => state.slidesForPptx.slidesForPptx);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSlidePickerOpen, setIsSlidePickerOpen] = useState(false);

  // Load clients list from parties
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientList = await getAllClientsForSelection();
        setClients(clientList);
      } catch {
        showToastNotification("error", "Failed to load clients list");
      }
    };
    fetchClients();
  }, []);

  // Initialize or fetch plan
  useEffect(() => {
    if (id) {
      setLoading(true);
      findCustomerPlanById(id)
        .then((plan) => {
          if (plan) {
            dispatch(loadExistingPlan(plan));
          } else {
            showToastNotification("error", "Plan not found");
            navigate("/customer-plans/list");
          }
        })
        .finally(() => setLoading(false));
    } else {
      // New plan mode: if serial_number not yet assigned, fetch the next serial number
      if (!draft.serial_number) {
        getNextSerialNumber().then((res) => {
          if (res) {
            dispatch(setDraftMetadata({ field: "serial_number", value: res.serial_number }));
            dispatch(setDraftMetadata({ field: "plan_number", value: res.plan_number }));
          }
        });
      }

      // If draft slides are empty and user had slides in queue, import them
      if (draft.slides.length === 0 && selectedSlidesFromQueue.length > 0) {
        dispatch(setDraftSlides(selectedSlidesFromQueue));
        showToastNotification("info", `Imported ${selectedSlidesFromQueue.length} slides from queue`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, navigate]);

  // Aggregate totals
  const totals = useMemo(() => {
    const slides = draft.slides || [];
    const totalSqft = slides.reduce((acc, s) => acc + (Number(s.width_feets) || 0) * (Number(s.height_feets) || 0), 0);
    const totalQuoting = slides.reduce((acc, s) => acc + (Number(s.quotingMonthlyRent) || 0), 0);
    const totalDiscounted = slides.reduce((acc, s) => acc + (Number(s.discountedMonthlyRent) || 0), 0);
    const totalThirtyDays = slides.reduce((acc, s) => acc + (Number(s.thirtyDaysRent) || 0), 0);
    const totalSkin = slides.reduce((acc, s) => acc + (Number(s.skinCost) || 0), 0);
    const grandTotal = slides.reduce(
      (acc, s) => acc + (Number(s.thirtyDaysRent) || 0) + (Number(s.skinCost) || 0),
      0
    );

    return {
      totalSqft,
      totalQuoting,
      totalDiscounted,
      totalThirtyDays,
      totalSkin,
      grandTotal,
    };
  }, [draft.slides]);

  // Client dropdown change
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find((c) => String(c._id) === String(clientId));
    dispatch(setDraftClient(client || null));
  };

  // Row field update
  const handleRowChange = (index, field, value) => {
    dispatch(updateSlideRow({ index, field, value }));
  };

  // Remove slide from plan
  const handleRemoveRow = (slideId) => {
    dispatch(removeSlideFromDraft(slideId));
  };

  // Add slides from picker modal
  const handleAddSlidesFromPicker = (newSlides) => {
    dispatch(addSlidesToDraft(newSlides));
    showToastNotification("success", `Added ${newSlides.length} slide(s) to plan`);
  };

  // Save or Update Plan
  const handleSavePlan = async () => {
    if (!draft.client_id) {
      showToastNotification("warning", "Please select a client from the list of parties");
      return;
    }
    if (draft.slides.length === 0) {
      showToastNotification("warning", "Please add at least one slide to the plan");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        serial_number: draft.serial_number,
        plan_number: draft.plan_number,
        plan_date: draft.plan_date || new Date(),
        title: draft.title || `ABMS Outdoor Media Plan for ${draft.client_name || "Client"}`,
        client_id: draft.client_id,
        client_name: draft.client_name,
        client_details: draft.client_details,
        slides: draft.slides,
        notes: draft.notes,
        planStatus: draft.planStatus || "Draft",
      };

      if (id) {
        const updated = await updateCustomerPlan(id, payload);
        if (updated) {
          navigate("/customer-plans/list");
        }
      } else {
        const created = await createCustomerPlan(payload);
        if (created) {
          dispatch(resetDraftPlan());
          navigate("/customer-plans/list");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  // Download Excel
  const handleDownloadExcel = async () => {
    if (draft.slides.length === 0) {
      showToastNotification("warning", "No slides to export. Add slides first.");
      return;
    }
    try {
      await exportPlanToExcel({
        ...draft,
        ...totals,
      });
      showToastNotification("success", "Excel file generated and downloaded successfully");
    } catch (err) {
      showToastNotification("error", `Failed to generate Excel: ${err.message}`);
    }
  };

  // Generate PPTX
  const handleGeneratePptx = async () => {
    if (draft.slides.length === 0) {
      showToastNotification("warning", "No slides to export");
      return;
    }
    try {
      const pptx = new PptxGenJS();
      await pptxHelper.createPptx(pptx, draft.slides);
      const safeName = (draft.serial_number || "Media_Plan").replace(/[^a-zA-Z0-9_-]/g, "_");
      await pptx.writeFile(`${safeName}.pptx`);
      showToastNotification("success", "Presentation exported successfully");
    } catch (err) {
      showToastNotification("error", `Failed to create PPTX: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p className="text-base font-semibold">Loading Customer Plan...</p>
      </div>
    );
  }

  const existingSlideIds = (draft.slides || []).map((s) => s.slide_id);

  return (
    <section className="page-section surface-grid space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title={id ? `Edit Plan: ${draft.serial_number || "Plan"}` : "Create Customer Media Plan"}
        meta={`Serial No: ${draft.serial_number || "Auto-generating..."}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="ui-btn"
              onClick={() => navigate("/customer-plans/list")}
            >
              <ChevronLeftIcon fontSize="small" /> Back to Plans
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={() => setIsSlidePickerOpen(true)}
            >
              <AddIcon fontSize="small" /> Add Slides
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={handleGeneratePptx}
              disabled={draft.slides.length === 0}
            >
              <SlidesIcon fontSize="small" /> PPTX
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={handleDownloadExcel}
              disabled={draft.slides.length === 0}
              title="Download exact Excel format with blue header"
            >
              <DownloadIcon fontSize="small" /> Download Excel
            </button>
            <button
              type="button"
              className="ui-btn ui-btn--primary"
              onClick={handleSavePlan}
              disabled={saving}
            >
              {saving ? "Saving..." : id ? "Update Plan" : "Save Plan"}
            </button>
          </div>
        }
      />

      {/* ── Metadata & Client Selection Bar ── */}
      <div className="p-5 rounded-2xl border border-border-soft bg-bg-surface shadow-soft grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Client Selection */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
            Select Client (Party) *
          </label>
          <select
            value={draft.client_id || ""}
            onChange={handleClientChange}
            className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
          >
            <option value="">-- Choose Client / Party --</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.partyType ? `(${c.partyType})` : ""} {c.city ? `- ${c.city}` : ""}
              </option>
            ))}
          </select>
          {draft.client_details?.contactPerson && (
            <p className="text-[11px] text-text-muted mt-1 truncate">
              Contact: {draft.client_details.contactPerson}{" "}
              {draft.client_details.phoneNo ? `· ${draft.client_details.phoneNo}` : ""}{" "}
              {draft.client_details.email ? `· ${draft.client_details.email}` : ""}
            </p>
          )}
        </div>

        {/* Unique Serial Number */}
        <div>
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
            Unique Serial Number
          </label>
          <input
            type="text"
            value={draft.serial_number || ""}
            onChange={(e) =>
              dispatch(setDraftMetadata({ field: "serial_number", value: e.target.value }))
            }
            placeholder="e.g. MP-1001"
            className="w-full h-10 px-3 text-xs font-mono font-bold rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
          />
        </div>

        {/* Plan Date & Status */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
              Plan Date
            </label>
            <input
              type="date"
              value={draft.plan_date || ""}
              onChange={(e) =>
                dispatch(setDraftMetadata({ field: "plan_date", value: e.target.value }))
              }
              className="w-full h-10 px-2 text-xs rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={draft.planStatus || "Draft"}
              onChange={(e) =>
                dispatch(setDraftMetadata({ field: "planStatus", value: e.target.value }))
              }
              className="w-full h-10 px-2 text-xs font-semibold rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
            >
              {PLAN_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── THE ABMS OUTDOOR MEDIA PLAN TABLE (Exact Specification Format) ── */}
      <div className="plan-table-container">
        {/* Banner Title */}
        <div className="plan-banner-header">
          {draft.title || `ABMS Outdoor Media Plan for ${draft.client_name || "Client"}`}
        </div>

        <table className="plan-grid-table">
          <thead>
            <tr>
              <th style={{ width: "4%" }}>Sr. #</th>
              <th style={{ width: "9%" }}>City</th>
              <th style={{ width: "17%" }}>Location</th>
              <th style={{ width: "6%" }}>W<br/>(Feet)</th>
              <th style={{ width: "6%" }}>H<br/>(Feet)</th>
              <th style={{ width: "6%" }}>Sqft.</th>
              <th style={{ width: "10%" }}>Quoting Monthly Rent</th>
              <th style={{ width: "10%" }}>Discounted Monthly Rent</th>
              <th style={{ width: "9%" }}>30 Days Rent</th>
              <th style={{ width: "8%" }}>Skin Cost</th>
              <th style={{ width: "9%" }}>Grand Total</th>
              <th style={{ width: "8%" }}>Status</th>
              <th style={{ width: "3%" }}></th>
            </tr>
          </thead>
          <tbody>
            {draft.slides.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-text-muted">
                  <p className="text-sm font-semibold mb-1">No slides added yet</p>
                  <p className="text-xs mb-3">
                    Click &quot;Add Slides&quot; to pick from inventory or select slides from the Slides page.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSlidePickerOpen(true)}
                    className="ui-btn ui-btn--primary text-xs"
                  >
                    <AddIcon fontSize="small" /> Add Slides from Inventory
                  </button>
                </td>
              </tr>
            ) : (
              draft.slides.map((item, index) => {
                const sqft = (Number(item.width_feets) || 0) * (Number(item.height_feets) || 0);
                const grandTotal = (Number(item.thirtyDaysRent) || 0) + (Number(item.skinCost) || 0);

                return (
                  <tr key={item.slide_id || index}>
                    {/* 1. Sr. # */}
                    <td className="text-center font-bold text-text-secondary">
                      {index + 1}
                    </td>

                    {/* 2. City */}
                    <td>
                      <input
                        type="text"
                        value={item.city || ""}
                        onChange={(e) => handleRowChange(index, "city", e.target.value)}
                        className="plan-table-input text-center font-medium"
                      />
                    </td>

                    {/* 3. Location */}
                    <td>
                      <input
                        type="text"
                        value={item.location || ""}
                        onChange={(e) => handleRowChange(index, "location", e.target.value)}
                        className="plan-table-input"
                        title={item.location}
                      />
                    </td>

                    {/* 4. W (Feet) */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.width_feets ?? ""}
                        onChange={(e) => handleRowChange(index, "width_feets", e.target.value)}
                        className="plan-table-input num-right"
                      />
                    </td>

                    {/* 5. H (Feet) */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.height_feets ?? ""}
                        onChange={(e) => handleRowChange(index, "height_feets", e.target.value)}
                        className="plan-table-input num-right"
                      />
                    </td>

                    {/* 6. Sqft (Auto calculated: W * H) */}
                    <td className="text-right font-mono font-medium text-text-primary px-2">
                      {Math.round(sqft).toLocaleString("en-US")}
                    </td>

                    {/* 7. Quoting Monthly Rent */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.quotingMonthlyRent ?? ""}
                        onChange={(e) => handleRowChange(index, "quotingMonthlyRent", e.target.value)}
                        className="plan-table-input num-right font-medium"
                      />
                    </td>

                    {/* 8. Discounted Monthly Rent */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.discountedMonthlyRent ?? ""}
                        onChange={(e) => handleRowChange(index, "discountedMonthlyRent", e.target.value)}
                        className="plan-table-input num-right font-medium"
                      />
                    </td>

                    {/* 9. 30 Days Rent */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.thirtyDaysRent ?? ""}
                        onChange={(e) => handleRowChange(index, "thirtyDaysRent", e.target.value)}
                        className="plan-table-input num-right font-medium"
                      />
                    </td>

                    {/* 10. Skin Cost */}
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.skinCost ?? ""}
                        onChange={(e) => handleRowChange(index, "skinCost", e.target.value)}
                        className="plan-table-input num-right"
                      />
                    </td>

                    {/* 11. Grand Total (Automatically updated: 30 Days Rent + Skin Cost) */}
                    <td className="text-right font-mono font-bold text-brand px-2 bg-brand-muted/10">
                      {Math.round(grandTotal).toLocaleString("en-US")}
                    </td>

                    {/* 12. Status */}
                    <td>
                      <select
                        value={item.status || "Available"}
                        onChange={(e) => handleRowChange(index, "status", e.target.value)}
                        className="plan-table-select"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action */}
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(item.slide_id)}
                        className="p-1 rounded text-text-muted hover:text-danger hover:bg-red-500/10 transition-colors"
                        title="Remove slide from plan"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}

            {/* ── TOTALS FOOTER ROW ── */}
            {draft.slides.length > 0 && (
              <tr className="plan-totals-row">
                <td colSpan={3} className="text-right pr-4 uppercase tracking-wider font-bold">
                  Total
                </td>
                <td className="text-right font-mono"></td>
                <td className="text-right font-mono"></td>
                <td className="text-right font-mono font-bold px-2">
                  {Math.round(totals.totalSqft).toLocaleString("en-US")}
                </td>
                <td className="text-right font-mono font-bold px-2">
                  {Math.round(totals.totalQuoting).toLocaleString("en-US")}
                </td>
                <td className="text-right font-mono font-bold px-2">
                  {Math.round(totals.totalDiscounted).toLocaleString("en-US")}
                </td>
                <td className="text-right font-mono font-bold px-2">
                  {Math.round(totals.totalThirtyDays).toLocaleString("en-US")}
                </td>
                <td className="text-right font-mono font-bold px-2">
                  {Math.round(totals.totalSkin).toLocaleString("en-US")}
                </td>
                <td className="text-right font-mono font-extrabold text-brand px-2 bg-brand-muted/20 text-sm">
                  {Math.round(totals.grandTotal).toLocaleString("en-US")}
                </td>
                <td colSpan={2}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── BOTTOM SECTION: Requirements in PPT ── */}
      <div className="flex flex-wrap items-start justify-between gap-6 pt-2">
        <div className="ppt-requirements-card shadow-sm">
          <div className="ppt-requirements-header">
            Requirements in ppt
          </div>
          {(draft.notes || []).map((note, idx) => (
            <div key={idx} className="ppt-requirements-item">
              {note}
            </div>
          ))}
        </div>

        {/* Plan Summary Card */}
        <div className="flex flex-col gap-2 p-5 rounded-2xl border border-border-soft bg-bg-surface min-w-[280px]">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Plan Summary
          </span>
          <div className="flex items-center justify-between text-xs text-text-secondary py-1 border-b border-border-soft">
            <span>Total Billboard Sites:</span>
            <span className="font-bold text-text-primary">{draft.slides.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary py-1 border-b border-border-soft">
            <span>Total Square Feet:</span>
            <span className="font-bold font-mono text-text-primary">
              {Math.round(totals.totalSqft).toLocaleString("en-US")} sqft
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary py-1 border-b border-border-soft">
            <span>30 Days Total Rent:</span>
            <span className="font-bold font-mono text-text-primary">
              {formatAmount(totals.totalThirtyDays)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary py-1 border-b border-border-soft">
            <span>Total Skin Cost:</span>
            <span className="font-bold font-mono text-text-primary">
              {formatAmount(totals.totalSkin)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <span className="font-bold text-text-primary">Grand Total:</span>
            <span className="font-extrabold font-mono text-brand text-base">
              {formatAmount(totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Slide Picker Modal */}
      <SlidePickerModal
        isOpen={isSlidePickerOpen}
        onClose={() => setIsSlidePickerOpen(false)}
        onAddSlides={handleAddSlidesFromPicker}
        existingSlideIds={existingSlideIds}
      />
    </section>
  );
};

export default CustomerPlanEditor;
