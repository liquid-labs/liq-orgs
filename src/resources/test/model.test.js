/* global afterAll beforeAll describe expect test */
import * as fsPath from 'node:path'

import { appInit, initModel, Reporter } from '@liquid-labs/liq-core'
import { playgroundSimplePath } from '@liquid-labs/liq-test-lib'
import { tryExec } from '@liquid-labs/shell-toolkit'

const pkgRoot = fsPath.resolve(__dirname, '..', '..', '..')

const testOptions = {
  skipCorePlugins : true,
  // LIQ_PLAYGROUND_PATH = playgroundSimplePath,
  reporter        : new Reporter({ silent : true })
}

describe('model', () => {
  describe('playground', () => {
    describe('initialization', () => {
      let cache, model

      beforeAll(async() => {
        const playgroundPluginPath = tryExec('npm explore @liquid-labs/liq-playground -- pwd').stdout.trim()

        process.env.LIQ_PLAYGROUND = playgroundSimplePath
        model = initModel(testOptions);
        ({ cache } = await appInit(Object.assign(
          { model },
          testOptions,
          { pluginDirs : [playgroundPluginPath, pkgRoot], noAPIUpdate : true }
        )))
      })

      afterAll(() => {
        delete process.env.LIQ_PLAYGROUND
        cache.release()
      })

      test('ignores files at the org level', () => {
        expect(Object.keys(model.orgs).length).toBe(1)
        expect(model.orgs['ignore-me.file']).toBeUndefined()
      })

      test("ignores org-level directories marked with '.liq-ignore'", () => {
        expect(model.orgs['ignore-me']).toBeUndefined()
      })

      test('loads all orgs', () => {
        expect(Object.keys(model.orgs).length).toBe(1)
        expect(model.orgs.orgA).toBeTruthy()
        expect(model.orgs.orgB).toBe(undefined)
      })
    })
  })

  // TODO: do some org unit testing!
  /* describe('org', () => {
    describe('initialization', () => {

    })
  }) */
})
