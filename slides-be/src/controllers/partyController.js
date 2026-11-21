const Party = require("../models/party.model");
const { ok, created } = require("../utils/apiResponse");
const HttpError = require("../utils/httpError");
const { containsRegex, parsePagination, paginatedResult, readPayload } = require("../utils/query");

const SUPPLIER_PARTY_TYPE = "Supplier";

const ensureUnique = async ({ name, partyType }, excludeId) => {
  if (!name || !partyType) return;
  const filter = { name, partyType };
  if (excludeId) filter._id = { $ne: excludeId };
  if (await Party.exists(filter)) throw HttpError.conflict("Party already exists");
};

exports.create = async (req, res) => {
  const data = readPayload(req.body);
  await ensureUnique(data);
  return created(res, await Party.create(data));
};

exports.list = async (req, res) => {
  const { pageNo, pageSize, skip } = parsePagination(req.query);
  const searchText = (req.query.searchText || "").trim();
  const filter = searchText ? { name: containsRegex(searchText) } : {};

  const [data, totalRecords] = await Promise.all([
    Party.find(filter).sort({ name: 1 }).skip(skip).limit(pageSize),
    Party.countDocuments(filter),
  ]);
  return ok(res, paginatedResult({ data, totalRecords, pageNo, pageSize }));
};

// Suppliers are kept in sync from slides by services/lookupSyncService.js when slides are saved.
exports.listSuppliersForSelect = async (req, res) => {
  const suppliers = await Party.find({ partyType: SUPPLIER_PARTY_TYPE, name: { $nin: [null, ""] } })
    .sort({ name: 1 })
    .select({ _id: 0, name: 1 })
    .lean();
  return ok(res, suppliers.map(({ name }) => ({ label: name, value: name })));
};

// Clients/Customers for selection in Customer Plan & other flows.
exports.listClientsForSelect = async (req, res) => {
  const clients = await Party.find({
    name: { $nin: [null, ""] },
    partyType: { $ne: SUPPLIER_PARTY_TYPE },
  })
    .sort({ name: 1 })
    .select({ _id: 1, name: 1, partyType: 1, city: 1, phoneNo: 1, cellNo: 1, email: 1, contactPerson: 1, address: 1 })
    .lean();

  // If no non-supplier party exists, fallback to all named parties so user always has options
  const partyList = clients.length > 0 ? clients : await Party.find({ name: { $nin: [null, ""] } }).sort({ name: 1 }).lean();

  return ok(
    res,
    partyList.map((p) => ({
      label: p.partyType ? `${p.name} (${p.partyType})` : p.name,
      value: p._id,
      _id: p._id,
      name: p.name,
      partyType: p.partyType || "Customer",
      city: p.city || "",
      phoneNo: p.phoneNo || p.cellNo || "",
      cellNo: p.cellNo || "",
      email: p.email || "",
      contactPerson: p.contactPerson || "",
      address: p.address || "",
    }))
  );
};

exports.update = async (req, res) => {
  const data = readPayload(req.body);
  await ensureUnique(data, req.params.id);
  const party = await Party.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!party) throw HttpError.notFound("Party not found");
  return ok(res, party, "Record updated");
};

exports.findById = async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (!party) throw HttpError.notFound("Party not found");
  return ok(res, party);
};

exports.remove = async (req, res) => {
  const party = await Party.findByIdAndDelete(req.params.id);
  if (!party) throw HttpError.notFound("Party not found");
  return ok(res, null, "Record deleted");
};
