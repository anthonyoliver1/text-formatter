/** Registro do Service Worker */ 

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js')
      .then(reg => console.log('SW registrado:', reg))
      .catch(err => console.log('Falha ao registrar SW:', err));
  });
}

/** Inicio da aplicação*/

const textarea = document.getElementById("texto");
const button = document.getElementById("copiar");
const toast = document.getElementById("toast");
const lenHint = document.getElementById("lenHint");

const lenHintWithoutScapeSequence = document.getElementById(
  "lenHintWithoutScapeSequence"
);
const buttonWithoutScapeSequence = document.getElementById(
  "copy-without-scape-sequence"
);
const textareaScapeSequence = document.getElementById(
  "text-with-escape-sequence"
);

const preview1 = document.getElementById("preview1");
const previewContent1 = document.getElementById("preview-content1");

const preview = document.getElementById("preview");
const previewContent = document.getElementById("preview-content");

// Atualiza o preview interpretando os escapes
function updatePreview() {
  let text = textareaScapeSequence.value;
  text = text.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  preview.textContent = text;

  buttonWithoutScapeSequence.disabled = !text.length;
  previewContent.style.display = !text.length ? "none" : "block";
}

textareaScapeSequence.addEventListener("input", updatePreview);
updatePreview();

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1600);
}

function updateLen() {
  const len = textarea.value.length;
  lenHint.textContent = `${len} ${len === 1 ? "caractere" : "caracteres"}`;

  button.disabled = !len;
  previewContent1.style.display = !len ? "none" : "block";
  preview1.textContent = textarea.value;
}
textarea.addEventListener("input", updateLen);
updateLen();

function updateLenWithoutScapeSequence() {
  const len = textareaScapeSequence.value.length;
  lenHintWithoutScapeSequence.textContent = `${len} ${len === 1 ? "caractere" : "caracteres"
    }`;
}
textareaScapeSequence.addEventListener("input", updateLenWithoutScapeSequence);
updateLenWithoutScapeSequence();

// Permite Tab dentro do textarea
textarea.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;

    this.value =
      this.value.substring(0, start) + "\t" + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
    updateLen();
  }
});

// Converte quebras reais e tabs em sequências de escape visíveis
function toEscaped(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r");
}

function toEscaped2(text) {
  return text
    .replace(/\\\\/g, "\\\\")
    .replace(/\\n/g, "\\n")
    .replace(/\\t/g, "\\t")
    .replace(/\\r/g, "\\r");
}

// Converte quebras reais e tabs em sequências de escape visíveis
function removeEscaped(text) {
  return text.replace(/\\[ntr\\]/g, " ");
}

async function copyPlainText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const sel = document.getSelection();
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(helper);
    if (sel) sel.removeAllRanges();
  }
  return true;
}

async function copyPlain(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const sel = document.getSelection();
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(helper);
    if (sel) sel.removeAllRanges();
  }
  return true;
}

button.addEventListener("click", async () => {
  const rawText = textarea.value;
  const escapedText = toEscaped(rawText);
  try {
    await copyPlainText(escapedText);
    showToast("Texto com escapes copiado!");
    button.textContent = "Copiado!";
    setTimeout(() => (button.textContent = "Copiar"), 1200);
  } catch (err) {
    console.error(err);
    showToast("Não foi possível copiar.");
  }
});

buttonWithoutScapeSequence.addEventListener("click", async () => {
  const rawText = textareaScapeSequence.value;
  const escapedText = removeEscaped(rawText);
  try {
    await copyPlain(escapedText);
    showToast("Texto sem escapes copiado!");
    buttonWithoutScapeSequence.textContent = "Copiado!";
    setTimeout(() => (buttonWithoutScapeSequence.textContent = "Copiar"), 1200);
  } catch (err) {
    console.error(err);
    showToast("Não foi possível copiar.");
  }
});
