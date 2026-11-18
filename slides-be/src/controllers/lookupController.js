const { ok, created } = require("../utils/apiResponse");
const HttpError = require("../utils/httpError");
const { containsRegex, parsePagination, paginatedResult, readPayload } = require("../utils/query");

/**
 * CRUD handlers for the simple name-only lookup collections
 * (province, city, area, sub-area). One implementation, four models.
 */
const createLookupController = ({ Model, label }) => {
  const pickFields = (body) => {
    const payload = readPayload(body);
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!name) throw HttpError.badRequest(`${label} name is required`);
    const fields = { name };
    if (typeof payload.is_active === "boolean") fields.is_active = payload.is_active;
    return fields;
  };

  const ensureUniqueName = async (name, excludeId) => {
    const filter = excludeId ? { name, _id: { $ne: excludeId } } : { name };
    if (await Model.exists(filter)) throw HttpError.conflict(`${label} already exists`);
  };

  return {
    create: async (req, res) => {
      const fields = pickFields(req.body);
      await ensureUniqueName(fields.name);
      const record = await Model.create({ is_active: true, ...fields });
      return created(res, record);
    },

    list: async (req, res) => {
      const { pageNo, pageSize, skip } = parsePagination(req.query);
      const searchText = (req.query.searchText || "").trim();
      const filter = searchText ? { name: containsRegex(searchText) } : {};

      const [data, totalRecords] = await Promise.all([
        Model.find(filter).sort({ name: 1 }).skip(skip).limit(pageSize),
        Model.countDocuments(filter),
      ]);
      return ok(res, paginatedResult({ data, totalRecords, pageNo, pageSize }));
    },

    listForSelect: async (req, res) => {
      const records = await Model.find({ name: { $nin: [null, ""] } })
        .sort({ name: 1 })
        .select({ _id: 0, name: 1 })
        .lean();
      return ok(res, records.map(({ name }) => ({ label: name, value: name })));
    },

    findById: async (req, res) => {
      const record = await Model.findById(req.params.id);
      if (!record) throw HttpError.notFound(`${label} not found`);
      return ok(res, record);
    },

    update: async (req, res) => {
      const fields = pickFields(req.body);
      await ensureUniqueName(fields.name, req.params.id);
      const record = await Model.findByIdAndUpdate(
        req.params.id,
        { ...fields, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      if (!record) throw HttpError.notFound(`${label} not found`);
      return ok(res, record, "Record updated");
    },

    remove: async (req, res) => {
      const record = await Model.findByIdAndDelete(req.params.id);
      if (!record) throw HttpError.notFound(`${label} not found`);
      return ok(res, null, "Record deleted");
    },
  };
};

module.exports = createLookupController;
