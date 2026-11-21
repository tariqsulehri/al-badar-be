const CustomerPlan = require("../models/customerPlan.model");
const HttpError = require("../utils/httpError");
const { containsRegex, paginatedResult } = require("../utils/query");

/**
 * Calculates row values and plan level aggregate totals.
 * Ensures Grand Total is automatically updated per row and for the entire plan.
 */
const calculateItemAndPlanTotals = (rawSlides = []) => {
  const slides = rawSlides.map((item, index) => {
    const width_feets = Number(item.width_feets) || 0;
    const height_feets = Number(item.height_feets) || 0;
    const sqft = width_feets * height_feets;

    const quotingMonthlyRent = Math.max(0, Number(item.quotingMonthlyRent) || 0);
    const discount = Number(item.discount) || 0;
    
    // If discountedMonthlyRent is explicitly passed, use it; otherwise compute from quotingMonthlyRent - discount
    let discountedMonthlyRent = Number(item.discountedMonthlyRent);
    if (isNaN(discountedMonthlyRent)) {
      discountedMonthlyRent = Math.max(0, quotingMonthlyRent - discount);
    }

    // 30 Days rent defaults to discountedMonthlyRent if not set
    let thirtyDaysRent = Number(item.thirtyDaysRent);
    if (isNaN(thirtyDaysRent)) {
      thirtyDaysRent = discountedMonthlyRent;
    }

    const skinCost = Math.max(0, Number(item.skinCost) || 0);
    
    // Grand Total is automatically updated: 30 Days Rent + Skin Cost
    const grandTotal = Math.max(0, thirtyDaysRent + skinCost);

    return {
      sr_no: index + 1,
      slide_id: item.slide_id,
      code: String(item.code || "").trim(),
      city: String(item.city || "").trim(),
      location: String(item.location || "").trim(),
      width_feets,
      height_feets,
      sqft,
      quotingMonthlyRent,
      discount,
      discountedMonthlyRent,
      thirtyDaysRent,
      skinCost,
      grandTotal,
      status: String(item.status || "Available").trim(),
      mediaType: String(item.mediaType || "").trim(),
      image: String(item.image || "").trim(),
    };
  });

  const totalSqft = slides.reduce((acc, row) => acc + (row.sqft || 0), 0);
  const totalQuotingMonthlyRent = slides.reduce((acc, row) => acc + (row.quotingMonthlyRent || 0), 0);
  const totalDiscountedMonthlyRent = slides.reduce((acc, row) => acc + (row.discountedMonthlyRent || 0), 0);
  const totalThirtyDaysRent = slides.reduce((acc, row) => acc + (row.thirtyDaysRent || 0), 0);
  const totalSkinCost = slides.reduce((acc, row) => acc + (row.skinCost || 0), 0);
  const grandTotal = slides.reduce((acc, row) => acc + (row.grandTotal || 0), 0);

  return {
    slides,
    totalSqft,
    totalQuotingMonthlyRent,
    totalDiscountedMonthlyRent,
    totalThirtyDaysRent,
    totalSkinCost,
    grandTotal,
  };
};

/**
 * Returns the next sequential plan number and serial number string.
 */
const getNextSerialNumber = async () => {
  const last = await CustomerPlan.findOne().sort({ plan_number: -1 }).select("plan_number").lean();
  const nextNum = (last?.plan_number || 1000) + 1;
  return {
    plan_number: nextNum,
    serial_number: `MP-${nextNum}`,
  };
};

const createCustomerPlan = async (data) => {
  if (!data.client_id || !data.client_name) {
    throw HttpError.badRequest("Client selection is required");
  }

  let plan_number = data.plan_number;
  let serial_number = data.serial_number;

  if (!plan_number || !serial_number) {
    const nextSeq = await getNextSerialNumber();
    plan_number = plan_number || nextSeq.plan_number;
    serial_number = serial_number || nextSeq.serial_number;
  }

  // Check unique serial number
  const existing = await CustomerPlan.findOne({
    $or: [{ serial_number }, { plan_number }],
  });
  if (existing) {
    throw HttpError.conflict("A customer plan with this serial number or plan number already exists");
  }

  const calculated = calculateItemAndPlanTotals(data.slides || []);

  const plan = await CustomerPlan.create({
    ...data,
    plan_number,
    serial_number,
    ...calculated,
  });

  return plan;
};

const updateCustomerPlan = async (id, data) => {
  let updateData = { ...data };

  if (Array.isArray(data.slides)) {
    const calculated = calculateItemAndPlanTotals(data.slides);
    updateData = { ...updateData, ...calculated };
  }

  // Ensure serial uniqueness if updating serial number
  if (data.serial_number) {
    const existing = await CustomerPlan.findOne({
      _id: { $ne: id },
      serial_number: data.serial_number,
    });
    if (existing) {
      throw HttpError.conflict("Serial number already in use by another plan");
    }
  }

  const plan = await CustomerPlan.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!plan) throw HttpError.notFound("Customer plan not found");
  return plan;
};

const findCustomerPlan = async (id) => {
  const plan = await CustomerPlan.findById(id).populate("client_id", "name city phoneNo email contactPerson address");
  if (!plan) throw HttpError.notFound("Customer plan not found");
  return plan;
};

const listCustomerPlans = async ({ pageNo, pageSize, skip, searchText }) => {
  const filter = { is_active: true };
  if (searchText) {
    const regex = containsRegex(searchText);
    filter.$or = [
      { serial_number: regex },
      { client_name: regex },
      { title: regex },
      { planStatus: regex },
    ];
  }

  const [data, totalRecords] = await Promise.all([
    CustomerPlan.find(filter).sort({ plan_number: -1 }).skip(skip).limit(pageSize),
    CustomerPlan.countDocuments(filter),
  ]);

  return paginatedResult({ data, totalRecords, pageNo, pageSize });
};

const deactivateCustomerPlan = async (id) => {
  const plan = await CustomerPlan.findByIdAndUpdate(id, { is_active: false }, { new: true });
  if (!plan) throw HttpError.notFound("Customer plan not found");
};

module.exports = {
  calculateItemAndPlanTotals,
  getNextSerialNumber,
  createCustomerPlan,
  updateCustomerPlan,
  findCustomerPlan,
  listCustomerPlans,
  deactivateCustomerPlan,
};
