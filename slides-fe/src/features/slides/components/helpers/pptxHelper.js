import { AL_BADAR_LOGO_BASE64 } from "./alBadarLogo";
import {
  DOTTED_BAR_BASE64,
  DOTTED_CITY_BASE64,
  DOTTED_SIDEBAR_BG_BASE64,
} from "./pptxPatterns";

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
    const COLOR_HEADER_FILL = "9BC5E8"; // Light sky-blue for Table labels
    const COLOR_PRIMARY_NAVY = "0A3370"; // Dark blue text for headers, labels, values

    // Font: Calibri (Body) across the whole slide
    const FONT_NAME = "Calibri";

    // Slide Layout Constants
    const SLIDE_HEIGHT = 5.625;
    const BOTTOM_BAR_HEIGHT = 0.25;
    const BOTTOM_BAR_Y = SLIDE_HEIGHT - BOTTOM_BAR_HEIGHT; // 5.375
    const SIDEBAR_WIDTH = 2.50; // zero left margin

    for (const slideData of records) {
      const slide = pptx.addSlide();

      // Clean white background
      slide.background = { color: "FFFFFF" };

      // 1. Left Sidebar Dotted Background (beneath City header down to bottom bar)
      slide.addImage({
        data: DOTTED_SIDEBAR_BG_BASE64,
        x: 0.0,
        y: 0.70,
        w: SIDEBAR_WIDTH,
        h: BOTTOM_BAR_Y - 0.70,
      });

      // 2. City Header Box (x: 0, w: 2.50, h: 0.70) with dotted sky-blue fill style
      const cityText = (slideData.city || "").trim();
      slide.addImage({
        data: DOTTED_CITY_BASE64,
        x: 0.0,
        y: 0.0,
        w: SIDEBAR_WIDTH,
        h: 0.70,
      });
      slide.addText(cityText, {
        x: 0.0,
        y: 0.0,
        w: SIDEBAR_WIDTH,
        h: 0.70,
        align: "center",
        valign: "middle",
        fontFace: FONT_NAME,
        fontSize: 22,
        bold: true,
        color: "FFFFFF", // Crisp white text on sky-blue box
        shadow: {
          type: "outer",
          color: "1A4870",
          blur: 2,
          offset: 1,
          angle: 90,
          opacity: 0.35,
        },
      });

      // 3. Location / Area Header (no extra left margin)
      const locationText = getLocationHeader(slideData);
      slide.addText(locationText, {
        x: 0.08,
        y: 0.78,
        w: SIDEBAR_WIDTH - 0.16,
        h: 0.55,
        align: "center",
        valign: "middle",
        fontFace: FONT_NAME,
        fontSize: 13,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
      });

      // 4. Traffic Facing Subtitle
      const facingText = getFacingText(slideData);
      if (facingText) {
        slide.addText(facingText, {
          x: 0.08,
          y: 1.33,
          w: SIDEBAR_WIDTH - 0.16,
          h: 0.38,
          align: "center",
          valign: "middle",
          fontFace: FONT_NAME,
          fontSize: 8.5,
          color: COLOR_PRIMARY_NAVY,
        });
      }

      // 5. Details Table (4 rows: Code, Size, Rent / M, Status)
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

      // Always round to whole rupees (no decimals)
      const rentFormatted =
        rawPrice !== undefined && rawPrice !== null && rawPrice !== "" && !isNaN(Number(rawPrice))
          ? Math.round(Number(rawPrice)).toLocaleString("en-US")
          : (rawPrice || "N/A");

      const statusVal = slideData.status || "Available";

      const labelCellOpts = {
        fontFace: FONT_NAME,
        fontSize: 10,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
        align: "center",
        valign: "middle",
        fill: { color: COLOR_HEADER_FILL },
        border: [
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
        ],
      };

      const valueCellOpts = {
        fontFace: FONT_NAME,
        fontSize: 10,
        bold: true,
        color: COLOR_PRIMARY_NAVY,
        align: "center",
        valign: "middle",
        fill: { color: "FFFFFF" },
        border: [
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
          { pt: 1.5, color: "FFFFFF" },
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
          { text: "Rent / M", options: labelCellOpts },
          { text: rentFormatted, options: valueCellOpts },
        ],
        [
          { text: "Status", options: labelCellOpts },
          { text: statusVal, options: valueCellOpts },
        ],
      ];

      slide.addTable(tableRows, {
        x: 0.05,
        y: 1.78,
        w: SIDEBAR_WIDTH - 0.10,
        colW: [1.16, 1.24],
        rowH: [0.46, 0.46, 0.46, 0.46],
      });

      // 6. Static Al-Badar Media Solutions Logo (centered below table)
      slide.addImage({
        data: logoDataUri,
        x: 0.46,
        y: 3.90,
        w: 1.58,
        h: 0.95,
      });

      // 7. Right Panel: Dynamic billboard photo from MongoDB (Maximum Space)
      const rawImageUrl = slideData.image;
      const normalizedImageUrl = normalizeImageUrl(rawImageUrl);

      let imageEmbedded = false;
      if (normalizedImageUrl) {
        try {
          const imgBase64 = await fetchImageAsDataUri(normalizedImageUrl);
          if (imgBase64) {
            slide.addImage({
              data: imgBase64,
              x: SIDEBAR_WIDTH,
              y: 0.0,
              w: 10.0 - SIDEBAR_WIDTH, // 7.50 in (max space!)
              h: BOTTOM_BAR_Y,         // 5.375 in (all the way to bottom bar!)
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
          x: SIDEBAR_WIDTH,
          y: 0.0,
          w: 10.0 - SIDEBAR_WIDTH,
          h: BOTTOM_BAR_Y,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5E1", width: 1, dashType: "dash" },
        });
        slide.addText("Image Not Available", {
          x: SIDEBAR_WIDTH,
          y: 2.37,
          w: 10.0 - SIDEBAR_WIDTH,
          h: 0.50,
          align: "center",
          valign: "middle",
          fontFace: FONT_NAME,
          fontSize: 14,
          color: "94A3B8",
        });
      }

      // 8. Full-width static blue bar at the bottom with dotted fill style
      // Spanning the bottom line in the format, no text as requested
      slide.addImage({
        data: DOTTED_BAR_BASE64,
        x: 0.0,
        y: BOTTOM_BAR_Y,
        w: 10.0,
        h: BOTTOM_BAR_HEIGHT,
      });
    }
  },
};

export default pptxHelper;
