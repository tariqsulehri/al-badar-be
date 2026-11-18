const { app, request, connect, disconnect, loginAs } = require("./helpers");

let auth;

const slide = (overrides = {}) => ({
  code: "LHR-001",
  supplier: "Acme Outdoor",
  provence: "Punjab",
  city: "Lahore",
  area: "Gulberg",
  subArea: "Main Boulevard",
  mediaType: "Billboard",
  height_feets: 20,
  width_feets: 40,
  category: "A",
  lights: "Available",
  image: "http://localhost:3500/uploads/slides/images/x.jpg",
  ...overrides,
});

beforeAll(async () => {
  await connect("slides");
  auth = { Authorization: `Bearer ${await loginAs("admin")}` };
});
afterAll(disconnect);

describe("slides CRUD", () => {
  let id;

  it("creates a slide (frontend sends { data })", async () => {
    const res = await request(app).post("/api/slides/create").set(auth).send({ data: slide() });
    expect(res.status).toBe(201);
    expect(res.body.result.code).toBe("LHR-001");
    id = res.body.result._id;
  });

  it("rejects a duplicate code with 409", async () => {
    const res = await request(app).post("/api/slides/create").set(auth).send({ data: slide() });
    expect(res.status).toBe(409);
  });

  it("returns 400 with field errors when required fields are missing", async () => {
    const res = await request(app).post("/api/slides/create").set(auth).send({ data: { code: "X" } });
    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field)).toEqual(expect.arrayContaining(["supplier", "city"]));
  });

  it("ignores a client-supplied _id", async () => {
    const forcedId = "64b000000000000000000001";
    const res = await request(app)
      .post("/api/slides/create")
      .set(auth)
      .send({ data: slide({ code: "LHR-002", _id: forcedId }) });
    expect(res.status).toBe(201);
    expect(res.body.result._id).not.toBe(forcedId);
  });

  it("updates using the id in the URL", async () => {
    const res = await request(app).post(`/api/slides/update/${id}`).set(auth).send({ data: { finalPrice: 5000 } });
    expect(res.status).toBe(200);
    expect(res.body.result.finalPrice).toBe(5000);
  });

  it("lists with pagination and a regex-safe search", async () => {
    const res = await request(app)
      .get("/api/slides/list")
      .query({ pageNo: 1, pageSize: 1, searchBy: "code", searchText: "LHR-(" })
      .set(auth);
    expect(res.status).toBe(200);
    expect(res.body.result).toMatchObject({ totalRecords: 0, pageNo: 1, pageSize: 1 });

    const all = await request(app).get("/api/slides/list").query({ pageSize: 1 }).set(auth);
    expect(all.body.result).toMatchObject({ totalRecords: 2, totalPages: 2 });
    expect(all.body.result.data).toHaveLength(1);
  });

  it("returns 400 for a malformed id and 404 for an unknown one", async () => {
    expect((await request(app).get("/api/slides/find/not-an-id").set(auth)).status).toBe(400);
    expect((await request(app).get("/api/slides/find/64b000000000000000000099").set(auth)).status).toBe(404);
  });

  it("deletes only via DELETE", async () => {
    expect((await request(app).get(`/api/slides/delete/${id}`).set(auth)).status).toBe(404);
    expect((await request(app).delete(`/api/slides/delete/${id}`).set(auth)).status).toBe(200);
    expect((await request(app).get(`/api/slides/find/${id}`).set(auth)).status).toBe(404);
  });
});

describe("lookups", () => {
  it("are filled from saved slides and served for dropdowns", async () => {
    await request(app).post("/api/slides/create").set(auth).send({ data: slide({ code: "KHI-001", city: "Karachi" }) });

    const cities = await request(app).get("/api/city/list_for_select").set(auth);
    expect(cities.body.result).toEqual(expect.arrayContaining([{ label: "Karachi", value: "Karachi" }]));

    const suppliers = await request(app).get("/api/party/suppliers/list_for_select").set(auth);
    expect(suppliers.body.result).toEqual([{ label: "Acme Outdoor", value: "Acme Outdoor" }]);
  });

  it("support create / duplicate / delete", async () => {
    const created = await request(app).post("/api/area/create").set(auth).send({ data: { name: "DHA" } });
    expect(created.status).toBe(201);

    const duplicate = await request(app).post("/api/area/create").set(auth).send({ data: { name: "DHA" } });
    expect(duplicate.status).toBe(409);

    const removed = await request(app).delete(`/api/area/delete/${created.body.result._id}`).set(auth);
    expect(removed.status).toBe(200);
  });
});

describe("image upload", () => {
  it("rejects non-image files", async () => {
    const res = await request(app)
      .post("/api/slides/upload")
      .set(auth)
      .attach("image", Buffer.from("<?php echo 1;"), { filename: "shell.php", contentType: "application/x-php" });
    expect(res.status).toBe(400);
  });
});
