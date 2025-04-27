module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'public/js/**/*.js',
    '!public/js/html5-qrcode.min.js',
    '!public/js/admin/vendor/**/*.js'
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/mocks/fileMock.js'
  },
  setupFiles: ['<rootDir>/tests/setup.js']
};
