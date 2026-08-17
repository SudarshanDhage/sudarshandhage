import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, measureText, round } from './text.mjs';

const WIDTH = 1000;
const PADDING = 26;
const HEADER_HEIGHT = 46;
const FONT = 13.5;
const LINE_HEIGHT = 25;
const BLOCK_GAP = 12;
const TYPE_SPEED = 0.024;

export function renderNow(profile, theme) {
  const left = PADDING + 12;
  const blocks = [];
  let y = HEADER_HEIGHT + 30;
  let clock = 0.25;

  profile.now.forEach((entry, index) => {
    const typeDuration = round(Math.max(0.35, entry.command.length * TYPE_SPEED));
    const commandWidth = round(measureText(entry.command, FONT, { mono: true }) + 4);
    const clipId = `type-${index}`;
    const promptWidth = round(measureText('$ ', FONT, { mono: true }));

    blocks.push(`    <clipPath id="${clipId}">
      <rect x="${round(left + promptWidth)}" y="${round(y - FONT)}" width="0" height="${FONT + 6}">
        <animate attributeName="width" values="0;${commandWidth}" begin="${round(clock)}s" dur="${typeDuration}s" fill="freeze" />
      </rect>
    </clipPath>
    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${round(clock)}s" dur="0.12s" fill="freeze" />
      <text x="${left}" y="${round(y)}" font-family="${monoStack}" font-size="${FONT}" fill="url(#accent)">$</text>
      <text x="${round(left + promptWidth)}" y="${round(y)}" clip-path="url(#${clipId})" font-family="${monoStack}" font-size="${FONT}" fill="${theme.text}">${escapeXml(entry.command)}</text>
    </g>`);

    clock += typeDuration + 0.12;
    y += LINE_HEIGHT;

    blocks.push(`    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${round(clock)}s" dur="0.3s" fill="freeze" />
      <text x="${left}" y="${round(y)}" font-family="${monoStack}" font-size="${FONT}" fill="${theme.textMuted}">${escapeXml(entry.output)}</text>
    </g>`);

    clock += 0.3;
    y += LINE_HEIGHT + BLOCK_GAP;
  });

  blocks.push(`    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${round(clock)}s" dur="0.2s" fill="freeze" />
      <text x="${left}" y="${round(y)}" font-family="${monoStack}" font-size="${FONT}" fill="url(#accent)">$</text>
      <rect x="${round(left + measureText('$ ', FONT, { mono: true }))}" y="${round(y - FONT + 2)}" width="8" height="${FONT + 1}" fill="${theme.accentSolid}">
        <animate attributeName="opacity" values="1;1;0.05;0.05;1" dur="1.1s" repeatCount="indefinite" />
      </rect>
    </g>`);

  const height = round(y + PADDING + 10);
  const dots = ['#ff5f57', '#febc2e', '#28c840']
    .map((color, index) => `  <circle cx="${PADDING + 6 + index * 18}" cy="23" r="5.5" fill="${color}" opacity="0.9" />`)
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="What I am working on right now">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
    <clipPath id="window">
      <rect x="1" y="1" width="${WIDTH - 2}" height="${height - 2}" rx="18" />
    </clipPath>
  </defs>

  <g clip-path="url(#window)">
    <rect width="${WIDTH}" height="${height}" fill="${theme.surface}" />
    <rect width="${WIDTH}" height="${HEADER_HEIGHT}" fill="${theme.surfaceRaised}" />
    <line x1="0" y1="${HEADER_HEIGHT}" x2="${WIDTH}" y2="${HEADER_HEIGHT}" stroke="${theme.border}" />
${dots}
    <text x="${WIDTH / 2}" y="27" text-anchor="middle" font-family="${sansStack}" font-size="12.5" font-weight="600" fill="${theme.textMuted}">${escapeXml(profile.handle.toLowerCase())} — ~/now</text>

${blocks.join('\n')}
  </g>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="18" fill="none" stroke="${theme.border}" />
</svg>
`;
}
