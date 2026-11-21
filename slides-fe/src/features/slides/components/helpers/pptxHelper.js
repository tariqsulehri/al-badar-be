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
 * Derives location title from MongoDB slide record fields.
 */
function getLocationHeader(slide) {
  const area = (slide.area || "").trim();
  const subArea = (slide.subArea || "").trim();
  const locFrom = (slide.location_from || "").trim();

  if (area && subArea && area.toLowerCase() !== subArea.toLowerCase()) {
    return `${area} ${subArea}`;
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

    // Set 16:9 widescreen presentation layout
    pptx.layout = "LAYOUT_16x9";
    pptx.title = "Al-Badar Media Solutions - Inventory Presentation";
    pptx.author = "Al-Badar Media Solutions";
    pptx.company = "Al-Badar Media Solutions";

    const logoDataUri = AL_BADAR_LOGO_BASE64.startsWith("data:")
      ? AL_BADAR_LOGO_BASE64
      : `data:${AL_BADAR_LOGO_BASE64}`;

    for (const slideData of records) {
      const slide = pptx.addSlide();

      // Clean white background
      slide.background = { color: "FFFFFF" };

      // 1. City Header (e.g. Multan, Islamabad)
      const cityText = (slideData.city || "").trim();
      slide.addText(cityText, {
        x: 0.15,
        y: 0.35,
        w: 2.45,
        h: 0.50,
        align: "center",
        valign: "middle",
        fontFace: "Georgia",
        fontSize: 24,
        bold: true,
        color: "0A3370",
      });

      // 2. Location / Area Header
      const locationText = getLocationHeader(slideData);
      slide.addText(locationText, {
        x: 0.15,
        y: 0.95,
        w: 2.45,
        h: 0.70,
        align: "center",
        valign: "middle",
        fontFace: "Georgia",
        fontSize: 14,
        bold: true,
        color: "0A3370",
      });

      // 3. Traffic Facing Subtitle
      const facingText = getFacingText(slideData);
      if (facingText) {
        slide.addText(facingText, {
          x: 0.15,
          y: 1.70,
          w: 2.45,
          h: 0.45,
          align: "center",
          valign: "middle",
          fontFace: "Georgia",
          fontSize: 9,
          color: "0A3370",
        });
      }

      // 4. Details Table (Clean & borderless matching reference format)
      const codeVal = slideData.code || "";
      const widthVal = slideData.width_feets ?? 0;
      const heightVal = slideData.height_feets ?? 0;
      const sizeVal = `${widthVal} x ${heightVal}`;
      const priceVal = slideData.finalPrice ?? slideData.quotedPrice;
      const rentFormatted =
        priceVal !== undefined && priceVal !== null && priceVal !== ""
          ? Number(priceVal).toLocaleString("en-US")
          : "N/A";
      const statusVal = slideData.status || "";

      const tableRows = [
        [
          {
            text: "Code",
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "left",
              valign: "middle",
            },
          },
          {
            text: codeVal,
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "right",
              valign: "middle",
            },
          },
        ],
        [
          {
            text: "Size",
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "left",
              valign: "middle",
            },
          },
          {
            text: sizeVal,
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "right",
              valign: "middle",
            },
          },
        ],
        [
          {
            text: "Per Month\nRent",
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "left",
              valign: "middle",
            },
          },
          {
            text: rentFormatted,
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "right",
              valign: "middle",
            },
          },
        ],
        [
          {
            text: "Status",
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "left",
              valign: "middle",
            },
          },
          {
            text: statusVal,
            options: {
              fontFace: "Georgia",
              fontSize: 10.5,
              color: "0A3370",
              align: "right",
              valign: "middle",
            },
          },
        ],
      ];

      slide.addTable(tableRows, {
        x: 0.20,
        y: 2.25,
        w: 2.40,
        rowH: [0.45, 0.45, 0.55, 0.45],
        border: { type: "none" },
        colW: [1.20, 1.20],
      });

      // 5. Static Al-Badar Media Solutions Logo (same on every slide)
      slide.addImage({
        data: logoDataUri,
        x: 0.60,
        y: 4.35,
        w: 1.55,
        h: 0.95,
      });

      // 6. Thin bottom horizontal navy accent line
      slide.addShape(pptx.shapes.LINE, {
        x: 0.0,
        y: 5.48,
        w: 10.0,
        h: 0,
        line: { color: "1A539B", width: 2 },
      });

      // 7. Right Panel: Dynamic billboard photo from MongoDB
      const rawImageUrl = slideData.image;
      const normalizedImageUrl = normalizeImageUrl(rawImageUrl);

      let imageEmbedded = false;
      if (normalizedImageUrl) {
        try {
          const imgBase64 = await fetchImageAsDataUri(normalizedImageUrl);
          if (imgBase64) {
            slide.addImage({
              data: imgBase64,
              x: 2.70,
              y: 0.08,
              w: 7.25,
              h: 5.35,
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
          x: 2.70,
          y: 0.08,
          w: 7.25,
          h: 5.35,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5E1", width: 1, dashType: "dash" },
        });
        slide.addText("Image Not Available", {
          x: 2.70,
          y: 2.45,
          w: 7.25,
          h: 0.50,
          align: "center",
          valign: "middle",
          fontFace: "Georgia",
          fontSize: 14,
          color: "94A3B8",
        });
      }
    }
  },
};

export default pptxHelper;
