## How to Compile:

1. Run `npm ci` to install the project dev dependencies.
2. Run `npx gulp build` to compile the project.

## How to View:

There are several ways to view the compiled project:

1. Run `npx gulp` to compile the project and open it in your browser with a live reload server.
2. Navigate to the `build` directory and run `python -m http.server` to start a local web server using Python.
3. Open the `index.html` file in your browser. (Browsers may behave differently when opening local files than when opening files from a web server.)
4. View the latest build on GitHub Pages: https://theo543.github.io/Matrix-Math/

## Dependencies:

None as it's a static site, but here are the dev dependencies to compile the project:

- `browser-sync` - a live reload server for development (optional, not used by `npx gulp build`, but used by `npx gulp`)
- `gulp` - an automation tool similar to CMake or Make
- `gulp-pug` - a Gulp plugin for compiling [Pug](https://pugjs.org/) to HTML (Pug is intended for templates but it works just as well as a more concise HTML syntax)
- `gulp-rename` - a simple Gulp utility for renaming files (used to add the proper extension to compiled files)
- `gulp-sass` - a wrapper for the sass module that allows it to be used with Gulp
- `sass` - a Node.js SCSS compiler
