import { monoStack, sansStack } from './themes.mjs';
import { escapeXml, measureText, round } from './text.mjs';

const WIDTH = 1000;
const HEIGHT = 250;
const PADDING = 48;
const ROLE_SECONDS = 3;
const FADE_SECONDS = 0.3;

function keyframeTrack(index, total) {
  const cycle = total * ROLE_SECONDS;
  const start = (index * ROLE_SECONDS) / cycle;
  const end = ((index + 1) * ROLE_SECONDS) / cycle;
  const fade = FADE_SECONDS / cycle;

  const frames = [
    [0, 0],
    [start, 0],
    [start + fade, 1],
    [end - fade, 1],
    [end, 0],
    [1, 0]
  ];

  const deduped = [];
  for (const [time, value] of frames) {
    if (deduped.length > 0 && round(deduped[deduped.length - 1][0]) === round(time)) {
      deduped[deduped.length - 1] = [time, value];
      continue;
    }
    deduped.push([time, value]);
  }

  return {
    keyTimes: deduped.map(([time]) => round(time)).join(';'),
    values: deduped.map(([, value]) => value).join(';'),
    dur: cycle
  };
}

function rotatingRoles(roles, x, y, fontSize) {
  const cycle = roles.length * ROLE_SECONDS;
  const texts = roles
    .map((role, index) => {
      const track = keyframeTrack(index, roles.length);
      return `    <text x="${x}" y="${y}" opacity="0" font-family="${sansStack}" font-size="${fontSize}" font-weight="600" fill="url(#accent)">${escapeXml(role)}<animate attributeName="opacity" values="${track.values}" keyTimes="${track.keyTimes}" dur="${track.dur}s" repeatCount="indefinite" /></text>`;
    })
    .join('\n');

  const caretPositions = roles
    .map((role) => round(x + measureText(role, fontSize, { bold: true }) + 6))
    .join(';');
  const caretTimes = roles.map((_, index) => round(index / roles.length)).join(';');

  const caret = `    <rect x="${x}" y="${y - fontSize + 3}" width="2.5" height="${fontSize + 2}" rx="1.25" fill="url(#accent)">
      <animate attributeName="x" values="${caretPositions}" keyTimes="${caretTimes}" calcMode="discrete" dur="${cycle}s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;1;0.05;0.05;1" dur="1.1s" repeatCount="indefinite" />
    </rect>`;

  return `${texts}\n${caret}`;
}

function orbitMotif(theme, cx, cy) {
  const rings = [
    { rx: 74, ry: 74, dur: 26, opacity: 0.5 },
    { rx: 54, ry: 54, dur: 18, opacity: 0.75 },
    { rx: 34, ry: 34, dur: 11, opacity: 1 }
  ];

  const drawn = rings
    .map(
      (ring) => `    <g transform="translate(${cx} ${cy})" opacity="${ring.opacity}">
      <circle r="${ring.rx}" fill="none" stroke="${theme.border}" stroke-width="1" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${ring.dur}s" repeatCount="indefinite" />
        <circle cx="${ring.rx}" cy="0" r="3.5" fill="url(#accent)" />
      </g>
    </g>`
    )
    .join('\n');

  return `${drawn}
    <circle cx="${cx}" cy="${cy}" r="7" fill="url(#accent)">
      <animate attributeName="r" values="6;9;6" dur="3.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="url(#accent)" stroke-width="1">
      <animate attributeName="r" values="12;30;12" dur="3.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.55;0;0.55" dur="3.4s" repeatCount="indefinite" />
    </circle>`;
}

export function renderHero(profile, theme) {
  const handle = `@${profile.handle}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(profile.name)} — ${escapeXml(profile.tagline)}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.accentFrom}" stop-opacity="${theme.glowOpacity}" />
      <stop offset="100%" stop-color="${theme.accentFrom}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.accentTo}" stop-opacity="${theme.glowOpacity}" />
      <stop offset="100%" stop-color="${theme.accentTo}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0V26" fill="none" stroke="${theme.border}" stroke-width="1" opacity="${theme.gridOpacity}" />
    </pattern>
    <clipPath id="card">
      <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" rx="18" />
    </clipPath>
  </defs>

  <g clip-path="url(#card)">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.surface}" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />
    <circle cx="120" cy="40" r="230" fill="url(#glowA)">
      <animateTransform attributeName="transform" type="translate" values="0 0; 90 40; -30 20; 0 0" dur="18s" repeatCount="indefinite" />
    </circle>
    <circle cx="880" cy="220" r="240" fill="url(#glowB)">
      <animateTransform attributeName="transform" type="translate" values="0 0; -70 -50; 40 -10; 0 0" dur="22s" repeatCount="indefinite" />
    </circle>

${orbitMotif(theme, 838, 125)}

    <rect x="${PADDING}" y="52" width="46" height="3" rx="1.5" fill="url(#accent)">
      <animate attributeName="width" values="0;46" dur="0.9s" fill="freeze" />
    </rect>

    <text x="${PADDING}" y="108" font-family="${sansStack}" font-size="44" font-weight="700" fill="${theme.text}" letter-spacing="-0.5">${escapeXml(profile.name)}</text>

${rotatingRoles(profile.roles, PADDING, 148, 21)}

    <text x="${PADDING}" y="184" font-family="${sansStack}" font-size="15" fill="${theme.textMuted}">${escapeXml(profile.tagline)}</text>
    <text x="${PADDING}" y="214" font-family="${monoStack}" font-size="13" fill="${theme.textMuted}" opacity="0.85">${escapeXml(handle)}</text>
  </g>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="18" fill="none" stroke="${theme.border}" />
</svg>
`;
}
