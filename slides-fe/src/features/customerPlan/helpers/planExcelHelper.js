import ExcelJS from "exceljs/dist/exceljs.min.js";

/**
 * Generates and downloads an Excel file exactly matching the layout and styling
 * of the ABMS Outdoor Media Plan format shown in the specification image.
 */
export const exportPlanToExcel = async (plan) => {
  if (!plan) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ABMS Slides Management System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Media Plan", {
    views: [{ showGridLines: true }],
  });

  const clientName = plan.client_name || "Client";
  const titleText = `ABMS Outdoor Media Plan for ${clientName}`;
  const slides = plan.slides || [];

  // Define column properties
  worksheet.columns = [
    { key: "sr_no", width: 8 }, // A
    { key: "city", width: 16 }, // B
    { key: "location", width: 34 }, // C
    { key: "width_feets", width: 12 }, // D
    { key: "height_feets", width: 12 }, // E
    { key: "sqft", width: 14 }, // F
    { key: "quotingMonthlyRent", width: 22 }, // G
    { key: "discountedMonthlyRent", width: 24 }, // H
    { key: "thirtyDaysRent", width: 18 }, // I
    { key: "skinCost", width: 16 }, // J
    { key: "grandTotal", width: 20 }, // K
    { key: "status", width: 16 }, // L
  ];

  // Border styles
  const thinBorder = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  const doubleBottomBorder = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "double", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  // ── ROW 1: Banner Header ───────────────────────────────────────────
  worksheet.mergeCells("A1:L1");
  const bannerCell = worksheet.getCell("A1");
  bannerCell.value = titleText;
  bannerCell.font = { name: "Arial", size: 15, bold: true, color: { argb: "FFFFFFFF" } };
  bannerCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0066B2" }, // Royal blue matching image
  };
  bannerCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 36;

  // ── ROW 2: Column Headers ──────────────────────────────────────────
  const headers = [
    "Sr. #",
    "City",
    "Location",
    "W\n(Feet)",
    "H\n(Feet)",
    "Sqft.",
    "Quoting Monthly Rent",
    "Discounted\nMonthly Rent",
    "30 Days Rent",
    "Skin Cost",
    "Grand Total",
    "Status",
  ];

  const headerRow = worksheet.getRow(2);
  headerRow.height = 32;

  headers.forEach((header, idx) => {
    const colNumber = idx + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = header;
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8EB4E3" }, // Soft blue header fill matching image
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = thinBorder;
  });

  // ── DATA ROWS ──────────────────────────────────────────────────────
  let currentRowIdx = 3;

  slides.forEach((item, index) => {
    const row = worksheet.getRow(currentRowIdx);
    row.height = 24;

    const width = Number(item.width_feets) || 0;
    const height = Number(item.height_feets) || 0;
    const sqft = width * height;
    const quotingRent = Number(item.quotingMonthlyRent) || 0;
    const discountedRent = Number(item.discountedMonthlyRent) || 0;
    const thirtyDaysRent = Number(item.thirtyDaysRent) || 0;
    const skinCost = Number(item.skinCost) || 0;
    const grandTotal = thirtyDaysRent + skinCost;

    row.getCell(1).value = index + 1;
    row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

    row.getCell(2).value = item.city || "";
    row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };

    row.getCell(3).value = item.location || item.code || "";
    row.getCell(3).alignment = { vertical: "middle", horizontal: "left" };

    row.getCell(4).value = width;
    row.getCell(4).numFmt = "#,##0";
    row.getCell(4).alignment = { vertical: "middle", horizontal: "center" };

    row.getCell(5).value = height;
    row.getCell(5).numFmt = "#,##0";
    row.getCell(5).alignment = { vertical: "middle", horizontal: "center" };

    row.getCell(6).value = sqft;
    row.getCell(6).numFmt = "#,##0";
    row.getCell(6).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(7).value = quotingRent;
    row.getCell(7).numFmt = "#,##0";
    row.getCell(7).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(8).value = discountedRent;
    row.getCell(8).numFmt = "#,##0";
    row.getCell(8).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(9).value = thirtyDaysRent;
    row.getCell(9).numFmt = "#,##0";
    row.getCell(9).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(10).value = skinCost;
    row.getCell(10).numFmt = "#,##0";
    row.getCell(10).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(11).value = grandTotal;
    row.getCell(11).numFmt = "#,##0";
    row.getCell(11).alignment = { vertical: "middle", horizontal: "right" };

    row.getCell(12).value = item.status || "Available";
    row.getCell(12).alignment = { vertical: "middle", horizontal: "center" };

    // Apply borders and font to all 12 cells in this row
    for (let c = 1; c <= 12; c++) {
      const cell = row.getCell(c);
      cell.font = { name: "Arial", size: 9.5 };
      cell.border = thinBorder;
    }

    currentRowIdx++;
  });

  // If no slides, add one empty row placeholder
  if (slides.length === 0) {
    const emptyRow = worksheet.getRow(currentRowIdx);
    emptyRow.height = 24;
    for (let c = 1; c <= 12; c++) {
      const cell = emptyRow.getCell(c);
      cell.border = thinBorder;
    }
    currentRowIdx++;
  }

  // ── TOTALS ROW ─────────────────────────────────────────────────────
  worksheet.mergeCells(`A${currentRowIdx}:E${currentRowIdx}`);
  const totalLabelCell = worksheet.getCell(`A${currentRowIdx}`);
  totalLabelCell.value = "Grand Total";
  totalLabelCell.font = { name: "Arial", size: 10, bold: true };
  totalLabelCell.alignment = { vertical: "middle", horizontal: "right" };

  const totalRow = worksheet.getRow(currentRowIdx);
  totalRow.height = 26;

  // Calculated totals
  const totalSqft = slides.reduce((acc, s) => acc + (Number(s.width_feets) || 0) * (Number(s.height_feets) || 0), 0);
  const totalQuoting = slides.reduce((acc, s) => acc + (Number(s.quotingMonthlyRent) || 0), 0);
  const totalDiscounted = slides.reduce((acc, s) => acc + (Number(s.discountedMonthlyRent) || 0), 0);
  const totalThirtyDays = slides.reduce((acc, s) => acc + (Number(s.thirtyDaysRent) || 0), 0);
  const totalSkin = slides.reduce((acc, s) => acc + (Number(s.skinCost) || 0), 0);
  const grandTotalAll = slides.reduce(
    (acc, s) => acc + (Number(s.thirtyDaysRent) || 0) + (Number(s.skinCost) || 0),
    0
  );

  totalRow.getCell(6).value = totalSqft;
  totalRow.getCell(7).value = totalQuoting;
  totalRow.getCell(8).value = totalDiscounted;
  totalRow.getCell(9).value = totalThirtyDays;
  totalRow.getCell(10).value = totalSkin;
  totalRow.getCell(11).value = grandTotalAll;

  [6, 7, 8, 9, 10, 11].forEach((col) => {
    const cell = totalRow.getCell(col);
    cell.numFmt = "#,##0";
    cell.alignment = { vertical: "middle", horizontal: "right" };
    cell.font = { name: "Arial", size: 10, bold: true };
  });

  for (let c = 1; c <= 12; c++) {
    const cell = totalRow.getCell(c);
    cell.border = doubleBottomBorder;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0F4F8" },
    };
  }

  currentRowIdx += 2; // Blank spacing row

  // ── REQUIREMENTS IN PPT SECTION (Bottom Left Box) ──────────────────
  const noteHeaderRow = worksheet.getRow(currentRowIdx);
  worksheet.mergeCells(`A${currentRowIdx}:D${currentRowIdx}`);
  const noteHeaderCell = noteHeaderRow.getCell(1);
  noteHeaderCell.value = "Requirements in ppt";
  noteHeaderCell.font = { name: "Arial", size: 10, bold: true };
  noteHeaderCell.alignment = { vertical: "middle", horizontal: "center" };
  noteHeaderCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE2EFDA" },
  };
  noteHeaderCell.border = thinBorder;
  for (let c = 2; c <= 4; c++) noteHeaderRow.getCell(c).border = thinBorder;
  currentRowIdx++;

  const notes =
    Array.isArray(plan.notes) && plan.notes.length > 0
      ? plan.notes
      : [
          "Rates and Availability should be mentioned in ppt",
          "Rates will be Change when we make the ppt",
          "Availability will be Change when we make the ppt",
        ];

  notes.forEach((noteText) => {
    const noteRow = worksheet.getRow(currentRowIdx);
    worksheet.mergeCells(`A${currentRowIdx}:D${currentRowIdx}`);
    const noteCell = noteRow.getCell(1);
    noteCell.value = noteText;
    noteCell.font = { name: "Arial", size: 9 };
    noteCell.alignment = { vertical: "middle", horizontal: "left" };
    noteCell.border = thinBorder;
    for (let c = 2; c <= 4; c++) noteRow.getCell(c).border = thinBorder;
    currentRowIdx++;
  });

  // Write to buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const safeSerial = (plan.serial_number || "Plan").replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeClient = clientName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `ABMS_Media_Plan_${safeSerial}_${safeClient}.xlsx`;

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};
