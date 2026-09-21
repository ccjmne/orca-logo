export default {
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'orca-logo.min.js',
        format: 'iife',
      },
    },
  },
};
