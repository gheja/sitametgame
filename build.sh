#!/bin/bash

./builders/android-builder/precheck.sh
./builders/nwjs-builder/precheck.sh
./builders/zip-builder/precheck.sh

./builders/android-builder/build.sh ./src ./dist test-project 0.1.0
./builders/nwjs-builder/build.sh ./src ./dist test-project 0.1.0
./builders/zip-builder/build.sh ./src ./dist test-project 0.1.0

cd dist

ls -alh

sha256sum *
