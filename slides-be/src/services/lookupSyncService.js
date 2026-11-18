const { Provence } = require("../models/provence.model");
const { City } = require("../models/city.model");
const { Area } = require("../models/area.model");
const { SubArea } = require("../models/subArea.model");
const Party = require("../models/party.model");
const Slide = require("../models/slide.model");

const SUPPLIER_PARTY_TYPE = "Supplier";

/** Slide field -> lookup collection it feeds. */
const LOOKUPS = [
  { field: "provence", Model: Provence },
  { field: "city", Model: City },
  { field: "area", Model: Area },
  { field: "subArea", Model: SubArea },
];

const clean = (values) => [...new Set(values.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean))];

const upsertNames = (Model, names) => {
  if (!names.length) return null;
  const now = new Date();
  return Model.bulkWrite(
    names.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $set: { is_active: true, updated_at: now }, $setOnInsert: { name, created_at: now } },
        upsert: true,
      },
    })),
    { ordered: false }
  );
};

const upsertSuppliers = (names) => {
  if (!names.length) return null;
  return Party.bulkWrite(
    names.map((name) => ({
      updateOne: {
        filter: { name, partyType: SUPPLIER_PARTY_TYPE },
        update: { $set: { is_active: true }, $setOnInsert: { name, partyType: SUPPLIER_PARTY_TYPE } },
        upsert: true,
      },
    })),
    { ordered: false }
  );
};

/**
 * Makes sure the location and supplier values used by these slides exist in their
 * lookup collections, so the dropdowns offer them. Called when slides are saved,
 * instead of on every dropdown read.
 */
const syncLookupsFromSlides = async (slides) => {
  const list = Array.isArray(slides) ? slides : [slides];
  await Promise.all([
    ...LOOKUPS.map(({ field, Model }) => upsertNames(Model, clean(list.map((s) => s?.[field])))),
    upsertSuppliers(clean(list.map((s) => s?.supplier))),
  ]);
};

/** One-off backfill over every slide (see scripts/sync-lookups.js). */
const syncAllLookups = async () => {
  const fields = [...LOOKUPS.map((l) => l.field), "supplier"];
  const distinct = await Promise.all(fields.map((field) => Slide.distinct(field)));
  const pseudoSlides = [];
  fields.forEach((field, i) => distinct[i].forEach((value) => pseudoSlides.push({ [field]: value })));
  await syncLookupsFromSlides(pseudoSlides);
};

module.exports = { syncLookupsFromSlides, syncAllLookups };
