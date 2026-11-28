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
 * Derives single-line location title from MongoDB slide record or CustomerPlan fields.
 */
function getLocationHeader(slide) {
  if (slide.location && typeof slide.location === "string" && slide.location.trim()) {
    return slide.location.replace(/\s*\n\s*/g, " ").trim();
  }
  const area = (slide.area || "").trim();
  const subArea = (slide.subArea || "").trim();
  const locFrom = (slide.location_from || "").trim();

  if (area && subArea && area.toLowerCase() !== subArea.toLowerCase()) {
    return `${area} ${subArea}`;
  }
  return locFrom || area || subArea || "";
}

/**
 * Extracts traffic facing description without duplicating the "Facing:" label.
 */
function getFacingValue(slide) {
  const facing = (slide.trafic_facing_coming || "").trim();
  if (!facing) return "-";
  return facing.replace(/^facing\s*:?\s*/i, "").trim() || "-";
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

    // Exact colors and typography matching reference format
    const COLOR_BLUE_BAR = "0071C1";
    const COLOR_YELLOW_TEXT = "FFFF00";
    const COLOR_GRAY_BAR = "D8D8D8";
    const COLOR_DARK_TEXT = "0F0F0F";
    const FONT_NAME = "Times New Roman";

    // Layout geometry (10.0 x 5.625 in)
    const SLIDE_WIDTH = 10.0;
    const SLIDE_HEIGHT = 5.625;
    const LOGO_W = 1.80;
    const FOOTER_Y = 4.86;
    const ROW1_H = 0.36;
    const ROW2_H = SLIDE_HEIGHT - FOOTER_Y - ROW1_H; // 0.405
    const FOOTER_TOTAL_H = ROW1_H + ROW2_H; // 0.765
    const IMAGE_H = 4.84; // Remaining area above bottom bar with crisp hairline gap

    const whiteCellBorder = [
      { pt: 1, color: "FFFFFF" },
      { pt: 1, color: "FFFFFF" },
      { pt: 1, color: "FFFFFF" },
      { pt: 1, color: "FFFFFF" },
    ];

    for (const slideData of records) {
      const slide = pptx.addSlide();

      // Clean white background
      slide.background = { color: "FFFFFF" };

      // 1. Top Main Area: Dynamic billboard photo from MongoDB (full width, max remaining area)
      const rawImageUrl = slideData.image;
      const normalizedImageUrl = normalizeImageUrl(rawImageUrl);

      let imageEmbedded = false;
      if (normalizedImageUrl) {
        try {
          const imgBase64 = await fetchImageAsDataUri(normalizedImageUrl);
          if (imgBase64) {
            slide.addImage({
              data: imgBase64,
              x: 0.0,
              y: 0.0,
              w: SLIDE_WIDTH,
              h: IMAGE_H,
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
          x: 0.0,
          y: 0.0,
          w: SLIDE_WIDTH,
          h: IMAGE_H,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5E1", width: 1, dashType: "dash" },
        });
        slide.addText("Image Not Available", {
          x: 0.0,
          y: IMAGE_H / 2 - 0.25,
          w: SLIDE_WIDTH,
          h: 0.50,
          align: "center",
          valign: "middle",
          fontFace: FONT_NAME,
          fontSize: 16,
          color: "94A3B8",
        });
      }

      // 2. Bottom-Left Static Logo Box (spans both footer rows)
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.0,
        y: FOOTER_Y,
        w: LOGO_W,
        h: FOOTER_TOTAL_H,
        fill: { color: "FFFFFF" },
        line: { color: COLOR_BLUE_BAR, width: 0.75 },
      });
      slide.addImage({
        data: logoDataUri,
        x: 0.14,
        y: FOOTER_Y + 0.04,
        w: LOGO_W - 0.28,
        h: FOOTER_TOTAL_H - 0.08,
      });

      // 3. Bottom Row 1 (Blue Bar): City (Yellow) | Location (White)
      const cityText = (slideData.city || "").trim();
      const locationText = getLocationHeader(slideData);

      slide.addTable(
        [
          [
            {
              text: cityText,
              options: {
                fontFace: FONT_NAME,
                fontSize: 14,
                bold: true,
                color: COLOR_YELLOW_TEXT,
                fill: { color: COLOR_BLUE_BAR },
                align: "center",
                valign: "middle",
                border: whiteCellBorder,
              },
            },
            {
              text: locationText,
              options: {
                fontFace: FONT_NAME,
                fontSize: 14,
                bold: true,
                color: "FFFFFF",
                fill: { color: COLOR_BLUE_BAR },
                align: "center",
                valign: "middle",
                border: whiteCellBorder,
              },
            },
          ],
        ],
        {
          x: LOGO_W,
          y: FOOTER_Y,
          w: SLIDE_WIDTH - LOGO_W, // 8.20 in
          colW: [2.00, 6.20],
          rowH: [ROW1_H],
          margin: [0, 0.05, 0, 0.05],
        }
      );

      // 4. Bottom Row 2 (Light Gray Bar): Facing | Size | Rent | Status | Code
      const facingValue = getFacingValue(slideData);
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

      const rentFormatted =
        rawPrice !== undefined && rawPrice !== null && rawPrice !== "" && !isNaN(Number(rawPrice))
          ? Math.round(Number(rawPrice)).toLocaleString("en-US")
          : (rawPrice || "N/A");

      const statusVal = slideData.status || "Available";
      const codeVal = slideData.code || "-";

      const buildDetailCell = (label, value) => ({
        text: [
          { text: `${label}\n`, options: { fontSize: 9.5, bold: true, color: COLOR_DARK_TEXT } },
          { text: String(value), options: { fontSize: 10, bold: true, color: COLOR_DARK_TEXT } },
        ],
        options: {
          fontFace: FONT_NAME,
          fill: { color: COLOR_GRAY_BAR },
          align: "center",
          valign: "middle",
          border: whiteCellBorder,
        },
      });

      slide.addTable(
        [
          [
            buildDetailCell("Facing:", facingValue),
            buildDetailCell("Size:", sizeVal),
            buildDetailCell("Rent:", rentFormatted),
            buildDetailCell("Status", statusVal),
            buildDetailCell("Code", codeVal),
          ],
        ],
        {
          x: LOGO_W,
          y: FOOTER_Y + ROW1_H,
          w: SLIDE_WIDTH - LOGO_W, // 8.20 in
          colW: [3.51, 1.23, 1.26, 1.16, 1.04],
          rowH: [ROW2_H],
          margin: [0.02, 0.04, 0.02, 0.04],
        }
      );
    }
  },
};

export default pptxHelper;
