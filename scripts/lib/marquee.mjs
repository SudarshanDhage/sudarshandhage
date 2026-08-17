import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, measureText, round } from './text.mjs';

const WIDTH = 1000;
const HEADER = 52;
const ROW_HEIGHT = 38;
const ROW_GAP = 12;
const PADDING = 22;
const FONT = 13;
const CHIP_GAP = 10;
const PIXELS_PER_SECOND = 34;

function chipRun(items, theme, rowIndex) {
  const chips = items.map((item) => ({
    item,
    width: round(measureText(item, FONT) + 40)
  }));
  const runWidth = round(chips.reduce((total, chip) => total + chip.width + CHIP_GAP, 0));
  const copies = Math.ceil((WIDTH * 2) / runWidth) + 1;

  const markup = [];
  for (let copy = 0; copy < copies; copy += 1) {
    let x = copy * runWidth;
    for (const chip of chips) {
      markup.push(
        `      <g>
        <rect x="${round(x)}" y="0" width="${chip.width}" height="${ROW_HEIGHT}" rx="10" fill="${theme.surfaceRaised}" stroke="${theme.border}" />
        <circle cx="${round(x + 15)}" cy="${ROW_HEIGHT / 2}" r="3" fill="url(#accent)" />
        <text x="${round(x + 26)}" y="${ROW_HEIGHT / 2 + 4.5}" font-family="${sansStack}" font-size="${FONT}" font-weight="500" fill="${theme.text}">${escapeXml(chip.item)}</text>
      </g>`
      );
      x += chip.width + CHIP_GAP;
    }
  }

  const duration = round(runWidth / PIXELS_PER_SECOND);
  const from = rowIndex % 2 === 0 ? 0 : -runWidth;
  const to = rowIndex % 2 === 0 ? -runWidth : 0;
  const y = HEADER + rowIndex * (ROW_HEIGHT + ROW_GAP);

  return `    <g transform="translate(0 ${y})" mask="url(#fade)">
      <g>
        <animateTransform attributeName="transform" type="translate" from="${from} 0" to="${to} 0" dur="${duration}s" repeatCount="indefinite" />
${markup.join('\n')}
      </g>
    </g>`;
}

export function renderMarquee(profile, theme) {
  const rows = profile.marquee.map((items, index) => chipRun(items, theme, index));
  const height = round(HEADER + profile.marquee.length * (ROW_HEIGHT + ROW_GAP) - ROW_GAP + PADDING);
  const total = profile.marquee.reduce((count, items) => count + items.length, 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="Technologies I work with">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
    <linearGradient id="fadeGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000000" />
      <stop offset="11%" stop-color="#ffffff" />
      <stop offset="89%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <mask id="fade">
      <rect x="0" y="0" width="${WIDTH}" height="${ROW_HEIGHT}" fill="url(#fadeGradient)" />
    </mask>
    <clipPath id="board">
      <rect x="1" y="1" width="${WIDTH - 2}" height="${height - 2}" rx="14" />
    </clipPath>
  </defs>

  <g clip-path="url(#board)">
    <rect width="${WIDTH}" height="${height}" fill="${theme.surface}" />
    <rect x="22" y="24" width="4" height="14" rx="2" fill="url(#accent)" />
    <text x="38" y="36" font-family="${sansStack}" font-size="14" font-weight="700" letter-spacing="0.2" fill="${theme.text}">Stack in rotation</text>
    <text x="${WIDTH - 22}" y="36" text-anchor="end" font-family="${monoStack}" font-size="11" letter-spacing="1" fill="${theme.textMuted}">${total} TECHNOLOGIES</text>

${rows.join('\n')}
  </g>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="14" fill="none" stroke="${theme.border}" />
</svg>
`;
}
