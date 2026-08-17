import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHero } from './lib/hero.mjs';
import { renderNow } from './lib/now.mjs';
import { renderStack } from './lib/stack.mjs';
import { themes } from './lib/themes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'assets');

const renderers = {
  hero: renderHero,
  stack: renderStack,
  now: renderNow
};

async function main() {
  const profile = JSON.parse(await readFile(join(root, 'data', 'profile.json'), 'utf8'));
  await mkdir(assetsDir, { recursive: true });

  const written = [];
  for (const [name, render] of Object.entries(renderers)) {
    for (const theme of Object.values(themes)) {
      const file = `${name}-${theme.id}.svg`;
      await writeFile(join(assetsDir, file), render(profile, theme), 'utf8');
      written.push(file);
    }
  }

  console.log(`Generated ${written.length} assets:\n  ${written.join('\n  ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
