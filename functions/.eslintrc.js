/*
█▀ █▄█ █▀▀ █░█ █▀▀ █░█
▄█ ░█░ █▄▄ █▀█ ██▄ ▀▄▀

Author: <Anton Sychev> (anton at sychev dot xyz) 
.eslintrc.js (c) 2023 
Created:  2023-05-25 18:49:03 
Desc: lint rc config
Docs: documentation
*/

module.exports = {
    root: true,
    env: {
      es2020: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
    ],
    rules: {
      quotes: ["error", "double"],
    },
  };