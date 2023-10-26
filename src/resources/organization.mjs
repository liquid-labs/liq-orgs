import { readFileSync } from 'node:fs'
import * as fsPath from 'node:path'

import yaml from 'js-yaml'

import { getSetting, requireSetting, updateSetting } from './lib/settings'

const Organization = class {
  #name
  #pkgName
  #projectPath
  #settings

  /**
   * Parameters:
   *
   * - `name`: (req, string) the name of the org, which follows the NPM scheme, starting with a '@'.
   * - `pkgName`: (req, string) the name of the NPM package which contains the org data. I.e., the org's "home" repo.
   * - `projectPath`: (req, string) the local file system path to the project's data project indicated by `npmName`.
   */
  constructor({ name, pkgName, projectPath }) {
    this.#name = name
    this.#pkgName = pkgName
    this.#projectPath = projectPath
    this.ext = {}

    const settingsPath = fsPath.join(projectPath, 'data', 'org', 'settings.yaml')
    try {
      const settingsContent = readFileSync(settingsPath, { encoding : 'utf8' })
      this.#settings = yaml.load(settingsContent)
    }
    catch (e) { // TODO: warn?
      if (e.code === 'ENOENT') {
        this.#settings = {}
      }
    }
  }

  get name() {
    return this.#name
  }

  get pkgName() {
    return this.#pkgName
  }

  get projectPath() {
    return this.#projectPath
  }

  get commonName() { return this.getSetting('COMMON_NAME') }

  get legalName() { return this.getSetting('LEGAL_NAME') }

  getSetting(keyPath) {
    return getSetting(this.#settings, keyPath)
  }

  updateSetting(keyPath, value) {
    return updateSetting(this.#settings, keyPath, value)
  }

  requireSetting(keyPath) {
    return requireSetting(this.#settings, keyPath)
  }
}

export { Organization }
