/**
 * One-off backfill: copies every province/city/area/sub-area/supplier used by
 * existing slides into the lookup collections. New and edited slides are synced
 * automatically, so this is only needed once after upgrading.
 *
 *   npm run sync-lookups
 */
const mongoose = require("mongoose");
const { dbUri } = require("../src/config/env");
const connectDb = require("../src/startup/db");
const { syncAllLookups } = require("../src/services/lookupSyncService");

connectDb(dbUri)
  .then(syncAllLookups)
  .then(() => console.log("Lookup collections are in sync with slides."))
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
