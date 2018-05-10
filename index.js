module.exports = (robot) => {
  robot.on('check_suite', context => {
    // robot.log('Yay, check_suite was requested!')
    context.log(context.payload)
  })
}
