// DompetKeluarga — handover script (Node 22, standard library only).
//
// This file is the entrypoint that hands our household-budget site to the
// grader. The site itself lives in app/ next to this file: plain static
// files (HTML, CSS, ES modules) that any static server can serve, with all
// of its content in its own files — nothing is fetched from the network at
// runtime. The pictures in screenshots/ are real renders of the site in a
// browser; the first one, by name, is the cover image.
//
// What this script does, step by step:
//   1. Work out where to write: /output inside the grader's container, or
//      the directory named by MAKEFUN_OUTPUT_DIR when run locally.
//   2. Copy app/ and (when present) screenshots/ into that directory.
//   3. Build dossier.json with the vendored make.fun library, so the judge
//      gets the cover image, the first load's files and sizes, and a listing
//      of our source. vendor/makefun-frontend.ts must stay untouched: the
//      scorer rebuilds the dossier with its own copy and compares bytes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's caps, from the kit's reference/gate.json. text_max_bytes is
// the only one that shapes the dossier's bytes; the rest mirror the limits
// the scorer would refuse an entry for (at most 4 screenshots, each at most
// 256 KiB; at most 993 files and directories in app/, at most 16 MiB of app
// files — app/ shares /output's own 1000-entry cap with screenshots/ and
// dossier.json).
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  mkdirSync(outputDir, { recursive: true });

  // The site itself. This copy is unconditional: a missing app/ should fail
  // loudly rather than hand in an empty entry.
  cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

  // The screenshots folder is always created, even when there is nothing to
  // put in it yet, so the layout of /output never depends on the pictures.
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  }

  const dossier = buildDossier(outputDir, DOSSIER_LIMITS);
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

handIn();
