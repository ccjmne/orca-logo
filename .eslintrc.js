module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['src', 'node_modules'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  env: { es2021: true },
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  rules: {
    ...{
      // newlines
      'linebreak-style': ['warn', 'unix'],
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
      'padded-blocks': ['warn', { blocks: 'never', switches: 'never', classes: 'always' }],
      'object-curly-newline': ['warn', {
        ImportDeclaration: 'never',
        ObjectExpression: { consistent: true, multiline: true },
        ObjectPattern: { consistent: true, multiline: true },
      }],
    },
    ...{
      // code style
      'arrow-parens': ['warn', 'as-needed'],
      'comma-dangle': ['warn', 'always-multiline'],
      'import/extensions': ['warn', 'never'],
      'import/order': ['warn', {
        'groups': ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always-and-inside-groups',
        'alphabetize': { order: 'asc' },
      }],
      'indent': ['warn', 2],
      'max-len': ['warn', 140, 4, {
        ignoreTrailingComments: true,
        ignorePattern: '^import\\s',
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      'no-floating-decimal': 'off',
      '@typescript-eslint/member-delimiter-style': ['warn', { singleline: { delimiter: 'comma' }, multilineDetection: 'last-member' }],
      'quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'quote-props': ['warn', 'consistent-as-needed'],
      'semi': 'off',
      '@typescript-eslint/semi': ['warn', 'always'],
    },
    ...{
      // code smells
      'class-methods-use-this': ['error', { exceptMethods: ['connectedCallback', 'disconnectedCallback'] }],
      'default-case': 'off', // in ts projects, prefer @typescript-eslint/switch-exhaustiveness-check
      '@typescript-eslint/switch-exhaustiveness-check': ['error'],
      'func-names': ['warn', 'as-needed'],
      'global-require': ['off'], // deprecated, see https://eslint.org/docs/rules/global-require
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['webpack.config.ts'] }],
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error', { allow: ['_'] }],
    },
  },
};
