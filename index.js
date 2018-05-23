const mediaType = 'application/vnd.github.antiope-preview+json'
const headers = {headers: {accept: mediaType}}
const analyzeTree = require('./lib/analysis')

module.exports = (robot) => {
  robot.on('check_run', async context => {
    const {action, check_run} = context.payload
    const {owner, repo} = context.repo()
    const {check_suite: {head_branch: branch}, head_sha: sha} = check_run

    handler({context, action, owner, repo, branch, sha})
  })

  robot.on('check_suite', async context => {
    const {action, check_suite} = context.payload
    const {owner, repo} = context.repo()
    const {head_branch: branch, head_sha: sha} = check_suite

    handler({context, action, owner, repo, branch, sha})
  })
}

const handler = async ({context, action, owner, repo, branch, sha}) => {
  context.log(`action is "${action}".`)
  context.log(`repo is "${owner}/${repo}".`)
  context.log(`branch is "${branch}".`)
  context.log(`sha is "${sha}".`)

  if (['requested', 'rerequested'].includes(action)) {
    context.log('creating in_progress check run...')

      let url = `https://api.github.com/repos/${owner}/${repo}/check-runs`
      let result = await context.github.request(Object.assign(headers, {
        method: 'POST',
        url: url,
        name: 'feedback',
        head_branch: branch,
        head_sha: sha,
        status: 'in_progress',
        started_at: (new Date()).toISOString(),
      }))

      const {data: {id: check_run_id, url: check_run_url}} = result
      context.log('result is %j.', result)
      context.log(`check_run_id is ${check_run_id}.`)
      context.log(`check_run_url is ${check_run_url}.`)

      // Process all .md files in this repo
      const annotations = (await analyzeTree(context, owner, repo, sha))
        .filter(annotation => annotation.length > 0)
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
      context.log('annotations (%d) are %j', annotations.length, annotations)

      // Provide feedback
      // https://developer.github.com/v3/checks/runs/#update-a-check-run
      // PATCH /repos/:owner/:repo/check-runs/:check_run_id

      let options = {
        method: 'PATCH',
        url: check_run_url,
        head_branch: branch,
        head_sha: sha,
        status: 'completed',
        conclusion: annotations.length > 0 ? 'neutral' : 'success',
        completed_at: (new Date()).toISOString()
      }

      if (annotations.length > 0) {
        // Include output and annotations
        options = Object.assign(options, {
          output: {
            title: 'analysis',
            summary: `Alex found ${annotations.length} issue${annotations.length === 1 ? '' : 's'}`,
            annotations: annotations
          }
        })
      }

      result = await context.github.request(Object.assign(headers, options))
      context.log('result is %j', result)
  }
}
