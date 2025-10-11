// Frontend functionality tests (pure logic, no DOM needed)
describe("Frontend Exercise Functionality", () => {
  // Mock localStorage for tests
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  describe("Student ID validation", () => {
    test("should validate 5-digit student IDs", () => {
      const validIds = ["12345", "00001", "99999"];
      const invalidIds = ["1234", "123456", "abcde", "12a45", ""];

      const isValidId = (id) => /^\d{5}$/.test(id);

      validIds.forEach((id) => {
        expect(isValidId(id)).toBe(true);
      });

      invalidIds.forEach((id) => {
        expect(isValidId(id)).toBe(false);
      });
    });
  });

  describe("Exercise data structure", () => {
    const exercises = [
      {
        id: 1,
        title: "Converter Celsius para Fahrenheit",
        description: "Test description",
        starter: "function cToF(c) { return c * 9/5 + 32; }",
        minAsserts: 3,
      },
      {
        id: 2,
        title: "Palíndromos",
        description: "Test description 2",
        starter: "function isPalindrome(str) { return true; }",
        minAsserts: 3,
      },
    ];

    test("should have required properties for each exercise", () => {
      exercises.forEach((exercise) => {
        expect(exercise).toHaveProperty("id");
        expect(exercise).toHaveProperty("title");
        expect(exercise).toHaveProperty("description");
        expect(exercise).toHaveProperty("starter");
        expect(exercise).toHaveProperty("minAsserts");
        expect(typeof exercise.id).toBe("number");
        expect(typeof exercise.title).toBe("string");
        expect(typeof exercise.minAsserts).toBe("number");
      });
    });

    test("should have unique IDs", () => {
      const ids = exercises.map((ex) => ex.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    test("should have minimum assert requirements", () => {
      exercises.forEach((exercise) => {
        expect(exercise.minAsserts).toBeGreaterThan(0);
        expect(exercise.minAsserts).toBeLessThanOrEqual(10);
      });
    });
  });

  describe("Progress tracking", () => {
    const mockProgress = {
      1: { passed: true, attempts: 5 },
      2: { passed: false, attempts: 2 },
      3: { passed: true, attempts: 1 },
    };

    beforeEach(() => {
      // Mock localStorage for each test
      global.localStorage = localStorageMock;
      jest.clearAllMocks();
    });

    test("should load progress from localStorage", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProgress));

      const loadProgress = () => {
        try {
          return JSON.parse(
            localStorage.getItem("mini-tests:progress") || "{}"
          );
        } catch {
          return {};
        }
      };

      const progress = loadProgress();
      expect(progress).toEqual(mockProgress);
      expect(localStorage.getItem).toHaveBeenCalledWith("mini-tests:progress");
    });

    test("should handle corrupted localStorage data", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const loadProgress = () => {
        try {
          return JSON.parse(
            localStorage.getItem("mini-tests:progress") || "{}"
          );
        } catch {
          return {};
        }
      };

      const progress = loadProgress();
      expect(progress).toEqual({});
    });

    test("should save progress to localStorage", () => {
      const saveProgress = (progress) => {
        localStorage.setItem("mini-tests:progress", JSON.stringify(progress));
      };

      saveProgress(mockProgress);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "mini-tests:progress",
        JSON.stringify(mockProgress)
      );
    });
  });

  describe("Code execution simulation", () => {
    test("should count console.assert calls", () => {
      const code = `
        console.assert(1 === 1, 'test 1');
        console.assert(2 === 2, 'test 2');
        console.assert(3 === 3, 'test 3');
      `;

      const countAsserts = (code) => {
        return (code.match(/console\.assert\(/g) || []).length;
      };

      expect(countAsserts(code)).toBe(3);
    });

    test("should detect function definitions", () => {
      const codes = [
        "function testFunc() { return true; }",
        "const testFunc = () => true;",
        "let testFunc = function() { return true; };",
        "var testFunc = () => { return true; };",
      ];

      const hasFunctionDef = (code) => {
        return /function\s+\w+|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=/.test(
          code
        );
      };

      codes.forEach((code) => {
        expect(hasFunctionDef(code)).toBe(true);
      });
    });

    test("should validate minimum assert requirements", () => {
      const validateExercise = (code, minAsserts) => {
        const assertCount = (code.match(/console\.assert\(/g) || []).length;
        return assertCount >= minAsserts;
      };

      expect(validateExercise("console.assert(true)", 1)).toBe(true);
      expect(validateExercise("console.assert(true)", 2)).toBe(false);
      expect(validateExercise("console.assert(1); console.assert(2);", 2)).toBe(
        true
      );
    });
  });

  describe("HTML generation helpers", () => {
    test("should generate CSS class toggles", () => {
      const toggleClass = (currentClasses, className) => {
        const classes = currentClasses.split(" ");
        const index = classes.indexOf(className);
        if (index > -1) {
          classes.splice(index, 1);
        } else {
          classes.push(className);
        }
        return classes.filter((c) => c).join(" ");
      };

      expect(toggleClass("visible", "hidden")).toBe("visible hidden");
      expect(toggleClass("visible hidden", "hidden")).toBe("visible");
      expect(toggleClass("", "test")).toBe("test");
    });

    test("should generate exercise HTML strings", () => {
      const generateExerciseHTML = (exercise) => {
        return `
          <h3>${exercise.title}</h3>
          <p>${exercise.description}</p>
          <textarea id="code-${exercise.id}"></textarea>
        `;
      };

      const exercise = { id: 1, title: "Test", description: "Test desc" };
      const html = generateExerciseHTML(exercise);

      expect(html).toContain("<h3>Test</h3>");
      expect(html).toContain("<p>Test desc</p>");
      expect(html).toContain('id="code-1"');
    });
  });
});
