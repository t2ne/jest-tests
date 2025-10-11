// Data validation and business logic tests
describe("Data Validation and Business Logic", () => {
  describe("Exercise Configuration Validation", () => {
    const exercises = [
      {
        id: 1,
        title: "Converter Celsius para Fahrenheit",
        description: "Convert temperature from Celsius to Fahrenheit",
        starter: "function cToF(c) { return c * 9/5 + 32; }",
        minAsserts: 3,
      },
      {
        id: 2,
        title: "Palíndromos",
        description: "Check if string is palindrome",
        starter:
          "function isPalindrome(str) { return str === str.split('').reverse().join(''); }",
        minAsserts: 3,
      },
    ];

    test("should validate exercise structure", () => {
      exercises.forEach((exercise) => {
        expect(exercise.id).toBeGreaterThan(0);
        expect(exercise.title).toBeTruthy();
        expect(exercise.description).toBeTruthy();
        expect(exercise.starter).toBeTruthy();
        expect(exercise.minAsserts).toBeGreaterThan(0);
      });
    });

    test("should have valid starter code syntax", () => {
      exercises.forEach((exercise) => {
        // Check that starter code contains function definition
        expect(exercise.starter).toMatch(/function\s+\w+/);
        // Check for balanced braces
        const openBraces = (exercise.starter.match(/{/g) || []).length;
        const closeBraces = (exercise.starter.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);
      });
    });

    test("should have reasonable minimum assert requirements", () => {
      exercises.forEach((exercise) => {
        expect(exercise.minAsserts).toBeGreaterThanOrEqual(1);
        expect(exercise.minAsserts).toBeLessThanOrEqual(10);
      });
    });
  });

  describe("Student Data Validation", () => {
    test("should validate student ID format", () => {
      const validIds = ["12345", "00000", "99999", "54321"];
      const invalidIds = [
        "1234",
        "123456",
        "abcde",
        "12a34",
        "",
        null,
        undefined,
      ];

      const validateStudentId = (id) => {
        if (typeof id !== "string") return false;
        return /^\d{5}$/.test(id.trim());
      };

      validIds.forEach((id) => {
        expect(validateStudentId(id)).toBe(true);
      });

      invalidIds.forEach((id) => {
        expect(validateStudentId(id)).toBe(false);
      });
    });

    test("should sanitize student input", () => {
      const sanitizeInput = (input) => {
        if (typeof input !== "string") return "";
        return input.trim().replace(/[^0-9]/g, "");
      };

      expect(sanitizeInput("  12345  ")).toBe("12345");
      expect(sanitizeInput("1a2b3c4d5e")).toBe("12345");
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput(null)).toBe("");
      expect(sanitizeInput(undefined)).toBe("");
    });
  });

  describe("Progress Tracking Logic", () => {
    test("should calculate completion percentage", () => {
      const calculateProgress = (completed, total) => {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
      };

      expect(calculateProgress(0, 3)).toBe(0);
      expect(calculateProgress(1, 3)).toBe(33);
      expect(calculateProgress(2, 3)).toBe(67);
      expect(calculateProgress(3, 3)).toBe(100);
      expect(calculateProgress(0, 0)).toBe(0);
    });

    test("should track exercise attempts", () => {
      const updateAttempts = (currentAttempts, newAttempt) => {
        return Math.max(0, currentAttempts + (newAttempt ? 1 : 0));
      };

      expect(updateAttempts(0, true)).toBe(1);
      expect(updateAttempts(5, true)).toBe(6);
      expect(updateAttempts(3, false)).toBe(3);
    });

    test("should determine exercise status", () => {
      const getExerciseStatus = (passed, attempts) => {
        if (passed) return "completed";
        if (attempts > 0) return "attempted";
        return "not-started";
      };

      expect(getExerciseStatus(true, 5)).toBe("completed");
      expect(getExerciseStatus(false, 3)).toBe("attempted");
      expect(getExerciseStatus(false, 0)).toBe("not-started");
    });
  });

  describe("Code Execution Validation", () => {
    test("should detect dangerous code patterns", () => {
      const dangerousPatterns = [
        "eval(",
        "Function(",
        "document.cookie",
        "localStorage.clear",
        "window.location",
        "fetch(",
        "XMLHttpRequest",
        "import(",
        "require(",
      ];

      const isDangerous = (code) => {
        return dangerousPatterns.some((pattern) => code.includes(pattern));
      };

      expect(isDangerous("console.log('safe')")).toBe(false);
      expect(isDangerous("function test() { return 1; }")).toBe(false);
      expect(isDangerous("eval('malicious code')")).toBe(true);
      expect(isDangerous("document.cookie = 'bad'")).toBe(true);
    });

    test("should validate assert statements", () => {
      const countValidAsserts = (code) => {
        const assertRegex =
          /console\.assert\s*\(\s*[^,]+\s*,\s*['"][^'"]*['"]\s*\)/g;
        return (code.match(assertRegex) || []).length;
      };

      expect(countValidAsserts("console.assert(true, 'test');")).toBe(1);
      expect(countValidAsserts("console.assert(1 === 1, 'equals');")).toBe(1);
      expect(
        countValidAsserts("console.assert(func(), 'function call');")
      ).toBe(1);
      expect(countValidAsserts("console.assert(true)")).toBe(0); // Missing message
    });

    test("should extract function names from code", () => {
      const extractFunctions = (code) => {
        const functionRegex = /function\s+(\w+)/g;
        const matches = [];
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
          matches.push(match[1]);
        }
        return matches;
      };

      expect(extractFunctions("function test() {}")).toEqual(["test"]);
      expect(
        extractFunctions("function add() {} function subtract() {}")
      ).toEqual(["add", "subtract"]);
      expect(extractFunctions("const arrow = () => {}")).toEqual([]);
    });
  });

  describe("Time and Date Utilities", () => {
    test("should format timestamps correctly", () => {
      const formatTimestamp = (date) => {
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
      };

      const testDate = new Date("2023-12-25T10:30:00Z");
      expect(formatTimestamp(testDate)).toBe("2023-12-25");
    });

    test("should calculate time differences", () => {
      const getTimeDifference = (start, end) => {
        return Math.abs(end - start);
      };

      const start = new Date("2023-01-01T00:00:00Z");
      const end = new Date("2023-01-01T01:00:00Z");
      expect(getTimeDifference(start.getTime(), end.getTime())).toBe(3600000); // 1 hour in ms
    });
  });

  describe("Error Handling Utilities", () => {
    test("should handle JSON parsing errors gracefully", () => {
      const safeJsonParse = (jsonString) => {
        try {
          return JSON.parse(jsonString);
        } catch (e) {
          return null;
        }
      };

      expect(safeJsonParse('{"valid": true}')).toEqual({ valid: true });
      expect(safeJsonParse("invalid json")).toBe(null);
      expect(safeJsonParse("")).toBe(null);
    });

    test("should validate required fields", () => {
      const validateRequired = (obj, requiredFields) => {
        return requiredFields.every(
          (field) =>
            obj.hasOwnProperty(field) &&
            obj[field] !== null &&
            obj[field] !== undefined &&
            obj[field] !== ""
        );
      };

      expect(validateRequired({ name: "John", age: 25 }, ["name", "age"])).toBe(
        true
      );
      expect(validateRequired({ name: "John" }, ["name", "age"])).toBe(false);
      expect(validateRequired({ name: "", age: 25 }, ["name", "age"])).toBe(
        false
      );
    });
  });

  describe("Mathematical Operations", () => {
    test("should perform accurate calculations", () => {
      // Temperature conversions
      const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;
      const fahrenheitToCelsius = (f) => ((f - 32) * 5) / 9;

      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(100)).toBe(212);
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(212)).toBe(100);

      // Test precision
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 1);
    });

    test("should handle edge cases in calculations", () => {
      const safeDivision = (a, b) => {
        if (b === 0) return Infinity;
        return a / b;
      };

      expect(safeDivision(10, 2)).toBe(5);
      expect(safeDivision(10, 0)).toBe(Infinity);
      expect(safeDivision(0, 5)).toBe(0);
    });
  });
});
