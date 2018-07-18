const {createRobot} = require('probot')
const app = require('..')
const payload = require('./fixtures/check_suite.requested')
const myDate = new Date(Date.UTC(2018, 0, 1))
const RealDate = Date

// Mock out the analysis implementation for these tests
// https://jestjs.io/docs/en/mock-functions#mock-implementations
jest.mock('../lib/analysis.js')
const analyzeTree = require('../lib/analysis')

describe('index', () => {
  let event
  let robot
  let github

  beforeEach(() => {
    global.Date = jest.fn(
      (...props) =>
        props.length
          ? new RealDate(...props)
          : new RealDate(myDate)
    )
    Object.assign(Date, RealDate)

    // Define event
    event = {event: 'check_suite', payload: payload}

    // Create robot instance
    robot = createRobot()

    // Initialize app with robot instance
    app(robot)

    // Mock out the GitHub API
    github = {}
    github.request = jest
      .fn()
      .mockResolvedValueOnce({data: {id: 42, url: "https://api.github.com/repos/foo/bar/check-runs/42"}})
      .mockResolvedValueOnce({data: {id: 42, url: "https://api.github.com/repos/foo/bar/check-runs/42"}})

    analyzeTree.mockResolvedValueOnce([])

    // Pass mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github)
  })

  afterEach(() => {
    global.Date = RealDate
  })
  
  it('works', async () => {
    await robot.receive(event)

    expect(analyzeTree).toHaveBeenCalledTimes(1)
    expect(analyzeTree.mock.calls[0][0]).toBeDefined()
    expect(analyzeTree.mock.calls[0][1]).toBe('wintron')
    expect(analyzeTree.mock.calls[0][2]).toBe('example')
    expect(analyzeTree.mock.calls[0][3]).toBe('9875bf915c118e6369a610770288cf7f0a415124')
  })
})


