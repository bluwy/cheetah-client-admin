module.exports = {
  client: {
    service: {
      name: 'xecom-job-server',
      url: 'http://localhost:4000/graphql'
    },
    includes: [
      'src/**/*.vue',
      'src/**/*.js'
    ]
  }
}
