import { DependencyRunner } from '@liquid-labs/dependency-runner'

import { Organization } from './resources/organization'

const setup = ({ app, reporter }) => {
  app.ext.setupMethods.push({
    name : 'prepare org dependencies',
    deps : ['!'],
    func : ({ app }) => { app.ext._liqOrgs = { orgSetupMethods : [] } }
  })
  app.ext.setupMethods.push({
    name : 'load orgs',
    func : loadOrgs
  })
  app.ext.setupMethods.push({
    name : 'process org setup',
    deps : ['*'],
    func : processOrgSetup
  })
}

const loadOrgs = ({ app, reporter }) => {
  const orgsData = {}
  app.ext._liqOrgs.orgs = orgsData
  const { playgroundMonitor } = app.ext._liqProjects
  for (const project of playgroundMonitor.listProjects()) {
    const { pkgJSON, projectPath } = playgroundMonitor.getProjectData(project)

    if (pkgJSON.liq?.packageType === 'org') {
      loadOrg({ orgsData, pkgJSON, projectPath })
    }
  }
}

const loadOrg = ({ orgsData, pkgJSON, projectPath }) => {
  const { name: pkgName } = pkgJSON
  const [orgName] = pkgName.split('/')

  orgsData[orgName] = new Organization({ name : orgName, pkgName, projectPath })
}

const processOrgSetup = async({ app, cache, reporter }) => {
  const orgDepRunner = new DependencyRunner({ runArgs : { app, cache, reporter } })
  for (const org of Object.values(app.ext._liqOrgs.orgs)) {
    for (const orgSetupMethod of app.ext._liqOrgs.orgSetupMethods) {
      const orgArgs = { org, orgKey : org.key }
      const mergedEntry = Object.assign({ args : orgArgs }, orgSetupMethod)
      orgDepRunner.enqueue(mergedEntry)
    }
  }
  orgDepRunner.complete()
  await orgDepRunner.await()
}

export { setup }
