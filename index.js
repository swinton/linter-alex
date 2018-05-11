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

        // TODO
        // Process all .md files in this repo

        // Process HELLO_ALEX.md
        const file = 'HELLO_ALEX.md'
        const path = context.repo({path: file, ref: branch})
        const {data: {content: encoded}} = await context.github.repos.getContent(path)
        const decoded = Buffer.from(encoded, 'base64').toString()
        const annotations = alex.markdown(decoded).messages.map(message => {
          const {message: description, ruleId: title, location} = message
          return {
            filename: 'HELLO_ALEX.md',  // The name of the file to add an annotation to.
            blob_href: `https://github.com/${owner}/${repo}/blob/${sha}/${file}`, // The file's full blob URL.
            start_line: location.start.line, // The start line of the annotation.
            end_line: location.end.line, // The end line of the annotation.
            warning_level: 'notice', // The warning level of the annotation. Can be one of notice, warning, or failure.
            message: description, // A short description of the feedback for these lines of code. The maximum size is 64 KB.
            title: title // The title that represents the annotation. The maximum size is 255 characters.
          }
        })
        console.log('annotations are %j', annotations)

        // Provide feedback
        // https://developer.github.com/v3/checks/runs/#update-a-check-run
        // PATCH /repos/:owner/:repo/check-runs/:check_run_id
        result = await context.github.request(Object.assign(headers, {
          method: 'PATCH',
          url: check_run_url,
          head_branch: branch,
          head_sha: sha,
          status: 'completed',
          conclusion: 'neutral',
          completed_at: (new Date()).toISOString(),
          output: {
            title: 'analysis',
            summary: `Alex found ${annotations.length} issue${annotations.length === 1 ? '' : 's'}`,
            annotations: annotations
          }
        }))

    }
  })
}
