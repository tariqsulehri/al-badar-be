const customerPlanService = require("../services/customerPlanService");
const { ok, created } = require("../utils/apiResponse");
const { parsePagination, readPayload } = require("../utils/query");

exports.create = async (req, res) => {
  const payload = readPayload(req.body);
  if (req.user?.username) {
    payload.created_by = req.user.username;
  }
  const plan = await customerPlanService.createCustomerPlan(payload);
  return created(res, plan);
};

exports.list = async (req, res) => {
  const pagination = parsePagination(req.query);
  const searchText = (req.query.searchText || "").trim();
  const result = await customerPlanService.listCustomerPlans({ ...pagination, searchText });
  return ok(res, result);
};

exports.update = async (req, res) => {
  const payload = readPayload(req.body);
  if (req.user?.username) {
    payload.updated_by = req.user.username;
  }
  const plan = await customerPlanService.updateCustomerPlan(req.params.id, payload);
  return ok(res, plan, "Customer plan updated");
};

exports.findById = async (req, res) => {
  const plan = await customerPlanService.findCustomerPlan(req.params.id);
  return ok(res, plan);
};

exports.remove = async (req, res) => {
  await customerPlanService.deactivateCustomerPlan(req.params.id);
  return ok(res, null, "Customer plan deleted");
};

exports.getNextSerial = async (req, res) => {
  const serialInfo = await customerPlanService.getNextSerialNumber();
  return ok(res, serialInfo);
};
