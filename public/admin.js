(function () {
  const loading = document.getElementById("loading");
  const stats = document.getElementById("stats");
  const submissionsContainer = document.getElementById("submissions-container");
  const studentsList = document.getElementById("students-list");
  const noData = document.getElementById("no-data");

  const exerciseNames = {
    1: "Converter Celsius para Fahrenheit",
    2: "Palíndromos",
    3: "Soma de array",
  };

  async function loadSubmissions() {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();

      loading.classList.add("hidden");

      if (Object.keys(data).length === 0) {
        noData.classList.remove("hidden");
        return;
      }

      displayStats(data);
      displaySubmissions(data);

      stats.classList.remove("hidden");
      submissionsContainer.classList.remove("hidden");
    } catch (error) {
      console.error("Error loading submissions:", error);
      loading.classList.add("hidden");
      noData.classList.remove("hidden");
    }
  }

  function displayStats(data) {
    const students = Object.keys(data);
    let totalSubmissions = 0;
    let completedExercises = 0;

    students.forEach((studentId) => {
      const submissions = data[studentId];
      totalSubmissions += Object.keys(submissions).length;

      Object.values(submissions).forEach((sub) => {
        if (sub.passed) completedExercises++;
      });
    });

    const successRate =
      totalSubmissions > 0
        ? ((completedExercises / totalSubmissions) * 100).toFixed(1)
        : 0;

    document.getElementById("total-students").textContent = students.length;
    document.getElementById("total-submissions").textContent = totalSubmissions;
    document.getElementById("completed-exercises").textContent =
      completedExercises;
    document.getElementById("success-rate").textContent = `${successRate}%`;
  }

  function displaySubmissions(data) {
    const students = Object.keys(data).sort();

    studentsList.innerHTML = students
      .map((studentId) => {
        const submissions = data[studentId];
        const exercisesList = Object.keys(submissions)
          .map((exerciseId) => {
            const sub = submissions[exerciseId];
            const statusClass = sub.passed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800";
            const statusIcon = sub.passed ? "✓" : "✗";
            const timeAgo = formatTimeAgo(new Date(sub.timestamp));

            return `
          <div class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-slate-800">${
                exerciseNames[exerciseId] || `Exercício ${exerciseId}`
              }</h4>
              <span class="${statusClass} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                ${statusIcon} ${sub.passed ? "Completo" : "Incompleto"}
              </span>
            </div>
            <div class="text-sm text-slate-600 mb-3">
              <p><strong>Tentativas:</strong> ${sub.attempts}</p>
              <p><strong>Última submissão:</strong> ${timeAgo}</p>
            </div>
            <details class="text-sm">
              <summary class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">Ver Código</summary>
              <pre class="mt-2 bg-slate-100 border border-slate-200 rounded p-3 overflow-x-auto font-mono text-xs"><code>${escapeHtml(
                sub.code
              )}</code></pre>
            </details>
          </div>
        `;
          })
          .join("");

        const completedCount = Object.values(submissions).filter(
          (s) => s.passed
        ).length;
        const totalCount = Object.keys(submissions).length;
        const progressPercent = totalCount > 0 ? (completedCount / 3) * 100 : 0; // 3 total exercises

        return `
        <div class="mb-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Aluno ${studentId}</h3>
                <p class="text-slate-600">${completedCount}/${3} exercícios completos</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-slate-800">${progressPercent.toFixed(
                0
              )}%</div>
              <div class="text-sm text-slate-600">Progresso</div>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-slate-200 rounded-full h-2 mb-6">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>

          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            ${exercisesList}
          </div>
        </div>
      `;
      })
      .join("");
  }

  function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Auto-refresh every 30 seconds
  loadSubmissions();
  setInterval(loadSubmissions, 30000);
})();
