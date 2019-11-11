module.exports = ({ config }) => {
  // find web-components rule for extra transpilation
  const webComponentsRule = config.module.rules.find(
    rule => rule.use && rule.use.options && rule.use.options.babelrc === false,
  );
  // add your own `my-library`
  webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)authorization-method(.*)\\.js$`));

  return config;
};
