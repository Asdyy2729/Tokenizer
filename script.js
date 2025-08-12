// Supported characters (character-level tokenizer)
const chars = "abcdefghijklmnopqrstuvwxyz0123456789 .,!?;:'\"()-_/\n";

// Build mappings
const vocab = new Map();       // char -> token
const reverseVocab = new Map();// token -> char
let idx = 1; // Start tokens at 1 (0 is reserved for unknown)

for (const ch of chars) {
  if (!vocab.has(ch)) {
    vocab.set(ch, idx);
    reverseVocab.set(idx, ch);
    idx++;
  }
}
reverseVocab.set(0, "<unk>"); // unknown token

// Encode: text -> array of tokens
function encode(text) {
  if (typeof text !== "string") return [];
  return Array.from(text.toLowerCase()).map(ch => vocab.get(ch) ?? 0);
}

// Decode: tokens -> text
function decode(tokens) {
  if (!Array.isArray(tokens)) return "";
  return tokens.map(t => {
    const n = Number(t);
    if (!Number.isFinite(n)) return "<err>";
    return reverseVocab.get(n) ?? "<unk>";
  }).join("");
}

// Parse tokens from string (JSON, comma, or space separated)
function parseTokensInput(str) {
  str = String(str).trim();
  if (str === "") return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.map(x => Number(x));
  } catch (e) { /* ignore */ }
  return str.split(/[\s,]+/).filter(p => p.length > 0).map(p => Number(p));
}

// DOM elements
const inputText = document.getElementById("inputText");
const btnEncode = document.getElementById("btnEncode");
const encodedTokensEl = document.getElementById("encodedTokens");
const decodedFromEncodedEl = document.getElementById("decodedFromEncoded");
const tokensInput = document.getElementById("tokensInput");
const btnDecodeTokens = document.getElementById("btnDecodeTokens");
const decodedTokensResult = document.getElementById("decodedTokensResult");

// Encode button click
btnEncode.addEventListener("click", () => {
  const text = inputText.value;
  const tokens = encode(text);
  encodedTokensEl.textContent = JSON.stringify(tokens);
  decodedFromEncodedEl.textContent = decode(tokens);
  tokensInput.value = JSON.stringify(tokens);
});

// Decode tokens button click
btnDecodeTokens.addEventListener("click", () => {
  const raw = tokensInput.value;
  const parsed = parseTokensInput(raw);
  const tokens = parsed.filter(n => !Number.isNaN(n));
  decodedTokensResult.textContent = decode(tokens);
});

// Auto-fill with example
inputText.value = "Hello, World!";
btnEncode.click();
