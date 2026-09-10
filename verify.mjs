#!/usr/bin/env node
/**
 * Verify the installed PDSS preset against the harness itself, not against a checklist.
 *
 * Three questions decide whether an installation works, and each is answered here by
 * the code that will actually answer it at session time:
 *
 *   1. Are the payload files where the roster looks for them?
 *   2. Does the `!!js` expression in `customSkillDirs` resolve to this preset's own
 *      `skills/` directory? The harness mounts a locally authored preset with
 *      `baseUrl` set to the preset's directory, so the shipped `cordis` preset uses
 *      the same expression; it is evaluated here the same way.
 *   3. Does `discoverPresets` — the installed roster, the one the preset picker reads —
 *      list this preset as healthy? A healthy row carries no `broken` key; a `broken`
 *      row is one the harness refuses to compose a session from.
 *
 * What this script cannot check is that a live session's skill catalog shows the five
 * skills: presets are mounted by the web/desktop session path, so that step needs a
 * session. See README "验收" for the one-line way to close it.
 *
 * Usage:
 *   node verify.mjs                # verify the installed preset under $DSH_HOME
 *   node verify.mjs --source       # verify this repository's payload instead
 *   node verify.mjs --root <dir>   # verify a specific preset directory
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PRESET_ID = 'pdss'
const USER_PRESET_DIR = '.agent-presets'

const here = dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const wantSource = argv.includes('--source')
const rootFlag = argv.indexOf('--root')

/**
 * Resolve the DSH home the way the harness does: an explicit `$DSH_HOME` wins,
 * a blank one counts as unset, and the default is `~/.dsh`.
 * @returns the absolute DSH home directory.
 */
function dshHome() {
  const fromEnv = (process.env.DSH_HOME ?? '').trim()
  return fromEnv === '' ? join(homedir(), '.dsh') : resolve(fromEnv)
}

const presetDir = rootFlag === -1
  ? (wantSource ? join(here, PRESET_ID) : join(dshHome(), USER_PRESET_DIR, PRESET_ID))
  : resolve(argv[rootFlag + 1])

const results = []
/**
 * Record one check outcome.
 * @param name - what was checked.
 * @param state - PASS, FAIL, or SKIP.
 * @param detail - the observation behind the verdict.
 */
function record(name, state, detail) {
  results.push({ name, state, detail })
  process.stdout.write(`${state.padEnd(5)} ${name}\n      ${detail}\n`)
}

process.stdout.write(`pdss-preset-verify\n  preset dir : ${presetDir}\n\n`)

// 1. Payload files.
const composition = join(presetDir, 'agent.cordis.yml')
const metadata = join(presetDir, 'preset.yml')
const skillsDir = join(presetDir, 'skills')
if (!existsSync(composition)) {
  record('payload', 'FAIL', `no agent.cordis.yml at ${composition} — run install.mjs first`)
} else {
  let skillCount = 0
  if (existsSync(skillsDir) && statSync(skillsDir).isDirectory()) {
    for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md'))) skillCount += 1
    }
  }
  record(
    'payload',
    existsSync(metadata) && skillCount > 0 ? 'PASS' : 'FAIL',
    `composition yes, preset.yml ${existsSync(metadata) ? 'yes' : 'MISSING'}, skills with SKILL.md: ${skillCount}`,
  )
}

// 2. The `!!js` expression in customSkillDirs, evaluated with the harness's own scope.
const source = existsSync(composition) ? readFileSync(composition, 'utf8') : ''
const expression = /customSkillDirs:\s*\n\s*-\s*!!js\s*"(?<expr>[^"]+)"/.exec(source)?.groups?.expr
if (expression === undefined) {
  record('customSkillDirs', 'SKIP', 'no single-line `- !!js "..."` entry under customSkillDirs to evaluate')
} else {
  try {
    // `vendor/include/src/index.ts` sets this before a composition's rows run:
    //   this.ctx.baseUrl = new URL('.', pathToFileURL(this.filename)).href
    // The trailing slash is load-bearing: `new URL('skills/', ...)` against a base
    // without one replaces the preset's own directory segment instead of descending.
    const baseUrl = new URL('.', pathToFileURL(composition)).href
    const resolved = new Function('baseUrl', `return (${expression})`)(baseUrl)
    const ok = typeof resolved === 'string' && existsSync(resolved) && statSync(resolved).isDirectory()
    record(
      'customSkillDirs',
      ok ? 'PASS' : 'FAIL',
      `baseUrl ${baseUrl}\n      → ${resolved}${ok ? '' : '  (not a directory)'}`,
    )
  } catch (error) {
    record('customSkillDirs', 'FAIL', `expression threw: ${error.message}`)
  }
}

// 3. The installed roster's own verdict.
const searchDirs = [
  join(dshHome(), 'profiles', 'node_modules', '@deepseek-ai', 'dsh-agent-presets'),
  join(here, 'node_modules', '@deepseek-ai', 'dsh-agent-presets'),
]
const packageDir = searchDirs.find(dir => existsSync(join(dir, 'lib', 'index.js')))
if (packageDir === undefined) {
  record('roster', 'SKIP', `dsh-agent-presets is not installed under any of:\n      ${searchDirs.join('\n      ')}`)
} else {
  try {
    const { discoverPresets } = await import(pathToFileURL(join(packageDir, 'lib', 'index.js')).href)
    // harnessBase is where the installed harness resolves a row's package name from;
    // the profile directory that holds the plugins answers that question.
    const harnessBase = pathToFileURL(join(dshHome(), 'profiles')).href
    const presetRoot = dirname(presetDir)
    const listed = await discoverPresets([{ path: presetRoot, trust: 'user' }], harnessBase)
    const mine = listed.find(preset => preset.id === PRESET_ID)
    if (mine === undefined) {
      record('roster', 'FAIL', `${packageDir}\n      scanned ${presetRoot}: ${listed.length} preset(s), none with id ${PRESET_ID}`)
    } else if (mine.broken !== undefined) {
      record('roster', 'FAIL', `the roster refuses this preset: ${mine.broken}`)
    } else {
      record('roster', 'PASS', `${packageDir}\n      id=${mine.id} name=${mine.name} order=${mine.order} trust=${mine.trust}`)
    }
  } catch (error) {
    record('roster', 'FAIL', `${packageDir}\n      discovery threw: ${error.message}`)
  }
}

const failed = results.filter(result => result.state === 'FAIL')
const skipped = results.filter(result => result.state === 'SKIP')
process.stdout.write(
  `\n${failed.length === 0 ? 'OK' : 'FAILED'}: ${results.length - failed.length - skipped.length} passed, `
  + `${failed.length} failed, ${skipped.length} skipped\n`,
)
process.exit(failed.length === 0 ? 0 : 1)
