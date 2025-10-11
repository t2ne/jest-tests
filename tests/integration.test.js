const request = require("supertest");
const app = require("../src/app");

describe("Performance and Integration Tests", () => {
  describe("Response Time Tests", () => {
    test("should respond to root route within acceptable time", async () => {
      const start = Date.now();
      const res = await request(app).get("/");
      const responseTime = Date.now() - start;

      expect(res.statusCode).toBe(200);
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    test("should handle concurrent requests", async () => {
      const requests = Array(10)
        .fill()
        .map(() => request(app).get("/"));
      const responses = await Promise.all(requests);

      responses.forEach((res) => {
        expect(res.statusCode).toBe(200);
      });
    });

    test("should serve static files efficiently", async () => {
      const staticFiles = ["/exercises.js", "/tailwind.css"];

      for (const file of staticFiles) {
        const start = Date.now();
        const res = await request(app).get(file);
        const responseTime = Date.now() - start;

        expect(res.statusCode).toBe(200);
        expect(responseTime).toBeLessThan(500); // Static files should be fast
      }
    });
  });

  describe("Load Testing Simulation", () => {
    test("should handle rapid sequential requests", async () => {
      const results = [];

      for (let i = 0; i < 20; i++) {
        const res = await request(app).get("/");
        results.push(res.statusCode);
      }

      // All requests should succeed
      expect(results.every((status) => status === 200)).toBe(true);
    });

    test("should maintain consistent response structure", async () => {
      const responses = [];

      for (let i = 0; i < 5; i++) {
        const res = await request(app).get("/");
        responses.push(res.text);
      }

      // All responses should be identical
      const firstResponse = responses[0];
      responses.forEach((response) => {
        expect(response).toBe(firstResponse);
      });
    });
  });

  describe("Error Handling Tests", () => {
    test("should handle malformed requests gracefully", async () => {
      // Test with various malformed paths
      const malformedPaths = [
        "/../../etc/passwd",
        "/<script>alert('xss')</script>",
        "/null",
        "/undefined",
        "/%2e%2e%2f%2e%2e%2fetc%2fpasswd",
      ];

      for (const path of malformedPaths) {
        const res = await request(app).get(path);
        expect([200, 404]).toContain(res.statusCode); // Should not crash
      }
    });

    test("should handle large request headers", async () => {
      const largeHeader = "x".repeat(1000);
      const res = await request(app)
        .get("/")
        .set("X-Large-Header", largeHeader);

      expect([200, 413, 414]).toContain(res.statusCode); // OK, Payload Too Large, or URI Too Long
    });
  });

  describe("Security Tests", () => {
    test("should not expose sensitive information in headers", async () => {
      const res = await request(app).get("/");

      // Check that common sensitive headers are not exposed
      expect(res.headers["x-powered-by"]).toBeUndefined();
      // Server header might be undefined (which is good)
      if (res.headers["server"]) {
        expect(res.headers["server"]).not.toContain("Express");
      }
    });

    test("should handle special characters in URLs", async () => {
      const specialChars = ["'", '"', "<", ">", "&", "%"];

      for (const char of specialChars) {
        const res = await request(app).get(`/test${char}`);
        expect(res.statusCode).toBe(404); // Should return 404, not crash
      }
    });
  });

  describe("Content Validation Tests", () => {
    test("should serve valid HTML structure", async () => {
      const res = await request(app).get("/");

      expect(res.text).toContain("<!DOCTYPE html>");
      expect(res.text).toContain("<html");
      expect(res.text).toContain("<head>");
      expect(res.text).toContain("<body");
      expect(res.text).toContain("</body>");
      expect(res.text).toContain("</html>");
    });
    test("should include all required form elements", async () => {
      const res = await request(app).get("/");
      const requiredElements = [
        'id="student-form"',
        'id="student-id"',
        'type="submit"',
        'pattern="\\d{5}"',
        'maxlength="5"',
      ];

      requiredElements.forEach((element) => {
        expect(res.text).toContain(element);
      });
    });

    test("should include accessibility features", async () => {
      const res = await request(app).get("/");

      expect(res.text).toContain('lang="en"');
      expect(res.text).toContain('for="student-id"');
      expect(res.text).toContain('inputmode="numeric"');
    });
  });

  describe("Edge Case Tests", () => {
    test("should handle empty and whitespace requests", async () => {
      const paths = ["", " ", "  ", "\t", "\n"];

      for (const path of paths) {
        const res = await request(app).get(`/${path}`);
        expect([200, 404]).toContain(res.statusCode);
      }
    });

    test("should handle very long URLs", async () => {
      const longPath = "/" + "a".repeat(2000);
      const res = await request(app).get(longPath);
      expect([200, 404, 414]).toContain(res.statusCode); // OK, Not Found, or URI Too Long
    });
  });

  describe("Middleware Tests", () => {
    test("should parse JSON requests", async () => {
      const res = await request(app)
        .post("/")
        .send({ test: "data" })
        .set("Content-Type", "application/json");

      // Express should handle JSON parsing without crashing
      expect([200, 404, 405]).toContain(res.statusCode);
    });

    test("should serve static files with correct MIME types", async () => {
      const files = [
        { path: "/exercises.js", type: "javascript" },
        { path: "/tailwind.css", type: "css" },
      ];

      for (const file of files) {
        const res = await request(app).get(file.path);
        if (res.statusCode === 200) {
          expect(res.headers["content-type"]).toContain(file.type);
        }
      }
    });
  });
});
