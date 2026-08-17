import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, measureText, round, wrapText } from './text.mjs';

const WIDTH = 1000;
const HEIGHT = 232;
const PADDING = 46;
const META_X = 632;

function metaRows(profile, theme) {
  return profile.meta
    .map((row, index) => {
      const y = 84 + index * 46;
      const delay = round(0.5 + index * 0.14);
      return `    <g opacity="0">
      <animate attributeName="opacity" values="0;1" begin="${delay}s" dur="0.5s" fill="freeze" />
      <animateTransform attributeName="transform" type="translate" values="10 0; 0 0" begin="${delay}s" dur="0.5s" fill="freeze" />
      <rect x="${META_X}" y="${y - 9}" width="5" height="5" fill="url(#accent)" />
      <text x="${META_X + 16}" y="${y - 4}" font-family="${monoStack}" font-size="11" letter-spacing="1.2" fill="${theme.textMuted}">${escapeXml(row.key.toUpperCase())}</text>
      <text x="${META_X + 16}" y="${y + 16}" font-family="${sansStack}" font-size="14.5" font-weight="500" fill="${theme.text}">${escapeXml(row.value)}</text>
    </g>`;
    })
    .join('\n');
}

function roleLine(profile, theme, y) {
  const fontSize = 14;
  let x = PADDING;
  const parts = [];

  profile.roles.forEach((role, index) => {
    if (index > 0) {
      parts.push(
        `    <text x="${round(x)}" y="${y}" font-family="${monoStack}" font-size="${fontSize}" fill="${theme.borderStrong}">/</text>`
      );
      x += measureText('/  ', fontSize, { mono: true });
    }
    parts.push(
      `    <text x="${round(x)}" y="${y}" font-family="${monoStack}" font-size="${fontSize}" fill="${theme.textMuted}">${escapeXml(role)}</text>`
    );
    x += measureText(`${role}  `, fontSize, { mono: true });
  });

  const lineWidth = round(x - PADDING);
  return { markup: parts.join('\n'), width: lineWidth };
}

export function renderBanner(profile, theme) {
  const role = roleLine(profile, theme, 152);
  const taglineLines = wrapText(profile.tagline, 15, 540).slice(0, 2);
  const tagline = taglineLines
    .map(
      (line, index) =>
        `    <text x="${PADDING}" y="${188 + index * 21}" font-family="${sansStack}" font-size="15" fill="${theme.textMuted}">${escapeXml(line)}</text>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(profile.name)} — ${escapeXml(profile.tagline)}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accentFrom}" stop-opacity="${theme.washOpacity}" />
      <stop offset="55%" stop-color="${theme.accentTo}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.text}" stop-opacity="0" />
      <stop offset="50%" stop-color="${theme.text}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="${theme.text}" stop-opacity="0" />
    </linearGradient>
    <pattern id="hairlines" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="12" stroke="${theme.border}" stroke-width="1" opacity="${theme.hairlineOpacity}" />
    </pattern>
    <clipPath id="frame">
      <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" rx="14" />
    </clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.surface}" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#hairlines)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)" />

    <rect x="-320" y="0" width="320" height="${HEIGHT}" fill="url(#sheen)" transform="skewX(-18)">
      <animateTransform attributeName="transform" type="translate" values="0 0; ${WIDTH + 460} 0" dur="7s" repeatCount="indefinite" additive="sum" />
    </rect>

    <rect x="0" y="0" width="5" height="${HEIGHT}" fill="url(#accent)" />
    <line x1="${META_X - 44}" y1="42" x2="${META_X - 44}" y2="${HEIGHT - 42}" stroke="${theme.border}" />

    <text x="${PADDING}" y="58" font-family="${monoStack}" font-size="11.5" letter-spacing="2" fill="${theme.textMuted}">${escapeXml(`~/${profile.handle.toLowerCase()}`)}</text>

    <g opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.7s" fill="freeze" />
      <animateTransform attributeName="transform" type="translate" values="0 8; 0 0" dur="0.7s" fill="freeze" />
      <text x="${PADDING}" y="112" font-family="${sansStack}" font-size="46" font-weight="700" letter-spacing="-1.2" fill="${theme.text}">${escapeXml(profile.name)}</text>
    </g>

    <rect x="${PADDING}" y="126" width="0" height="2" fill="url(#accent)">
      <animate attributeName="width" values="0;${role.width}" begin="0.35s" dur="0.8s" fill="freeze" />
    </rect>

${role.markup}
${tagline}
${metaRows(profile, theme)}
  </g>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="14" fill="none" stroke="${theme.border}" />
</svg>
`;
}
