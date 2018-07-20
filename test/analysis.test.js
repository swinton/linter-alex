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
                },
                {
                  path: "CONTRIBUTING.md",
                  mode: "100644",
                  type: "blob",
                  sha: "54fbdc5368d7729a3cf70743cecc50e790ca51d0",
                  size: 47,
                  url: "https://api.github.com/repos/wintron/example/git/blobs/43fbdc5368d7729a3cf70743cecc50e790ca51d0"
                }
              ],
              truncated: false
            }
          }),
          getBlob: jest.fn()
        }
      },
      log: jest.fn().mockImplementation(mesg => mesg)
      // log: console.log
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

  it("returns an empty array for each file", async () => {
    context.github.gitdata.getBlob.mockResolvedValueOnce({
      data: {
        sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0",
        node_id: "MDQ6QmxvYjY5NjAxNjMxOjQzZmJkYzUzNjhkNzcyOWEzY2Y3MDc0M2NlY2M1MGU3OTBjYTUxZDA=",
        size: 47,
        url: "https://api.github.com/repos/wintron/example/git/blobs/43fbdc5368d7729a3cf70743cecc50e790ca51d0",
        content: "aGVsbG8gd29ybGQ=",
        encoding: "base64"
      }
    })
    context.github.gitdata.getBlob.mockResolvedValueOnce({
      data: {
        sha: "54fbdc5368d7729a3cf70743cecc50e790ca51d0",
        node_id: "NEQ6QmxvYjY5NjAxNjMxOjQzZmJkYzUzNjhkNzcyOWEzY2Y3MDc0M2NlY2M1MGU3OTBjYTUxZDA=",
        size: 47,
        url: "https://api.github.com/repos/wintron/example/git/blobs/54fbdc5368d7729a3cf70743cecc50e790ca51d0",
        content: "aGVsbG8gd29ybGQ=",
        encoding: "base64"
      }
    })

    const analysis = await analyzeTree(context, "wintron", "example", "9875bf915c118e6369a610770288cf7f0a415124")
    
    expect(context.github.gitdata.getTree).toHaveBeenCalledTimes(1)
    expect(context.github.gitdata.getTree).toHaveBeenCalledWith({
      owner: "wintron", 
      repo: "example", 
      sha: "9875bf915c118e6369a610770288cf7f0a415124", 
      recursive: 1
    })
    expect(context.github.gitdata.getBlob).toHaveBeenCalledTimes(2)
    expect(context.github.gitdata.getBlob).toHaveBeenNthCalledWith(1, {
      owner: "wintron", repo: "example", sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0"
    })
    expect(context.github.gitdata.getBlob).toHaveBeenNthCalledWith(2, {
      owner: "wintron", repo: "example", sha: "54fbdc5368d7729a3cf70743cecc50e790ca51d0"
    })
    expect(analysis).toEqual([[], []])
  })

  it("returns an array of messages for each file", async () => {
    context.github.gitdata.getBlob.mockResolvedValueOnce({
      data: {
        sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0",
        node_id: "MDQ6QmxvYjY5NjAxNjMxOjQzZmJkYzUzNjhkNzcyOWEzY2Y3MDc0M2NlY2M1MGU3OTBjYTUxZDA=",
        size: 57,
        url: "https://api.github.com/repos/wintron/example/git/blobs/43fbdc5368d7729a3cf70743cecc50e790ca51d0",
        content: "dGhlIHNlcnZlcnMgd2VyZSBkZXBsb3llZCBpbiBhIG1hc3Rlci9zbGF2ZSBjb25maWd1cmF0aW9u",
        encoding: "base64"
      }
    })
    context.github.gitdata.getBlob.mockResolvedValueOnce({
      data: {
        sha: "54fbdc5368d7729a3cf70743cecc50e790ca51d0",
        node_id: "NEQ6QmxvYjY5NjAxNjMxOjQzZmJkYzUzNjhkNzcyOWEzY2Y3MDc0M2NlY2M1MGU3OTBjYTUxZDA=",
        size: 31,
        url: "https://api.github.com/repos/wintron/example/git/blobs/54fbdc5368d7729a3cf70743cecc50e790ca51d0",
        content: "c29ycnkgZm9yIGJlaW5nIHN1Y2ggYSBqYWNrYXNz",
        encoding: "base64"
      }
    })

    const analysis = await analyzeTree(context, "wintron", "example", "9875bf915c118e6369a610770288cf7f0a415124")

    expect(context.github.gitdata.getTree).toHaveBeenCalledTimes(1)
    expect(context.github.gitdata.getTree).toHaveBeenCalledWith({
      owner: "wintron", 
      repo: "example", 
      sha: "9875bf915c118e6369a610770288cf7f0a415124", 
      recursive: 1
    })
    expect(context.github.gitdata.getBlob).toHaveBeenCalledTimes(2)
    expect(context.github.gitdata.getBlob).toHaveBeenNthCalledWith(1, {
      owner: "wintron", repo: "example", sha: "43fbdc5368d7729a3cf70743cecc50e790ca51d0"
    })
    expect(context.github.gitdata.getBlob).toHaveBeenNthCalledWith(2, {
      owner: "wintron", repo: "example", sha: "54fbdc5368d7729a3cf70743cecc50e790ca51d0"
    })
    expect(analysis).toEqual([
      [{
        blob_href: "https://github.com/wintron/example/blob/9875bf915c118e6369a610770288cf7f0a415124/README.md",
        end_line: 1,
        filename: "README.md",
        message: "`master` / `slave` may be insensitive, use `primary` / `replica` instead",
        start_line: 1,
        title: "master-slave",
        warning_level: "notice"
      }, {
        blob_href: "https://github.com/wintron/example/blob/9875bf915c118e6369a610770288cf7f0a415124/README.md",
        end_line: 1,
        filename: "README.md",
        message: "Don’t use “slave”, it’s profane",
        start_line: 1,
        title: "slave",
        warning_level: "notice"
      }], 
      [{
        blob_href: "https://github.com/wintron/example/blob/9875bf915c118e6369a610770288cf7f0a415124/CONTRIBUTING.md",
        end_line: 1,
        filename: "CONTRIBUTING.md",
        message: "Don’t use “jackass”, it’s profane",
        start_line: 1,
        title: "jackass",
        warning_level: "notice"
      }]
    ])
  })
})
