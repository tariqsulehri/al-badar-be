import { AL_BADAR_LOGO_BASE64 } from "./alBadarLogo";

/**
 * Normalizes image URL to avoid cross-origin / localhost discrepancies
 * between development and production environments.
 */
function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:")) return trimmed;

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    if (trimmed.startsWith("/")) {
      return `${origin}${trimmed}`;
    }
    const uploadsIdx = trimmed.indexOf("/uploads/");
    if (uploadsIdx !== -1) {
      return `${origin}${trimmed.substring(uploadsIdx)}`;
    }
  }
  return trimmed;
}

/**
 * Safely fetches image and converts to base64 data URI in browser environment.
 * Gracefully returns null if image is missing, corrupt, or unreachable.
 */
async function fetchImageAsDataUri(url) {
  if (!url) return null;
  if (url.startsWith("data:")) return url;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch slide image (status ${res.status}): ${url}`);
      return null;
    }
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`Error loading slide image at ${url}:`, err);
    return null;
  }
}

/**
 * Derives location title from MongoDB slide record fields or CustomerPlan fields.
 */
function getLocationHeader(slide) {
  if (slide.location && typeof slide.location === "string" && slide.location.trim()) {
    return slide.location.trim();
  }
  const area = (slide.area || "").trim();
  const subArea = (slide.subArea || "").trim();
  const locFrom = (slide.location_from || "").trim();

  if (area && subArea && area.toLowerCase() !== subArea.toLowerCase()) {
    return `${area}\n${subArea}`;
  }
  return locFrom || area || subArea || "";
}

/**
 * Formats traffic facing direction from slide record.
 */
function getFacingText(slide) {
  const facing = (slide.trafic_facing_coming || "").trim();
  if (!facing) return "";
  if (facing.toLowerCase().startsWith("facing")) {
    return facing;
  }
  return `Facing ${facing}`;
}

const pptxHelper = {
  createPptx: async function (pptx, records) {
    if (!records || records.length === 0) {
      return;
    }

    // Set 16:9 widescreen presentation layout (10.0 x 5.625 in)
    pptx.layout = "LAYOUT_16x9";
    pptx.title = "Al-Badar Media Solutions - Inventory Presentation";
    pptx.author = "Al-Badar Media Solutions";
    pptx.company = "Al-Badar Media Solutions";

    const logoDataUri = AL_BADAR_LOGO_BASE64.startsWith("data:")
      ? AL_BADAR_LOGO_BASE64
      : `data:${AL_BADAR_LOGO_BASE64}`;

    // Colors matching reference template
    const COLOR_HEADER_FILL = "ADCDE6"; // Light sky-blue for City and Table labels
    const COLOR_PRIMARY_NAVY = "0A3370"; // Dark blue text for headers, labels, values
    const COLOR_FOOTER_NAVY = "084B8A"; // Vibrant dark blue for the bottom status bar

    // Clean sans-serif corporate font (avoids pixelated/jagged rendering on screens)
    const FONT_PRIMARY = "Calibri";
    const FONT_FOOTER = "Calibri";

    for (const slideData of records) {
      const slide = pptx.addSlide();

      // Clean white background
      slide.background = { color: "FFFFFF" };

      // 1. City Header Box (e.g. Multan, Islamabad) with light blue fill
      const cityText = (slideData.city || "").trim();
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.15,
        y: 0.18,
        w: 2.45,
        h: 0.65,
        fill: { color: COLOR_HEADER_FILL },
        line: { color: "9BBFD8", width: 1 },
      });
      slide.addText(cityText, {
        x: 0.15,
        y: 0.18,
        w: 2.45,
        h: 0.65,
        align: "center",
        valign: "middle",
        fontFace: FONT_PRIMARY,
        fontSize: 22,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
      });

      // 2. Location / Area Header
      const locationText = getLocationHeader(slideData);
      slide.addText(locationText, {
        x: 0.15,
        y: 0.88,
        w: 2.45,
        h: 0.70,
        align: "center",
        valign: "middle",
        fontFace: FONT_PRIMARY,
        fontSize: 13.5,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
      });

      // 3. Traffic Facing Subtitle
      const facingText = getFacingText(slideData);
      if (facingText) {
        slide.addText(facingText, {
          x: 0.15,
          y: 1.58,
          w: 2.45,
          h: 0.40,
          align: "center",
          valign: "middle",
          fontFace: FONT_PRIMARY,
          fontSize: 9,
          color: COLOR_PRIMARY_NAVY,
        });
      }

      // 4. Details Table (4 rows: Code, Size, Per Month Rent, Status)
      const codeVal = slideData.code || "";
      const widthVal = slideData.width_feets != null ? Math.round(Number(slideData.width_feets) || 0) : null;
      const heightVal = slideData.height_feets != null ? Math.round(Number(slideData.height_feets) || 0) : null;
      const sizeVal =
        widthVal && heightVal
          ? `${widthVal} x ${heightVal}`
          : slideData.dimension || "-";

      const rawPrice =
        slideData.quotingMonthlyRent ??
        slideData.quoting_monthly_rent ??
        slideData.discountedMonthlyRent ??
        slideData.discounted_monthly_rent ??
        slideData.thirtyDaysRent ??
        slideData.finalPrice ??
        slideData.quotedPrice;

      // Always display rent amounts without decimals (rounded to nearest whole rupee)
      const rentFormatted =
        rawPrice !== undefined && rawPrice !== null && rawPrice !== "" && !isNaN(Number(rawPrice))
          ? Math.round(Number(rawPrice)).toLocaleString("en-US")
          : (rawPrice || "N/A");

      const statusVal = slideData.status || "Available";

      const labelCellOpts = {
        fontFace: FONT_PRIMARY,
        fontSize: 10.5,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
        align: "center",
        valign: "middle",
        fill: { color: COLOR_HEADER_FILL },
        border: [
          { pt: 1, color: "FFFFFF" },
          { pt: 1, color: "FFFFFF" },
          { pt: 1, color: "FFFFFF" },
          { pt: 1, color: "FFFFFF" },
        ],
      };

      const valueCellOpts = {
        fontFace: FONT_PRIMARY,
        fontSize: 10.5,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
        align: "center",
        valign: "middle",
        fill: { color: "FFFFFF" },
        border: [
          { pt: 1, color: COLOR_HEADER_FILL },
          { pt: 1, color: COLOR_HEADER_FILL },
          { pt: 1, color: COLOR_HEADER_FILL },
          { pt: 1, color: COLOR_HEADER_FILL },
        ],
      };

      const tableRows = [
        [
          { text: "Code", options: labelCellOpts },
          { text: codeVal, options: valueCellOpts },
        ],
        [
          { text: "Size", options: labelCellOpts },
          { text: sizeVal, options: valueCellOpts },
        ],
        [
          { text: "Per Month\nRent", options: labelCellOpts },
          { text: rentFormatted, options: valueCellOpts },
        ],
        [
          { text: "Status", options: labelCellOpts },
          { text: statusVal, options: valueCellOpts },
        ],
      ];

      slide.addTable(tableRows, {
        x: 0.15,
        y: 2.02,
        w: 2.45,
        colW: [1.22, 1.23],
        rowH: [0.46, 0.46, 0.54, 0.46],
      });

      // 5. Static Al-Badar Media Solutions Logo (same on every slide)
      slide.addImage({
        data: logoDataUri,
        x: 0.58,
        y: 4.08,
        w: 1.58,
        h: 0.95,
      });

      // 6. Right Panel: Dynamic billboard photo from MongoDB
      const rawImageUrl = slideData.image;
      const normalizedImageUrl = normalizeImageUrl(rawImageUrl);

      let imageEmbedded = false;
      if (normalizedImageUrl) {
        try {
          const imgBase64 = await fetchImageAsDataUri(normalizedImageUrl);
          if (imgBase64) {
            slide.addImage({
              data: imgBase64,
              x: 2.72,
              y: 0.18,
              w: 7.10,
              h: 4.88,
            });
            imageEmbedded = true;
          }
        } catch (imgError) {
          console.warn("Failed to embed slide image:", imgError);
        }
      }

      // Fallback placeholder if image is missing or cannot be loaded
      if (!imageEmbedded) {
        slide.addShape(pptx.shapes.RECTANGLE, {
          x: 2.72,
          y: 0.18,
          w: 7.10,
          h: 4.88,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5E1", width: 1, dashType: "dash" },
        });
        slide.addText("Image Not Available", {
          x: 2.72,
          y: 2.37,
          w: 7.10,
          h: 0.50,
          align: "center",
          valign: "middle",
          fontFace: FONT_PRIMARY,
          fontSize: 14,
          color: "94A3B8",
        });
      }

      // 7. Full-width static status bar at the bottom
      // Background bar spanning entire slide width safely positioned
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.0,
        y: 5.15,
        w: 10.0,
        h: 0.475,
        fill: { color: COLOR_FOOTER_NAVY },
        line: { color: COLOR_FOOTER_NAVY, width: 0 },
      });

      // Explicit native text blocks with crisp, proper font (Calibri bold)
      // Left: Muhammad Faisal
      slide.addText("Muhammad Faisal", {
        x: 0.35,
        y: 5.18,
        w: 2.8,
        h: 0.40,
        fontFace: FONT_FOOTER,
        fontSize: 11,
        bold: true,
        color: "FFFFFF",
        align: "left",
        valign: "middle",
      });

      // Center: Cell #  0333-4732769
      slide.addText("Cell #  0333-4732769", {
        x: 3.2,
        y: 5.18,
        w: 3.6,
        h: 0.40,
        fontFace: FONT_FOOTER,
        fontSize: 11,
        bold: true,
        color: "FFFFFF",
        align: "center",
        valign: "middle",
      });

      // Right: E-mail: faisal.albadarmediasoluions@gmail.com
      slide.addText("E-mail: faisal.albadarmediasoluions@gmail.com", {
        x: 6.8,
        y: 5.18,
        w: 2.9,
        h: 0.40,
        fontFace: FONT_FOOTER,
        fontSize: 10,
        bold: true,
        color: "FFFFFF",
        align: "right",
        valign: "middle",
      });
    }
  },
};

export default pptxHelper;

