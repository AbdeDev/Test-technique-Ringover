module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!node-fetch)',
    ],
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.setup.js'],
  };
  