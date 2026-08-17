const WIDE_CHARS = new Set(['m', 'w', 'M', 'W', '@', '%']);
const NARROW_CHARS = new Set(['i', 'l', 'j', 't', 'f', 'r', 'I', '.', ',', ':', ';', "'", '|', ' ']);

/**
 * Font metrics are unavailable when generating SVG offline, so widths are
 * approximated per character class. Layout leaves slack for the error margin.
 */
export function measureText(value, fontSize, { bold = false, mono = false } = {}) {
  if (mono) return value.length * fontSize * 0.6;

  const base = bold ? 0.58 : 0.545;
  let width = 0;
  for (const char of value) {
    if (WIDE_CHARS.has(char)) width += fontSize * (base + 0.28);
    else if (NARROW_CHARS.has(char)) width += fontSize * (base - 0.24);
    else if (char >= 'A' && char <= 'Z') width += fontSize * (base + 0.11);
    else width += fontSize * base;
  }
  return width;
}

export function wrapText(value, fontSize, maxWidth, options = {}) {
  const lines = [];
  let current = '';

  for (const word of value.split(' ')) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (measureText(candidate, fontSize, options) > maxWidth && current !== '') {
      lines.push(current);
      current = word;
      continue;
    }
    current = candidate;
  }

  if (current !== '') lines.push(current);
  return lines;
}

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function round(value) {
  return Math.round(value * 100) / 100;
}
