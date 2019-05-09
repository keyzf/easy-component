#!/bin/bash
set -e
echo "Clean up..."
rm -rf cjs es dist
echo "Compile sass..."
node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js src/scss/index.scss -o dist -q
postcss dist/index.css --use autoprefixer --replace --no-map
echo "Compile esm..."
tsc --outDir es
echo "Compile commonjs..."
tsc --outDir cjs --module commonjs
