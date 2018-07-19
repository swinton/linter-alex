// jest.mock('alex')
// const alex = require('alex')
const analyzeTree = require('../lib/analysis')

describe('analyzeTree', () => {
  let context

  beforeEach(() => {
    context = {
      github: {
        gitdata: {
          getTree: jest.fn().mockResolvedValue({
            data: {
              sha: "9875bf915c118e6369a610770288cf7f0a415124",
              url: "https://api.github.com/repos/wintron/example/git/trees/9875bf915c118e6369a610770288cf7f0a415124",
              tree: [
                {
                  path: "README.md",
                  mode: "100644",
                  type: "blob",
                  sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0",
                  size: 47,
                  url: "https://api.github.com/repos/wintron/example/git/blobs/43fbdc5368d7729a3cf70743cecc50e790ca51d0"
                }
              ],
              truncated: false
            }
          }),
          getBlob: jest.fn().mockResolvedValue({
            data: {
              sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0",
              node_id: "MDQ6QmxvYjY5NjAxNjMxOjQzZmJkYzUzNjhkNzcyOWEzY2Y3MDc0M2NlY2M1MGU3OTBjYTUxZDA=",
              size: 47,
              url: "https://api.github.com/repos/wintron/example/git/blobs/43fbdc5368d7729a3cf70743cecc50e790ca51d0",
              content: "aGVsbG8gd29ybGQ=",
              encoding: "base64"
            }
          })
        }
      },
      // log: jest.fn().mockImplementation(mesg => mesg)
      log: console.log
    }

    // alex.mockImplementation({
    //   markdown: jest.fn().mockReturnValue({
    //     messages: []
    //   })
    // })
  })

  afterEach(() => {
    // alex.mockClear()
  })

  it("works once", async () => {
    analyzeTree(context, "wintron", "example", "9875bf915c118e6369a610770288cf7f0a415124")
    
    expect(context.github.gitdata.getTree).toHaveBeenCalledTimes(1)
    expect(context.github.gitdata.getTree).toHaveBeenCalledWith({
      owner: "wintron", 
      repo: "example", 
      sha: "9875bf915c118e6369a610770288cf7f0a415124", 
      recursive: 1
    })
    // expect(context.github.gitdata.getBlob).toHaveBeenCalledTimes(1)
  })
})