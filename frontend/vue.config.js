module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.sass";@import "@/styles/mixins.sass";`
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },

  publicPath: '/'
};
