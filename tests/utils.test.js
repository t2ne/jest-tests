// Utility functions test suite
describe("Utility Functions", () => {
  describe("Math utilities", () => {
    // Temperature conversion functions
    const cToF = (celsius) => (celsius * 9) / 5 + 32;
    const fToC = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

    test("should convert Celsius to Fahrenheit correctly", () => {
      expect(cToF(0)).toBe(32);
      expect(cToF(100)).toBe(212);
      expect(cToF(-40)).toBe(-40);
      expect(cToF(37)).toBeCloseTo(98.6, 1);
    });

    test("should convert Fahrenheit to Celsius correctly", () => {
      expect(fToC(32)).toBe(0);
      expect(fToC(212)).toBe(100);
      expect(fToC(-40)).toBe(-40);
      expect(fToC(98.6)).toBeCloseTo(37, 1);
    });

    test("should handle edge cases", () => {
      expect(cToF(-273.15)).toBeCloseTo(-459.67, 2); // Absolute zero
      expect(fToC(-459.67)).toBeCloseTo(-273.15, 2);
    });

    // Array sum function
    const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

    test("should sum array correctly", () => {
      expect(sum([1, 2, 3])).toBe(6);
      expect(sum([-1, 1])).toBe(0);
      expect(sum([0, 0, 0])).toBe(0);
      expect(sum([])).toBe(0);
    });

    test("should handle large numbers", () => {
      expect(sum([1000000, 2000000])).toBe(3000000);
      expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6, 5);
    });

    // Average function
    const average = (arr) => (arr.length === 0 ? 0 : sum(arr) / arr.length);

    test("should calculate average correctly", () => {
      expect(average([1, 2, 3])).toBe(2);
      expect(average([10])).toBe(10);
      expect(average([])).toBe(0);
      expect(average([1, 3, 5])).toBe(3);
    });
  });

  describe("String utilities", () => {
    // Palindrome function
    const isPalindrome = (str) => {
      const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleaned === cleaned.split("").reverse().join("");
    };

    test("should detect palindromes correctly", () => {
      expect(isPalindrome("ana")).toBe(true);
      expect(isPalindrome("A man a plan a canal Panama")).toBe(true);
      expect(isPalindrome("racecar")).toBe(true);
      expect(isPalindrome("hello")).toBe(false);
      expect(isPalindrome("")).toBe(true);
    });

    test("should handle special characters and spaces", () => {
      expect(isPalindrome("A nut for a jar of tuna")).toBe(true);
      expect(isPalindrome("No 'x' in Nixon")).toBe(true);
      expect(isPalindrome("Mr. Owl ate my metal worm")).toBe(true);
    });

    // Capitalize function
    const capitalize = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    test("should capitalize strings correctly", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
      expect(capitalize("jAvAsCrIpT")).toBe("Javascript");
      expect(capitalize("")).toBe("");
      expect(capitalize("a")).toBe("A");
    });

    // Reverse string function
    const reverse = (str) => str.split("").reverse().join("");

    test("should reverse strings correctly", () => {
      expect(reverse("hello")).toBe("olleh");
      expect(reverse("12345")).toBe("54321");
      expect(reverse("")).toBe("");
      expect(reverse("a")).toBe("a");
    });
  });

  describe("Array utilities", () => {
    // Unique elements function
    const unique = (arr) => [...new Set(arr)];

    test("should remove duplicates", () => {
      expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
      expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
      expect(unique([])).toEqual([]);
      expect(unique([1])).toEqual([1]);
    });

    // Flatten array function
    const flatten = (arr) => arr.flat(Infinity);

    test("should flatten nested arrays", () => {
      expect(flatten([1, [2, 3]])).toEqual([1, 2, 3]);
      expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4]);
      expect(flatten([])).toEqual([]);
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    // Chunk array function
    const chunk = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    test("should chunk arrays correctly", () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
      expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
      expect(chunk([], 2)).toEqual([]);
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });
  });

  describe("Validation utilities", () => {
    // Email validation
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    test("should validate emails correctly", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("invalid.email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });

    // Student ID validation
    const isValidStudentId = (id) => /^\d{5}$/.test(id);

    test("should validate student IDs correctly", () => {
      expect(isValidStudentId("12345")).toBe(true);
      expect(isValidStudentId("00000")).toBe(true);
      expect(isValidStudentId("1234")).toBe(false);
      expect(isValidStudentId("123456")).toBe(false);
      expect(isValidStudentId("abcde")).toBe(false);
    });

    // Password strength
    const isStrongPassword = (password) => {
      return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
      );
    };

    test("should validate password strength", () => {
      expect(isStrongPassword("Password123")).toBe(true);
      expect(isStrongPassword("StrongP@ss1")).toBe(true);
      expect(isStrongPassword("weak")).toBe(false);
      expect(isStrongPassword("NOLOWERCASE123")).toBe(false);
      expect(isStrongPassword("nouppercase123")).toBe(false);
    });
  });
});
