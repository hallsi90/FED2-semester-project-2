import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="min-h-screen">
    <header class="border-b border-slate-200 p-4">
      <div class="mx-auto max-w-6xl">
        <h1 class="text-2xl font-bold">Semester Project 2</h1>
      </div>
    </header>

    <main class="mx-auto max-w-6xl p-4">
      <p class="text-base text-slate-700">
        Project setup is ready.
      </p>
    </main>
  </div>
`;
