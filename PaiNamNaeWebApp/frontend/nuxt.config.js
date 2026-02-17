import tailwindcssVite from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000/api/",
      // apiBase:"https://painamnae-backend.onrender.com/api/",
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    },
  },
  devServer: {
    port: 3001,
  },
  plugins: ["~/plugins/api.client.js"],
  app: {
    head: {
      title: "ไปนำแหน่",
      meta: [{ name: "description", content: "รายละเอียด" }],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap' }
      ]
    },

  },
  vite: {
    plugins: [tailwindcssVite()],
  },

  css: [
    'leaflet/dist/leaflet.css',
    '~/assets/css/input.css',
  ],
  build: {
    transpile: ['leaflet']
  },
});
