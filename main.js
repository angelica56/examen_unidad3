(function () {
  const patternInput = document.getElementById('patternInput');
  const flagsInput = document.getElementById('flagsInput');
  const textInput = document.getElementById('textInput');
  const testBtn = document.getElementById('testBtn');
  const clearBtn = document.getElementById('clearBtn');
  const preview = document.getElementById('preview');
  const countEl = document.getElementById('count');
  const matchesList = document.getElementById('matchesList');
  const errorEl = document.getElementById('error');

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
  }

  function buildHighlightedHtml(text, matches) {
    if (matches.length === 0) return escapeHtml(text);

    let out = "";
    let lastIndex = 0;

    matches.forEach(m => {
      out += escapeHtml(text.slice(lastIndex, m.start));
      out += `<span class="match">${escapeHtml(text.slice(m.start, m.end))}</span>`;
      lastIndex = m.end;
    });

    out += escapeHtml(text.slice(lastIndex));
    return out;
  }

  function parsePattern(input, flagsInputValue) {
    let patternText = input.trim();
    let flags = flagsInputValue.trim();

    if (patternText.startsWith("/") && patternText.lastIndexOf("/") > 0) {
      const lastSlash = patternText.lastIndexOf("/");
      flags = patternText.slice(lastSlash + 1);
      patternText = patternText.slice(1, lastSlash);
    }

    return { patternText, flags };
  }

  function findMatches(text, regex) {
    const matches = [];
    let m;

    while ((m = regex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        group: m[0]
      });

      if (m.index === regex.lastIndex) regex.lastIndex++;
    }

    return matches;
  }

  function runTest() {
    errorEl.textContent = '';

    const rawPattern = patternInput.value;
    const rawFlags = flagsInput.value;
    const text = textInput.value || '';

    if (!rawPattern) {
      errorEl.textContent = "Ingresa una expresión regular.";
      return;
    }

    const { patternText, flags } = parsePattern(rawPattern, rawFlags);

    let regex;

    try {
      regex = new RegExp(patternText, flags.includes("g") ? flags : flags + "g");
    } catch (e) {
      errorEl.textContent = "Error en la expresión regular: " + e.message;
      return;
    }

    const matches = findMatches(text, regex);

    countEl.textContent = matches.length;
    matchesList.textContent = JSON.stringify(matches.map(m => m.group), null, 2);
    preview.innerHTML = buildHighlightedHtml(text, matches);
  }

  testBtn.addEventListener("click", runTest);

  clearBtn.addEventListener("click", () => {
    patternInput.value = "";
    flagsInput.value = "";
    textInput.value = "";
    preview.innerHTML = "";
    countEl.textContent = "0";
    matchesList.textContent = "[]";
    errorEl.textContent = "";
  });

})();
