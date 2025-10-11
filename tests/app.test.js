const request = require("supertest");
const app = require("../src/app");

describe("Express App Integration Tests", () => {
  describe("GET /", () => {
    test("should serve HTML with student form", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toMatch(/html/);
      expect(res.text).toContain('id="student-form"');
      expect(res.text).toContain('id="student-id"');
    });

    test("should include proper meta tags", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain('<meta charset="UTF-8"');
      expect(res.text).toContain('<meta name="viewport"');
      expect(res.text).toContain("<title>Mini Testes no Browser</title>");
    });

    test("should include Tailwind CSS link", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain('href="/tailwind.css"');
    });

    test("should include exercises script", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain('src="exercises.js"');
    });

    test("should contain main content structure", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain('id="exercises-root"');
      expect(res.text).toContain('id="exercises-list"');
      expect(res.text).toContain('class="hidden"'); // exercises section starts hidden
    });
  });

  describe("Static file serving", () => {
    test("should serve exercises.js", async () => {
      const res = await request(app).get("/exercises.js");
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toMatch(/javascript/);
      expect(res.text).toContain("exercises");
    });

    test("should serve tailwind.css", async () => {
      const res = await request(app).get("/tailwind.css");
      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toMatch(/css/);
    });

    test("should return 404 for non-existent files", async () => {
      const res = await request(app).get("/nonexistent.js");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("HTTP Headers", () => {
    test("should not expose server information", async () => {
      const res = await request(app).get("/");
      expect(res.headers["x-powered-by"]).toBeUndefined();
    });

    test("should handle different HTTP methods gracefully", async () => {
      const methods = ["POST", "PUT", "DELETE", "PATCH"];
      for (const method of methods) {
        const res = await request(app)[method.toLowerCase()]("/");
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
        expect(res.statusCode).toBeLessThan(500);
      }
    });
  });
});
