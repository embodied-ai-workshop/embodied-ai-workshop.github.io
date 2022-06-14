# Embodied AI Workshop Website

This repository contains the development of [embodied-ai.org](https://embodied-ai.org/).

## Development

### Quick Fixes

**Organizer Info**. Organizer info is stored in [gatsby-config.js](https://github.com/embodied-ai-workshop/embodied-ai.org/blob/main/gatsby-config.js), where the imageId's correspond to those found in [static/images/organizers](https://github.com/embodied-ai-workshop/embodied-ai.org/tree/main/static/images/organizers).

### Local Development

The website is developed using Gatsby and relies on React, TypeScript, SCSS, and GraphQL, among other things. It's then statically transformed and optimized into HTML, CSS, and JavaScript (on the `generated-static-pages` branch), which ultimately gets displayed to the user.

To avoid locally developing, feel free to simply create an issue. But, if you're up for it:

1. Install [Node.js](https://www.npmjs.com/get-npm).

The installation can be confirmed by typing:

```
npm -v
```

into a command line.

2. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable), which makes it easiest to install gatsby dependencies (in my experience, over using NPM directly).

3. Clone and move into the repo:

```
git clone https://github.com/embodied-ai-workshop/embodied-ai.org.git
cd embodied-ai-website/
```

4. Install other dependencies (e.g., scss, TypeScript, etc.):

```
yarn install
```

5. Invoke gatsby from the root of the directory to build locally:

```
export NODE_OPTIONS=--openssl-legacy-provider # Needed for newer versions of node
yarn run develop
```

This should then create a local server which shows the live website at http://localhost:8000/.
