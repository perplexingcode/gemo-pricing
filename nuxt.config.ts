// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['moment'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@pinia/nuxt'],
  css: [
    '~/assets/css/app.css',
    '~/assets/css/user.css',
    // '~/assets/css/elements.css',
    // '~/assets/css/components.css',
    // '~/assets/css/text.css',
  ],
  pinia: {
    autoImports: ['defineStore'],
  },
  components: {
    global: true,
    dirs: ['~/components'],
  },
  runtimeConfig: {
    public: {
      rootDir: process.env.ROOT_DIR,
      backendUrl: process.env.BACKEND_URL,
      auth0Url: process.env.AUTH0_URL,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
      auth0Audience: process.env.AUTH0_AUDIENCE,
      auth0ManagementClientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      auth0ManagementClientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      auth0ManagementAudience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
    },
  },
});
