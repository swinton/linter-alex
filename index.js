module.exports = (robot) => {
  robot.on('check_suite', async context => {
    let {action} = context.payload
    context.log(`action is "${action}".`)

    const result = await context.github.request({
      method: 'POST',
      url: 'https://api.github.com/repos/swinton/example/check-runs',
      name: 'feedback',
      head_branch: 'helloworld',
      head_sha: '2e3d00a6f14a667d50ad9ccd6f3dcfded52121e2',
      details_url: 'https://example.com/#/checks/42',
      external_id: '42',
      status: 'in_progress',
      started_at: (new Date()).toISOString(),
      headers: {
        accept: 'application/vnd.github.antiope-preview+json'
      }
    })

    context.log('result is %j.', result)
  })
}
