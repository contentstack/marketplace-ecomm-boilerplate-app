module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["prettier"],
  rules: {
    "max-len": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": ["error", { props: false }],
    "operator-linebreak": [
      "error",
      "after",
      {
        overrides: {
          ":": "before",
        },
      },
    ],
    "func-names": [0],
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
  },
};
