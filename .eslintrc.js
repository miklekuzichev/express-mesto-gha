module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": {
      "extends": [ "airbnb-base" ],
      "rules": { "no-console": "off", "no-underscore-dangle": ["error", { "allow": ["_id"] }],
      "import/extensions": "off",
      "import/prefer-default-export": "off"
      }
    }
    ,
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
