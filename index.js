const mediaType = 'application/vnd.github.antiope-preview+json'
const headers = {headers: {accept: mediaType}}
const analyzeTree = require('./lib/analysis')

module.exports = (robot) => {
  robot.on('check_run', async context => {
    const {action, check_run} = context.payload
    const {owner, repo} = context.repo()
    const {head_sha: sha} = check_run

    return handler({context, action, owner, repo, sha})
  })

  robot.on('check_suite', async context => {
    const {action, check_suite} = context.payload
    const {owner, repo} = context.repo()
    const {head_sha: sha} = check_suite

    return handler({context, action, owner, repo, sha})
  })
}

const handler = async ({context, action, owner, repo, sha}) => {
  context.log.trace(`action is "${action}".`)
  context.log.trace(`repo is "${owner}/${repo}".`)
  context.log.trace(`sha is "${sha}".`)

  if (['requested', 'rerequested'].includes(action)) {
    context.log.trace('creating in_progress check run...')

      let url = `https://api.github.com/repos/${owner}/${repo}/check-runs`
      let result = await context.github.request(Object.assign({
        method: 'POST',
        url: url,
        name: 'feedback',
        head_sha: sha,
        status: 'in_progress',
        started_at: (new Date()).toISOString()
      }, headers))

      const {data: {id: check_run_id, url: check_run_url}} = result
      context.log.trace('result is %j.', result)
      context.log.trace(`check_run_id is ${check_run_id}.`)
      context.log.trace(`check_run_url is ${check_run_url}.`)

      // Process all .md files in this repo
      const annotations = (await analyzeTree(context, owner, repo, sha))
        .filter(annotation => annotation.length > 0)
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
      const count = annotations.length
      context.log.trace('annotations (%d) are %j', count, annotations)

      // Provide feedback
      // https://developer.github.com/v3/checks/runs/#update-a-check-run
      // PATCH /repos/:owner/:repo/check-runs/:check_run_id

      // Send annotations in batches of (up to) 50
      while (annotations.length > 0) {
        let batch = annotations.splice(0, 50)
        context.log.info(`sending batch of ${batch.length}`)
        result = await context.github.request(Object.assign({
          method: 'PATCH',
          url: check_run_url,
          output: {
            annotations: batch
          }
        }, headers))
        context.log.trace('result is %j', result)
      }

      // Complete the check run
      result = await context.github.request(Object.assign({
        method: 'PATCH',
        url: check_run_url,
        output: {
          title: 'analysis',
          summary: `Alex found ${count} issue${count === 1 ? '' : 's'}`
        },
        status: 'completed',
        conclusion: count > 0 ? 'neutral' : 'success',
        completed_at: (new Date()).toISOString()
      }, headers))
      context.log.trace('result is %j', result)
  }
}
