#!/usr/bin/env bash

ng build --prod --base-href "https://shashwatblack.github.io/vizweb/"
npx angular-cli-ghpages --dir=dist/
