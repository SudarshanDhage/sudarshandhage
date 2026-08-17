import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, measureText, round } from './text.mjs';

const WIDTH = 1000;
const PADDING = 32;
const LABEL_COLUMN = 196;
const CHIP_HEIGHT = 30;
const CHIP_GAP = 9;
const LINE_GAP = 10;
const ROW_GAP = 20;
const HEADER_HEIGHT = 64;
const CHIP_FONT = 13;

function chipWidth(label) {
  return round(measureText(label, CHIP_FONT) + 28);
}

function wrapChips(items, maxWidth) {
  const lines = [[]];
  let used = 0;

  for (const item of items) {
    const width = chipWidth(item);
    const needed = used === 0 ? width : used + CHIP_GAP + width;
    if (needed > maxWidth && used > 0) {
      lines.push([{ item, width }]);
      used = width;
      continue;
    }
    lines[lines.length - 1].push({ item, width });
    used = needed;
  }

  return lines;
}

export function renderStack(profile, theme) {
  const chipArea = WIDTH - PADDING * 2 - LABEL_COLUMN;
  const rows = profile.stack.map((group) => ({
    label: group.label,
    lines: wrapChips(group.items, chipArea)
  }));

  const body = [];
  let cursor = HEADER_HEIGHT;
  let chipIndex = 0;

  rows.forEach((row, rowIndex) => {
    const rowHeight = row.lines.length * CHIP_HEIGHT + (row.lines.length - 1) * LINE_GAP;

    if (rowIndex > 0) {
      body.push(
        `    <line x1="${PADDING}" y1="${round(cursor - ROW_GAP / 2)}" x2="${WIDTH - PADDING}" y2="${round(cursor - ROW_GAP / 2)}" stroke="${theme.border}" stroke-width="1" opacity="0.75" />`
      );
    }

    body.push(
      `    <text x="${PADDING}" y="${round(cursor + 20)}" font-family="${sansStack}" font-size="12" font-weight="700" letter-spacing="1.4" fill="${theme.textMuted}">${escapeXml(row.label.toUpperCase())}</text>`
    );

    row.lines.forEach((line, lineIndex) => {
      let x = PADDING + LABEL_COLUMN;
      const y = cursor + lineIndex * (CHIP_HEIGHT + LINE_GAP);

      for (const chip of line) {
        const delay = round(chipIndex * 0.035);
        body.push(
          `    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${delay}s" dur="0.45s" fill="freeze" />
      <animateTransform attributeName="transform" type="translate" values="0 8; 0 0" begin="${delay}s" dur="0.45s" fill="freeze" />
      <rect x="${round(x)}" y="${round(y)}" width="${chip.width}" height="${CHIP_HEIGHT}" rx="9" fill="${theme.chipFill}" stroke="${theme.border}" />
      <text x="${round(x + chip.width / 2)}" y="${round(y + CHIP_HEIGHT / 2 + 4.5)}" text-anchor="middle" font-family="${sansStack}" font-size="${CHIP_FONT}" font-weight="500" fill="${theme.chipText}">${escapeXml(chip.item)}</text>
    </g>`
        );
        x += chip.width + CHIP_GAP;
        chipIndex += 1;
      }
    });

    cursor += rowHeight + ROW_GAP;
  });

  const height = round(cursor + PADDING - ROW_GAP + 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="Technical toolkit">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
  </defs>

  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="18" fill="${theme.surface}" stroke="${theme.border}" />
  <rect x="${PADDING}" y="30" width="4" height="18" rx="2" fill="url(#accent)" />
  <text x="${PADDING + 16}" y="45" font-family="${sansStack}" font-size="16" font-weight="700" fill="${theme.text}">Technical toolkit</text>
  <text x="${WIDTH - PADDING}" y="45" text-anchor="end" font-family="${monoStack}" font-size="12" fill="${theme.textMuted}">day-to-day tools</text>

${body.join('\n')}
</svg>
`;
}
