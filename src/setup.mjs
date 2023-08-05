import { DependencyRunner } from '@liquid-labs/dependency-runner'

import { Organizations } from './resources/Organizations'

const setup = ({ app, model, reporter }) => {
  setupModel({ app })
}

const setupModel = ({ app, model }) => {
  app.ext.setupMethods.push({
    name : 'prepare org dependencies',
    deps : ['!'],
    func : ({ app }) => { app.ext.orgSetupMethods = [] }
  })

  app.ext.setupMethods.push({
    name : 'load orgs',
    deps : ['load playground'],
    func : loadOrgs
  })

  app.ext.setupMethods.push({
    name : 'process org setup',
    deps : ['*'],
    func : processOrgSetup
  })
}

const loadOrgs = ({ model, reporter }) => {
  model.bindSubModel('orgs', new Organizations({ model, reporter })) // .orgs
}

const processOrgSetup = async({ app, cache, model, reporter }) => {
  const orgDepRunner = new DependencyRunner({ runArgs : { app, cache, model, reporter } })
  for (const org of Object.values(model.orgs)) {
    for (const orgSetupMethod of app.ext.orgSetupMethods) {
      const orgArgs = { org, orgKey : org.key }
      const mergedEntry = Object.assign({ args : orgArgs }, orgSetupMethod)
      orgDepRunner.enqueue(mergedEntry)
    }
  }
  orgDepRunner.complete()
  await orgDepRunner.await()
}

export { setup }
