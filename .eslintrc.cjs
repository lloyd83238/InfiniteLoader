module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ], 
  parser: 'vue-eslint-parser', // 解析 .vue 文件 
  parserOptions: { 
    parser: '@typescript-eslint/parser', // 解析 .ts 文件 
    ecmaVersion: 12, 
    sourceType: 'module', 
    extraFileExtensions: ['.vue'], // 提供@typescript-eslint/parser解析 .vue 文件中的<script> 
  },
  plugins: [ 'vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': ['error', {
      'ignores': ['index'] // 这里可以忽略'index'
    }],
  }
};