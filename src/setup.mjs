import { Organizations } from './resources/Organizations'

const setup = ({ app, model, reporter }) => {
  setupModel({ app })
}

const setupModel = ({ app, model }) => {
  app.liq.setupMethods.push({
    name : 'load orgs',
    func : loadOrgs
  })
}

const loadOrgs = ({ model, reporter }) => {
  model.bindSubModel('orgs', new Organizations({ model, reporter })) // .orgs
}

export { setup }
