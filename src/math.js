// Funções simples a testar
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number")
    throw new Error("Invalid input");
  return a + b;
}

function subtract(a, b) {
  if (typeof a !== "number" || typeof b !== "number")
    throw new Error("Invalid input");
  return a - b;
}

module.exports = { add, subtract };
