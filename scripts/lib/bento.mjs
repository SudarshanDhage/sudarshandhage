import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, round, wrapText } from './text.mjs';

const WIDTH = 1000;
const COLUMNS = 3;
const GAP = 14;
const BODY_FONT = 13.5;
const LINE_HEIGHT = 20;

export function renderBento(profile, theme) {
  const tileWidth = round((WIDTH - GAP * (COLUMNS - 1)) / COLUMNS);
  const textWidth = tileWidth - 40;

  const tiles = profile.tiles.map((tile) => ({
    label: tile.label,
    lines: tile.lines.flatMap((line) => wrapText(line, BODY_FONT, textWidth))
  }));

  const maxLines = Math.max(...tiles.map((tile) => tile.lines.length));
  const tileHeight = round(74 + maxLines * LINE_HEIGHT);
  const rows = Math.ceil(tiles.length / COLUMNS);
  const height = round(rows * tileHeight + (rows - 1) * GAP);

  const markup = tiles
    .map((tile, index) => {
      const column = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      const x = round(column * (tileWidth + GAP));
      const y = round(row * (tileHeight + GAP));
      const delay = round(0.1 + index * 0.09);

      const body = tile.lines
        .map(
          (line, lineIndex) =>
            `      <text x="${x + 20}" y="${round(y + 70 + lineIndex * LINE_HEIGHT)}" font-family="${sansStack}" font-size="${BODY_FONT}" fill="${theme.textMuted}">${escapeXml(line)}</text>`
        )
        .join('\n');

      return `    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${delay}s" dur="0.55s" fill="freeze" />
      <animateTransform attributeName="transform" type="translate" values="0 10; 0 0" begin="${delay}s" dur="0.55s" fill="freeze" />
      <rect x="${x + 0.5}" y="${y + 0.5}" width="${tileWidth - 1}" height="${tileHeight - 1}" rx="14" fill="${theme.surface}" stroke="${theme.border}" />
      <text x="${x + 20}" y="${y + 34}" font-family="${sansStack}" font-size="14.5" font-weight="700" fill="${theme.text}">${escapeXml(tile.label)}</text>
      <text x="${round(x + tileWidth - 20)}" y="${y + 34}" text-anchor="end" font-family="${monoStack}" font-size="11" fill="${theme.borderStrong}">${String(index + 1).padStart(2, '0')}</text>
      <rect x="${x + 20}" y="${y + 44}" width="0" height="2" rx="1" fill="url(#accent)">
        <animate attributeName="width" values="0;26" begin="${round(delay + 0.2)}s" dur="0.5s" fill="freeze" />
      </rect>
${body}
    </g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="What I am working on and care about">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
  </defs>

${markup}
</svg>
`;
}
