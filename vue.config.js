/* eslint-disable indent */

module.exports = {
  chainWebpack: (config) => {
    // GraphQL loader
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
  }
}
