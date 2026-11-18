const { app, request, connect, disconnect, createUser, loginAs, PASSWORD } = require("./helpers");

beforeAll(() => connect("auth"));
afterAll(disconnect);

describe("POST /api/auth", () => {
  beforeAll(() => createUser("manager", "jane"));

  it("returns a token and the public user for valid credentials", async () => {
    const res = await request(app).post("/api/auth").send({ username: "jane", password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.result.token).toEqual(expect.any(String));
    expect(res.body.result.user).toMatchObject({ username: "jane", role: "manager" });
    expect(res.body.result.user.password).toBeUndefined();
  });

  it("accepts the email address as the username", async () => {
    const res = await request(app).post("/api/auth").send({ username: "JANE@example.com", password: PASSWORD });
    expect(res.status).toBe(200);
  });

  it("returns the same 401 for a wrong password and an unknown user", async () => {
    const wrongPassword = await request(app).post("/api/auth").send({ username: "jane", password: "nope" });
    const unknownUser = await request(app).post("/api/auth").send({ username: "ghost", password: "nope" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownUser.body.message);
  });

  it("rejects a missing password with 400 and field errors", async () => {
    const res = await request(app).post("/api/auth").send({ username: "jane" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([expect.objectContaining({ field: "password" })]);
  });
});

describe("protected routes", () => {
  it("reject requests without a token", async () => {
    const res = await request(app).get("/api/slides/list");
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ status: "error", result: null });
  });

  it("reject a tampered token", async () => {
    const token = await loginAs("admin");
    const res = await request(app).get("/api/slides/list").set("Authorization", `Bearer ${token}x`);
    expect(res.status).toBe(401);
  });

  it("accept a valid token", async () => {
    const token = await loginAs("admin");
    const res = await request(app).get("/api/slides/list").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

describe("user management", () => {
  it("is admin-only", async () => {
    const token = await loginAs("user");
    const res = await request(app).get("/api/users/list").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("lets an admin create a user, and never returns password hashes", async () => {
    const token = await loginAs("admin");
    const created = await request(app)
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newbie", email: "newbie@example.com", password: "long-enough-pw", role: "manager" });

    expect(created.status).toBe(201);
    expect(created.body.result).toMatchObject({ username: "newbie", role: "manager" });
    expect(created.body.result.password).toBeUndefined();

    const list = await request(app).get("/api/users/list").set("Authorization", `Bearer ${token}`);
    expect(list.body.result.every((u) => u.password === undefined)).toBe(true);
  });

  it("rejects a duplicate username with 409", async () => {
    const token = await loginAs("admin");
    const res = await request(app)
      .post("/api/users/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newbie", email: "other@example.com", password: "long-enough-pw" });
    expect(res.status).toBe(409);
  });

  it("returns the current user from /me", async () => {
    const token = await loginAs("manager");
    const res = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.result.username).toBe("manager-user");
  });
});
