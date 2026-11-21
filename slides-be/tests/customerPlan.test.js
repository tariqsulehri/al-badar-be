const mongoose = require("mongoose");
const { app, request, connect, disconnect, loginAs } = require("./helpers");
const Party = require("../src/models/party.model");
const Slide = require("../src/models/slide.model");

let auth;
let testPartyId;
let testSlideId;

beforeAll(async () => {
  await connect("customer_plans");
  auth = { Authorization: `Bearer ${await loginAs("admin")}` };

  const party = await Party.create({
    partyType: "Customer",
    name: "ABC Telecom Corp",
    city: "Lahore",
    phoneNo: "03001234567",
    email: "info@abctelecom.com",
    contactPerson: "Mr. Ahmad",
  });
  testPartyId = party._id;

  const slide = await Slide.create({
    code: "PLAN-TEST-001",
    supplier: "Test Supplier",
    provence: "Punjab",
    city: "Lahore",
    area: "Gulberg",
    subArea: "Main Blvd",
    mediaType: "Billboard",
    height_feets: 20,
    width_feets: 60,
    category: "A+",
    quotedPrice: 150000,
    discountedPrice: 130000,
    status: "Available",
    image: "http://localhost:3500/uploads/slides/images/test.jpg",
  });
  testSlideId = slide._id;
});

afterAll(disconnect);

describe("Customer Plan API", () => {
  let createdPlanId;

  it("fetches next available serial number", async () => {
    const res = await request(app).get("/api/customer-plan/next-serial").set(auth);
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveProperty("plan_number");
    expect(res.body.result).toHaveProperty("serial_number");
    expect(res.body.result.serial_number).toMatch(/^MP-\d+$/);
  });

  it("fetches clients for selection", async () => {
    const res = await request(app).get("/api/party/clients/list_for_select").set(auth);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(res.body.result.some((c) => c._id.toString() === testPartyId.toString())).toBe(true);
  });

  it("creates a customer plan and calculates grand total automatically", async () => {
    const planData = {
      client_id: testPartyId,
      client_name: "ABC Telecom Corp",
      title: "ABMS Outdoor Media Plan for ABC Telecom Corp",
      slides: [
        {
          slide_id: testSlideId,
          code: "PLAN-TEST-001",
          city: "Lahore",
          location: "Gulberg Main Blvd",
          width_feets: 60,
          height_feets: 20,
          quotingMonthlyRent: 150000,
          discount: 20000,
          discountedMonthlyRent: 130000,
          thirtyDaysRent: 130000,
          skinCost: 15000,
          status: "Available",
        },
      ],
    };

    const res = await request(app).post("/api/customer-plan/create").set(auth).send({ data: planData });
    expect(res.status).toBe(201);
    const plan = res.body.result;
    expect(plan.serial_number).toBeDefined();
    expect(plan.slides).toHaveLength(1);

    const slideItem = plan.slides[0];
    expect(slideItem.sqft).toBe(1200); // 60 * 20
    expect(slideItem.grandTotal).toBe(145000); // 130000 + 15000
    expect(plan.totalSqft).toBe(1200);
    expect(plan.totalQuotingMonthlyRent).toBe(150000);
    expect(plan.totalDiscountedMonthlyRent).toBe(130000);
    expect(plan.totalThirtyDaysRent).toBe(130000);
    expect(plan.totalSkinCost).toBe(15000);
    expect(plan.grandTotal).toBe(145000);

    createdPlanId = plan._id;
  });

  it("lists customer plans with pagination and search", async () => {
    const res = await request(app)
      .get("/api/customer-plan/list")
      .query({ searchText: "Telecom", pageSize: 10, pageNo: 1 })
      .set(auth);
    expect(res.status).toBe(200);
    expect(res.body.result.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.result.totalRecords).toBeGreaterThanOrEqual(1);
  });

  it("finds customer plan by ID", async () => {
    const res = await request(app).get(`/api/customer-plan/find/${createdPlanId}`).set(auth);
    expect(res.status).toBe(200);
    expect(res.body.result._id).toBe(createdPlanId);
    expect(res.body.result.client_name).toBe("ABC Telecom Corp");
  });

  it("updates customer plan and automatically updates grand total", async () => {
    const updatedSlides = [
      {
        slide_id: testSlideId,
        code: "PLAN-TEST-001",
        city: "Lahore",
        location: "Gulberg Main Blvd",
        width_feets: 60,
        height_feets: 20,
        quotingMonthlyRent: 150000,
        discount: 30000,
        discountedMonthlyRent: 120000,
        thirtyDaysRent: 120000,
        skinCost: 25000, // changed
        status: "Booked",
      },
    ];

    const res = await request(app)
      .post(`/api/customer-plan/update/${createdPlanId}`)
      .set(auth)
      .send({ data: { slides: updatedSlides, status: "Sent" } });

    expect(res.status).toBe(200);
    const plan = res.body.result;
    expect(plan.slides[0].skinCost).toBe(25000);
    expect(plan.slides[0].grandTotal).toBe(145000); // 120000 + 25000
    expect(plan.slides[0].status).toBe("Booked");
    expect(plan.grandTotal).toBe(145000);
  });

  it("soft deletes customer plan", async () => {
    const res = await request(app).delete(`/api/customer-plan/delete/${createdPlanId}`).set(auth);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/customer-plan/find/${createdPlanId}`).set(auth);
    expect(check.status).toBe(200);
    expect(check.body.result.is_active).toBe(false);
  });
});
