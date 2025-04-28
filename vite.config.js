// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
  // plugins: [react(),
  //   tailwindcss()
  // ],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  build: {
    lib: {
      entry: 'src/pages/ChatScreen/widget-entry.jsx', // <-- your new entry
      name: 'BikeChatWidget',
      fileName: 'bike-chat-widget',
      formats: ['iife'], // Important: 'iife' for script inclusion
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
