module.exports = (robot) => {
  robot.on('check_suite', async context => {
    let {action} = context.payload
    context.log(`action is "${action}".`)

    // Create an in_progress check_run
    const result = await context.github.checks.create({
      owner: "swinton",
      repo: "example",
      name: "feedback",
      head_branch: "helloworld",
      head_sha: "2e3d00a6f14a667d50ad9ccd6f3dcfded52121e2",
      status: "in_progress",
      started_at: (new Date()).toISOString(),  // The time that the check run began in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
      completed_at: (new Date()).toISOString(),
      conclusion: "status"
    })

    context.log(`result is ${result}.`)
  })
}
