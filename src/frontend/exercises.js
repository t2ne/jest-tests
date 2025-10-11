// Copiado de public/exercises.js para origem em src/frontend; será copiado para public via build:assets
(function () {
  const form = document.getElementById("student-form");
  const studentInput = document.getElementById("student-id");
  const studentLabel = document.getElementById("student-label");
  const root = document.getElementById("exercises-root");
  const list = document.getElementById("exercises-list");
  const resBox = document.getElementById("exec-results");
  const logsBox = document.getElementById("exec-logs");

  const STORAGE_KEY = "mini-tests:student";
  const PROGRESS_KEY = "mini-tests:progress";

  const exercises = [
    {
      id: 1,
      title: "Converter Celsius para Fahrenheit",
      description:
        "Escreve uma função cToF(c) que converte Celsius para Fahrenheit. Depois cria pelo menos 3 afirmações (console.assert) a validar a função.",
      starter: `// Implementa a função\nfunction cToF(c) {\n  // TODO\n}\n\n// Testes (edita livremente)\nconsole.assert(typeof cToF === 'function', 'cToF deve ser função');\nconsole.assert(cToF(0) === 32, '0C -> 32F');\nconsole.assert(cToF(100) === 212, '100C -> 212F');\n`,
      minAsserts: 3,
    },
    {
      id: 2,
      title: "Palíndromos",
      description:
        "Implementa isPalindrome(str) que devolve true se a string for um palíndromo (ignora espaços e maiúsculas). Valida com asserts.",
      starter: `function isPalindrome(str) {\n  // TODO\n}\n\nconsole.assert(isPalindrome('ana') === true, 'ana');\nconsole.assert(isPalindrome('A nut for a jar of tuna') === true, 'frase');\nconsole.assert(isPalindrome('abc') === false, 'abc');\n`,
      minAsserts: 3,
    },
    {
      id: 3,
      title: "Soma de array",
      description:
        "Faz sum(arr) que devolve a soma de um array de números. Depois testa com arrays vazios, negativos e grandes.",
      starter: `function sum(arr) {\n  // TODO\n}\n\nconsole.assert(sum([]) === 0, 'vazio');\nconsole.assert(sum([1,2,3]) === 6, '1+2+3');\nconsole.assert(sum([-1,5]) === 4, '-1+5');\n`,
      minAsserts: 3,
    },
  ];

  const savedStudent = localStorage.getItem(STORAGE_KEY);
  if (savedStudent) {
    studentInput.value = savedStudent;
    showExercises(savedStudent);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = (studentInput.value || "").trim();
    if (!/^\d{5}$/.test(id)) {
      studentInput.focus();
      studentInput.classList.add("ring-2", "ring-red-500");
      setTimeout(
        () => studentInput.classList.remove("ring-2", "ring-red-500"),
        1200
      );
      return;
    }
    localStorage.setItem(STORAGE_KEY, id);
    showExercises(id);
  });

  function showExercises(id) {
    studentLabel.textContent = id;
    root.classList.remove("hidden");
    form.classList.add("hidden");
    renderExercises();
  }

  function renderExercises() {
    list.innerHTML = "";
    const progress = loadProgress();
    exercises.forEach((ex) => {
      const item = document.createElement("div");
      item.className = "bg-white rounded-xl shadow overflow-hidden";
      const header = document.createElement("button");
      header.className =
        "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50";
      header.innerHTML = `<span class="font-semibold text-slate-800">${
        ex.title
      }</span>\n      <span class="text-sm text-slate-500">${
        progress[ex.id]?.passed ? "Concluído ✅" : "Por fazer"
      }</span>`;
      const content = document.createElement("div");
      content.className = "px-4 py-3 border-t hidden";
      content.innerHTML = `\n        <p class=\"text-sm text-slate-700 mb-2\">${ex.description}</p>\n        <textarea class=\"w-full font-mono text-sm border rounded-lg p-2 min-h-[180px]\" id=\"code-${ex.id}\" spellcheck=\"false\"></textarea>\n        <div class=\"flex gap-2 mt-2\">\n          <button class=\"bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded\" data-run=\"${ex.id}\">Executar</button>\n          <button class=\"bg-slate-600 hover:bg-slate-700 text-white text-sm px-3 py-2 rounded\" data-reset=\"${ex.id}\">Repor</button>\n        </div>`;
      item.appendChild(header);
      item.appendChild(content);
      list.appendChild(item);
      const ta = content.querySelector("textarea");
      ta.value = progress[ex.id]?.code ?? ex.starter;
      header.addEventListener("click", () => {
        content.classList.toggle("hidden");
      });
      content
        .querySelector(`[data-run="${ex.id}"]`)
        .addEventListener("click", () => runExercise(ex));
      content
        .querySelector(`[data-reset="${ex.id}"]`)
        .addEventListener("click", () => {
          ta.value = ex.starter;
          saveCode(ex.id, ta.value);
        });
      ta.addEventListener("input", () => saveCode(ex.id, ta.value));
    });
  }

  function saveCode(id, code) {
    const p = loadProgress();
    p[id] = p[id] || {};
    p[id].code = code;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function runExercise(ex) {
    const code = document.getElementById(`code-${ex.id}`).value;
    const logs = [];
    const assertions = { total: 0, failed: 0, failures: [] };
    const dangerous = [
      /while\s*\(\s*true\s*\)/i,
      /for\s*\(\s*;\s*;\s*\)/i,
      /import\s|require\s*\(/i,
      /XMLHttpRequest|fetch|WebSocket/i,
      /document\.|window\.|localStorage|sessionStorage|navigator\./i,
    ];
    for (const p of dangerous) {
      if (p.test(code)) {
        report([{ type: "error", msg: `Padrão bloqueado: ${p}` }]);
        return;
      }
    }
    const safeConsole = {
      log: (...a) => logs.push(a.join(" ")),
      assert: (cond, msg) => {
        assertions.total++;
        if (!cond) {
          assertions.failed++;
          assertions.failures.push(msg || "assert falhou");
        }
      },
    };
    try {
      const fn = new Function("console", `${code}\nreturn 0;`);
      fn(safeConsole);
    } catch (e) {
      report(
        [
          {
            type: "error",
            msg: "Erro de execução: " + ((e && e.message) || e),
          },
        ],
        logs
      );
      return;
    }
    if (assertions.total < ex.minAsserts) {
      report(
        [
          {
            type: "warn",
            msg: `Espera-se pelo menos ${ex.minAsserts} asserts, encontraste ${assertions.total}.`,
          },
        ],
        logs
      );
    }
    if (assertions.failed > 0) {
      report(
        assertions.failures.map((m) => ({ type: "fail", msg: m })),
        logs
      );
      markProgress(ex.id, false, code);
    } else {
      report(
        [{ type: "ok", msg: `Todos os ${assertions.total} asserts passaram.` }],
        logs
      );
      markProgress(ex.id, true, code);
    }
  }

  function markProgress(id, passed, code) {
    const p = loadProgress();
    p[id] = { ...(p[id] || {}), passed, code };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    renderExercises();
  }

  function report(items, logs = []) {
    resBox.innerHTML = "";
    items.forEach((it) => {
      const div = document.createElement("div");
      div.className =
        "text-sm px-3 py-2 rounded mb-2 " +
        (it.type === "ok"
          ? "bg-green-50 text-green-800"
          : it.type === "fail"
          ? "bg-red-50 text-red-800"
          : it.type === "warn"
          ? "bg-yellow-50 text-yellow-800"
          : "bg-red-50 text-red-800");
      div.textContent = it.msg;
      resBox.appendChild(div);
    });
    logsBox.textContent = logs.join("\n");
  }
})();
