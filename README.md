[![Build status](https://travis-ci.org/trungdq88/github-explorer.svg?branch=master)](https://travis-ci.org/trungdq88/github-explorer)
[![Dependencies](https://img.shields.io/david/trungdq88/github-explorer.svg)]()
[![Dev dependencies](https://img.shields.io/david/dev/trungdq88/github-explorer.svg)]()
[![Coverage Status](https://coveralls.io/repos/trungdq88/github-explorer/badge.svg?branch=master&service=github)](https://coveralls.io/github/trungdq88/github-explorer?branch=master)


# Introduction
GitHub Explorer is a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/) that helps you explore GitHub user repositories. This project is created for technology demonstration purpose, experiment how a web app "looks and behaves" like a native app.

**Live demo**: https://github-e.com

*(currently no desktop layout available yet :-(, so please view this on mobile for better experience)*

...or watch the GIFs below:

|Overview|App Shell (not a GIF)|Material animation|
|--------|---------|------------------|
|![gh-e](https://cloud.githubusercontent.com/assets/4214509/16709365/18c51ef6-4639-11e6-8d51-94386c8b8983.gif)|![image](https://cloud.githubusercontent.com/assets/4214509/16709479/0785ce26-463c-11e6-8376-f6734579649d.png)|![gh-e-1](https://cloud.githubusercontent.com/assets/4214509/16709494/7edb296c-463c-11e6-82a4-7e149dec6de3.gif)|

Scored **88/100** in [Lighthouse](https://github.com/GoogleChrome/lighthouse) (auditing and performance metrics for Progressive Web Apps):

![image](https://cloud.githubusercontent.com/assets/4214509/16709429/efc01ee6-463a-11e6-889f-026a954bd10c.png)


## Goal:
 - Change people beliefs on web apps by make it as much "native" as possible with cool technologies like ReactJS and Progressive Web Apps.

## Tech stack:
 - **ReactJS** for UI
 - **RxJS** for data flow and basic app architecture
 - **Web App Manifest** for add to home screen, splash screen...
 - **Service Worker** for offline usage ([sw-precache](https://github.com/GoogleChrome/sw-precache))
 - **Animation Performance** with [FLIP](https://aerotwist.com/blog/flip-your-animations/) and best practices from this [High Performance Animations Blog Post](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
 - **Application Shell Architecture** for better user experience
 - **Babel** for ES6 syntax
 - **Webpack** for bundle
 - **Karma** for testing (no test case yet)
 - [React Router Page Transition](https://github.com/trungdq88/react-router-page-transition) to make material transition effect possible.
 - ...and more, please check `package.json`

This project is bootstraped from [plain-react](https://github.com/trungdq88/plain-react) - a simple boilerplate to start a simple ReactJS application.

**TODOs:** a potentially technical blog post about this coming soon.

# Development
**Initial dev setup**
Make sure you have NodeJS v6 or above. 

```bash  
npm install
bower install
npm start 
``` 

`http://localhost:8763` should now be live with Hot Module Replacement.

**Production build**

```bash
npm install 
npm run build 
```

Production code placed at `build`

**Test**

```bash
npm test
```

Coverage report placed in `./coverage/` directory

**Other commands**
- `npm lint`: linting.

# [Team](https://github-e.com/humans.txt)

```
/* TEAM */

    Company: Silicon Straits Saigon
    www.siliconstraits.vn

    Developer: Trung Dinh Quang
    Contact: trungdq88 [at] gmail.com, quangtrung [at] siliconstraits.com
    From: Ho Chi Minh City, Vietnam

    UX/UI Designer: Huynh Anh Quan
    Contact anhquan [at] siliconstraits.com
    From: Ho Chi Minh City, Vietnam

    Animation Designer: Van Cong Bang
    Contact congbang [at] siliconstraits.com
    From: Ho Chi Minh City, Vietnam

/* THANKS */

    The Inspectocat Icon: Jason Costello 
    Contact: https://octodex.github.com/inspectocat
    From: San Francisco, CA
```
