[![Build status](https://travis-ci.org/trungdq88/github-explorer.svg?branch=master)](https://travis-ci.org/trungdq88/github-explorer)
[![Dependencies](https://img.shields.io/david/trungdq88/github-explorer.svg)]()
[![Dev dependencies](https://img.shields.io/david/dev/trungdq88/github-explorer.svg)]()
[![Coverage Status](https://coveralls.io/repos/trungdq88/github-explorer/badge.svg?branch=master&service=github)](https://coveralls.io/github/trungdq88/github-explorer?branch=master)


# About
GitHub Explorer is a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) that helps you explore GitHub user repositories. This project is created for technology demonstration purpose, experiment how a web app "looks and behaves" like a native app.

Goal:
 - Change people beliefs on web apps by make it as much "native" as possible with cool technologies like ReactJS and Progressive Web Apps.

Tech stack:
 - *ReactJS* for UI
 - *RxJS* for data flow and basic app architecture
 - *Web App Manifest* for add to home screen, splash screen...
 - *Service Worker* for offline usage (sw-precache)
 - *Animation Performance* with [FLIP](https://aerotwist.com/blog/flip-your-animations/) and best practice from this [High Performance Animations Blog Post](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
 - *Babel* forr ES6 syntax
 - *Webpack* for bundle
 - *Karma* for testing (no test case yet)
 - ...and more, please check `package.json`

This project is bootstraped from [plain-react](https://github.com/trungdq88/plain-react) - a simple boilerplate to start a simple ReactJS application.

# Initial dev setup
Make sure you have NodeJS v6 or above. 

```bash  
npm install 
npm start 
``` 

`http://localhost:8763` should now be live with Hot Module Replacement.

# Production build

```bash
npm install 
npm run build 
```

Production code placed at `build`

# Test

```bash
npm test
```

Coverage report placed in `./coverage/` directory

# Other commands
- `npm lint`: linting.

