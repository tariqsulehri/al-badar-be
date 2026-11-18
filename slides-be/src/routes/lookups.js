const { Provence } = require("../models/provence.model");
const { City } = require("../models/city.model");
const { Area } = require("../models/area.model");
const { SubArea } = require("../models/subArea.model");
const createLookupController = require("../controllers/lookupController");
const crudRouter = require("./crudRouter");

const lookupRouter = (Model, label) => {
  const controller = createLookupController({ Model, label });
  return crudRouter(controller, { "/list_for_select": controller.listForSelect });
};

/** Mount path -> router for each name-only lookup collection. */
module.exports = {
  "/api/provence": lookupRouter(Provence, "Province"),
  "/api/city": lookupRouter(City, "City"),
  "/api/area": lookupRouter(Area, "Area"),
  "/api/subarea": lookupRouter(SubArea, "Sub-area"),
};
