#!/bin/sh

npm run install:all
npm run lint
npm audit --production
npm test
