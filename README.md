# One Stoop UI

## About One Stoop
The goal of One Stoop is to create an open social media platform.  Open can mean different things so lets be clear.  For us open starts with being a nonprofit company (there is no company yet, still in the formation phase).  It also means we will be open with all our goals and activities.  Finally we are open with our code.  Its all here for you to see and help with.

Being nonprofit here are some of our goals and activities.
* Rule number one, never share or sell a users personal data.  End users are not the product, the platform is.
* Any advertisements on the site will not use personal data to target users.
* We will operate mostly on donations

## About os-ui
os-ui is the web app/user interface for One Stoop.  The main components of os-ui are written using VueJS and Vuetify.

### Goals for os-ui
* Be secure, don't leak data
* Be light and easy to user
* Be reactive

# Getting started with One Stoop
## Local Build Setup
You will need [os-api](https://github.com/OneStoop/os-api) and [os-ui](https://github.com/OneStoop/os-ui).  Please see each repo for instructions on setup of that service.

Prerequisites:
1) nodejs needs to be installed.  To check if you have node run `nodejs --version`
As of this writing we are running v8.11.3 on our dev instance
2) A firebase account [https://firebase.google.com/](https://firebase.google.com/)
Authentication should be enabled with at least Email/Password sign-in method setup
Storage will need to be enabled

Steps:
1) Clone this repo: `git clone git@github.com:OneStoop/os-ui.git`
2) Change to cloned directory and install packages: `cd os-ui/ && npm install`
3) Edit config/dev.env.js file and populate it with the following data

``` js
'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const BASE_URL = "'http://localhost:8080'"

module.exports = merge(prodEnv, BASE_URL, {
  NODE_ENV: '"development"',
  API_SERVER: "'http://localhost:5001/v1/'",
  FIREBASE: {
    apiKey: "'<yourKey>'",
    authDomain: "'<yourDomain>'",
    storageBucket: "'<yourStorageBucket>'",
    projectId: "'<yourProjectId>'"
  }
})
```

``` bash
# install vue
npm install -g @vue/cli

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Questions? Need Help? Found a bug?
For now create an issue
