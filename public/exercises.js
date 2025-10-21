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
    {
      id: 4,
      title: "Contar vogais",
      description:
        "Implementa contarVogais(str) que devolve o nº de vogais (a, e, i, o, u). Ignora maiúsculas e acentos.",
      starter: `function contarVogais(str) {
  // TODO
}

// testes
console.assert(contarVogais('javascript') === 3, 'javascript → 3');
console.assert(contarVogais('AEIOU') === 5, 'AEIOU → 5');
console.assert(contarVogais('xyz') === 0, 'xyz → 0');
// extra com acentos (se implementares normalização)
console.assert(contarVogais('coração') === 4, 'coração → 4');
`,
      minAsserts: 3,
    },

    {
      id: 5,
      type: "quiz",
      title: "Quiz: JS Básico (V/F)",
      description:
        "Responde V/F. Tens 40 segundos. As perguntas são baralhadas por aluno.",
      durationSec: 40, // timer
      minScore: 0.7, // 70% para passar
      questions: [
        {
          id: "q1",
          text: "O projeto foi criado para ajudar estudantes a praticar JavaScript.",
          answer: true,
          topic: "objetivo",
        },
        {
          id: "q2",
          text: "A plataforma usa React e Bootstrap no frontend.",
          answer: false,
          topic: "frontend",
        },
        {
          id: "q3",
          text: "A autenticação do painel administrativo é feita com HTTP Basic.",
          answer: true,
          topic: "seguranca",
        },
        {
          id: "q4",
          text: "O backend foi desenvolvido com Node.js e Express.",
          answer: true,
          topic: "backend",
        },
        {
          id: "q5",
          text: "A interface é moderna e responsiva graças ao uso de Tailwind CSS.",
          answer: true,
          topic: "frontend",
        },
        {
          id: "q6",
          text: "Os testes foram implementados com Jest e Supertest.",
          answer: true,
          topic: "testes",
        },
        {
          id: "q7",
          text: "O dashboard administrativo atualiza automaticamente a cada 30 segundos.",
          answer: true,
          topic: "admin",
        },
        {
          id: "q8",
          text: "O objetivo principal do projeto é o entretenimento.",
          answer: false,
          topic: "objetivo",
        },
      ],
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

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      // Show form, hide exercises
      form.classList.remove("hidden");
      root.classList.add("hidden");
      // Clear student input
      studentInput.value = "";
      studentInput.focus();
    });
  }

  function renderExercises() {
    list.innerHTML = "";
    const progress = loadProgress();
    exercises.forEach((ex) => {
      const item = document.createElement("div");
      item.className =
        "bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300";
      const header = document.createElement("button");
      header.className =
        "w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200";
      const statusBadge = progress[ex.id]?.passed
        ? '<span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Concluído</span>'
        : '<span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>Por fazer</span>';
      header.innerHTML = `<span class="font-semibold text-slate-800 text-lg">${ex.title}</span>\n      ${statusBadge}`;
      const content = document.createElement("div");
      content.className =
        "px-6 py-4 border-t border-slate-100 hidden bg-slate-50";
      content.innerHTML = `
        <p class="text-slate-700 mb-4 leading-relaxed">${ex.description}</p>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Teu código:</label>
          <textarea class="w-full font-mono text-sm border-2 border-slate-200 rounded-xl p-4 min-h-[200px] bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" id="code-${ex.id}" spellcheck="false" placeholder="Escreve o teu código aqui..."></textarea>
        </div>
        <div class="flex gap-3">
          <button class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2" data-run="${ex.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 01-3 3H4a3 3 0 01-3-3V4a3 3 0 013-3h16a3 3 0 013 3v1z"></path>
            </svg>
            Executar
          </button>
          <button class="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2" data-reset="${ex.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Repor
          </button>
        </div>`;
      item.appendChild(header);
      item.appendChild(content);
      list.appendChild(item);
      if (ex.type === "quiz") {
        // esconder editor e botões de código
        content.querySelector("div.mb-4")?.classList.add("hidden");
        content.querySelector(`[data-run="${ex.id}"]`)?.classList.add("hidden");
        content
          .querySelector(`[data-reset="${ex.id}"]`)
          ?.classList.add("hidden");

        // contentor e render do quiz
        const quizDiv = document.createElement("div");
        quizDiv.className = "mt-2";
        content.appendChild(quizDiv);
        renderQuizContent(ex, quizDiv);
      }

      const ta = content.querySelector("textarea");
      if (ex.type === "quiz") {
        // para quizzes a textarea fica escondida noutro ramo, portanto nada a fazer aqui
      } else {
        const saved = progress[ex.id]?.code;
        const looksLikeQuiz =
          typeof saved === "string" && saved.startsWith("QUIZ_VF");
        ta.value = looksLikeQuiz ? ex.starter : saved ?? ex.starter;
      }

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

  // RNG estável por aluno+exercício (baralha perguntas/ordem sem “dar azar”)
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuizContent(ex, container) {
    const studentId = localStorage.getItem("mini-tests:student") || "0";
    const seed = Number(studentId) + ex.id * 1009;
    const rng = mulberry32(seed);

    const qs = seededShuffle(ex.questions, rng);
    const state = {
      answers: {},
      startedAt: null,
      remaining: ex.durationSec || 60,
      timerId: null,
      finished: false,
      timerStarted: false,
    };

    container.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm text-slate-600">Precisas de ${Math.round(
        (ex.minScore || 0.7) * 100
      )}% para passar.</div>
      <div id="quiz-timer-${
        ex.id
      }" class="font-mono text-sm bg-slate-200 rounded px-2 py-1">Clica numa resposta para começar</div>
    </div>
    <div id="quiz-qs-${ex.id}" class="space-y-3"></div>
    <div class="mt-4 flex gap-3">
      <button id="quiz-submit-${
        ex.id
      }" class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2" >Submeter</button>
      <button id="quiz-reset-${
        ex.id
      }" class="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg">Repor</button>
    </div>
  `;

    const list = container.querySelector(`#quiz-qs-${ex.id}`);
    qs.forEach((q, idx) => {
      const row = document.createElement("div");
      row.className = "p-3 rounded-xl bg-white border border-slate-200";
      row.innerHTML = `
      <div class="mb-2"><span class="font-semibold">Q${idx + 1}.</span> ${
        q.text
      }</div>
      <div class="flex gap-2">
        <button data-a="true"  data-q="${
          q.id
        }" class="px-3 py-1 rounded bg-green-50 hover:bg-green-100 border border-green-200">V</button>
        <button data-a="false" data-q="${
          q.id
        }" class="px-3 py-1 rounded bg-red-50 hover:bg-red-100 border border-red-200">F</button>
      </div>
    `;
      list.appendChild(row);
    });

    // timer functions
    const timerEl = container.querySelector(`#quiz-timer-${ex.id}`);
    function startTimer() {
      if (state.timerStarted || state.finished) return;
      state.timerStarted = true;
      state.startedAt = Date.now();

      function tick() {
        const m = Math.floor(state.remaining / 60);
        const s = state.remaining % 60;
        timerEl.textContent = `${String(m).padStart(2, "0")}:${String(
          s
        ).padStart(2, "0")}`;
        if (state.remaining <= 0) {
          finish(true);
          return;
        }
        state.remaining -= 1;
      }

      state.timerId = setInterval(tick, 1000);
      tick(); // show initial time
    }

    // captação de respostas
    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-q]");
      if (!btn || state.finished) return;

      // Start timer on first click
      startTimer();

      const qid = btn.getAttribute("data-q");
      const val = btn.getAttribute("data-a") === "true";
      state.answers[qid] = val;
      // feedback visual simples
      const siblings = list.querySelectorAll(`button[data-q="${qid}"]`);
      siblings.forEach((b) => b.classList.remove("ring-2", "ring-indigo-400"));
      btn.classList.add("ring-2", "ring-indigo-400");
    });

    // submit/reset
    container
      .querySelector(`#quiz-submit-${ex.id}`)
      .addEventListener("click", () => finish(false));
    container
      .querySelector(`#quiz-reset-${ex.id}`)
      .addEventListener("click", () => {
        clearInterval(state.timerId);
        renderQuizContent(ex, container); // re-render
      });

    const resBox = document.getElementById("exec-results");
    const logsBox = document.getElementById("exec-logs");

    function finish(byTimeout) {
      if (state.finished) return;
      state.finished = true;
      clearInterval(state.timerId);

      // correção
      let correct = 0;
      const detail = [];
      for (const q of qs) {
        const ans = state.answers[q.id];
        const ok = ans === q.answer;
        if (ok) correct++;
        detail.push({ id: q.id, ok, expected: q.answer, given: ans });
      }
      const score = qs.length ? correct / qs.length : 0;
      const passed = score >= (ex.minScore || 0.7);

      // feedback UI
      resBox.innerHTML = "";
      const msg = document.createElement("div");
      msg.className = `px-3 py-2 rounded mb-2 ${
        passed ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`;
      msg.textContent =
        `Acertaste ${correct}/${qs.length} (${Math.round(score * 100)}%). ${
          passed ? "Passou ✅" : "Não passou ❌"
        }` + (byTimeout ? " (tempo esgotado)" : "");
      resBox.appendChild(msg);

      const issues = detail.filter((d) => !d.ok);
      if (issues.length) {
        issues.forEach((d) => {
          const it = document.createElement("div");
          it.className =
            "text-sm px-3 py-2 rounded mb-2 bg-yellow-50 text-yellow-800";
          it.textContent = `Falhou ${d.id}: esperado ${
            d.expected ? "V" : "F"
          }, respondido ${d.given === undefined ? "—" : d.given ? "V" : "F"}`;
          resBox.appendChild(it);
        });
      }
      logsBox.textContent = "";

      // grava progresso + submission (reaproveita as tuas funções)
      const summaryCode = `QUIZ_VF respostas=${JSON.stringify(
        state.answers
      )} score=${score}`;
      markProgress(ex.id, passed, summaryCode);
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

  function markProgress(id, passed, payload) {
    const p = loadProgress();
    const attempts = (p[id]?.attempts || 0) + 1;
    const prev = p[id] || {};
    const next = { ...prev, passed, attempts };

    if (typeof payload === "string") {
      // exercícios de código
      next.kind = "code";
      next.code = payload;
    } else if (payload && payload.quiz) {
      // quizzes
      next.kind = "quiz";
      next.quiz = payload.quiz;
    }

    p[id] = next;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    renderExercises();

    const codeToSend =
      typeof payload === "string" ? payload : JSON.stringify(payload);
    sendSubmissionToAPI(id, codeToSend, passed, attempts);
  }

  async function sendSubmissionToAPI(exerciseId, code, passed, attempts) {
    try {
      const studentId = localStorage.getItem(STORAGE_KEY);
      if (!studentId) return;

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          exerciseId,
          code,
          passed,
          attempts,
        }),
      });

      if (!response.ok) {
        console.warn("Failed to save submission to server");
      }
    } catch (error) {
      console.warn("Error sending submission to API:", error);
      // Don't show error to user, just log it
    }
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
