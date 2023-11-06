module.exports = {
  // .eslintrc.json
  env: {
    browser: true,
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', 'import'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    eqeqeq: ['error'],
    'max-len': 'off',
    'import/no-absolute-path': 'error',
    'import/no-webpack-loader-syntax': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': ['error'],
  },
};
