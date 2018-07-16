const {createRobot} = require('probot')
const app = require('..')
const payload = require('./fixtures/check_suite.requested')

describe('index', () => {
  let robot
  let github

  beforeEach(() => {
    // Define event
    event = {event: 'check_suite', payload: payload}

    // Create robot instance
    robot = createRobot()

    // Initialize app with robot instance
    app(robot)

    // Mock out the GitHub API
    github = {}

    // Pass mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github)
  })
  
  it('works', async () => {
    await robot.receive(event)
  })
})


