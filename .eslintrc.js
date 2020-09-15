module.exports = {
    globals: {
        importScripts: true
    },
    env: {
        browser: true,
        es6: true
    },
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 8,
        sourceType: "module",
        allowImportExportEverywhere: true,
        ecmaFeatures: {
            legacyDecorators: true,
            jsx: true,
            modules: true,
            arrowFunctions: true,
            classes: true,
            experimentalObjectRestSpread: true
        }
    },
    rules: {
        quotes: ["error", "double"],
        "no-mixed-operators": ["off"],
        "no-console": ["off"],
        "react/jsx-indent": ["off"],
        "react/destructuring-assignment": ["off"],
        "import/no-named-as-default-member": ["off"],
        "import/named": ["off"],
        "import/order": ["off"],
        "import/no-extraneous-dependencies": ["off"],
        "import/no-named-as-default": ["off"],
        "react/jsx-indent-props": ["off"],
        "flowtype/require-return-type": ["off"],
        camelcase: [
            1,
            {
                properties: "always"
            }
        ],
        "react/jsx-one-expression-per-line": ["off"],
        "react/prop-types": "off",
        complexity: ["warn", 4],
        "max-nested-callbacks": ["warn", 5],
        "no-unused-vars": "warn",
        "max-statements": [
            "warn",
            {
                max: 3
            }
        ],
        "max-statements-per-line": [
            "warn",
            {
                max: 1
            }
        ],
        "getter-return": "warn",
        "jsx-quotes": ["warn", "prefer-double"]
    }
};
