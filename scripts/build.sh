#!/bin/bash
set -e
echo "Clean up..."
rm -rf cjs es dist
# 编译样式
echo "Compile less..."
lessc src/less/index.less  dist/index.css
postcss dist/index.css --use autoprefixer --replace --no-map
echo "Compile less done"
# 编译esm
echo "Compile esm..."
tsc --outDir es
echo "Compile esm done"
# 编译commonjs
echo "Compile commonjs..."
tsc --outDir cjs --module commonjs
echo "Compile commonjs done"

