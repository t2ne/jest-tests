const request = require("supertest");
const app = require("../src/app");
const { add, subtract } = require("../src/math");

describe("Math module", () => {
  test("add() should sum two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("subtract() should subtract correctly", () => {
    expect(subtract(5, 2)).toBe(3);
  });

  test("should throw error for invalid input", () => {
    expect(() => add("a", 2)).toThrow("Invalid input");
  });
});

describe("Math API endpoints", () => {
  test("GET /api/add returns correct result", async () => {
    const res = await request(app).get("/api/add?a=2&b=3");
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test("GET /api/subtract returns correct result", async () => {
    const res = await request(app).get("/api/subtract?a=5&b=2");
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(3);
  });
});
