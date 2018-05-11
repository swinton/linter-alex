const alex = require('alex')
const mediaType = 'application/vnd.github.antiope-preview+json'
const headers = {headers: {accept: mediaType}}

module.exports = (robot) => {
  robot.on('check_suite', async context => {
    const {action, check_suite} = context.payload
    const {owner, repo} = context.repo()
    const {head_branch: branch, head_sha: sha} = check_suite

    context.log(`action is "${action}".`)
    context.log(`repo is "${owner}/${repo}".`)
    context.log(`branch is "${branch}".`)
    context.log(`sha is "${sha}".`)

    if (action === 'requested') {
      context.log('creating in_progress check run...')

        let url = `https://api.github.com/repos/${owner}/${repo}/check-runs`
        const result = await context.github.request(Object.assign(headers, {
          method: 'POST',
          url: url,
          name: 'feedback',
          head_branch: branch,
          head_sha: sha,
          status: 'in_progress',
          started_at: (new Date()).toISOString(),
        }))

        context.log('result is %j.', result)

        // TODO
        // Process all .md files in this repo

        // Process HELLO_ALEX.md
        const path = context.repo({path: 'HELLO_ALEX.md', ref: branch})
        const {data: {content: encoded}} = await context.github.repos.getContent(path)
        const decoded = Buffer.from(encoded, 'base64').toString()
        const analysis = alex.markdown(decoded).messages

        context.log('analysis is %j.', analysis)
    }
  })
}
