const commonJestConfig = require('./jest.config.json');

module.exports = (target) => {
  if (target === 'unit') {
    return {
      ...commonJestConfig,
      testRegex: '.*\\.spec\\.ts$',
    };
  }
  if (target === 'e2e') {
    return {
      ...commonJestConfig,
      testRegex: '.e2e-spec.ts$',
    };
  }
  return commonJestConfig;
};
