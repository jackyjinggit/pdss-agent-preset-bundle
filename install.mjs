#!/usr/bin/env node
/**
 * Install the PDSS governance agent preset into the DSH user preset root.
 *
 * The destination is `<DSH_HOME or ~/.dsh>/.agent-presets/pdss`. That root is
 * appended by `dsh-agent-presets` itself (`includeUserRoot` defaults to true),
 * so installation needs no profile patch, no bundle, and no restart: the roster
 * re-reads its roots on every call.
 *
 * Usage:
 *   node install.mjs [--force] [--dry-run] [--print-target]
 */
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PRESET_ID = 'pdss'
const USER_PRESET_DIR = '.agent-presets'

/** Absolute path of the preset payload shipped beside this script. */
const source = join(dirname(fileURLToPath(import.meta.url)), PRESET_ID)

/**
 * Resolve the DSH home the same way the harness does: an explicit `$DSH_HOME`
 * wins, a blank one counts as unset, and the default is `~/.dsh`.
 * @returns the absolute DSH home directory.
 */
function dshHome() {
  const fromEnv = (process.env.DSH_HOME ?? '').trim()
  return fromEnv === '' ? join(homedir(), '.dsh') : resolve(fromEnv)
}

const target = join(dshHome(), USER_PRESET_DIR, PRESET_ID)
const args = new Set(process.argv.slice(2))
const force = args.has('--force') || args.has('-f')
const dryRun = args.has('--dry-run')

if (args.has('--print-target')) {
  process.stdout.write(`${target}\n`)
  process.exit(0)
}

if (!existsSync(join(source, 'agent.cordis.yml'))) {
  process.stderr.write(`pdss-preset-install: preset payload not found at ${source}\n`)
  process.exit(1)
}

process.stdout.write(`pdss-preset-install\n  source : ${source}\n  target : ${target}\n`)

if (existsSync(target) && !force) {
  process.stderr.write(
    '\npdss-preset-install: the target already exists.\n'
    + 'Pass --force to replace it (only this preset directory is replaced), or delete it yourself.\n',
  )
  process.exit(1)
}

if (dryRun) {
  process.stdout.write('\ndry run: nothing was written.\n')
  process.exit(0)
}

mkdirSync(dirname(target), { recursive: true })
if (existsSync(target)) rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })

const skills = join(target, 'skills')
process.stdout.write(
  `\ninstalled. preset id: ${PRESET_ID}\n`
  + `  composition : ${join(target, 'agent.cordis.yml')}\n`
  + `  metadata    : ${join(target, 'preset.yml')}\n`
  + `  skills      : ${skills}${existsSync(skills) && statSync(skills).isDirectory() ? '' : ' (missing!)'}\n`
  + '\nNext steps\n'
  + '  1. The preset roster re-scans its roots on every read: no restart is needed.\n'
  + '  2. In the agent-preset picker it appears as “PDSS 治理模式”.\n'
  + '  3. Verify the skills actually loaded by asking a PDSS session to list its skills;\n'
  + '     the five governance skills must appear.\n'
  + '  4. Uninstall by deleting that directory.\n',
)
