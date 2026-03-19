#!/bin/bash
echo "Patching NPM registry configuration"
npm config set registry https://registry.npmjs.org/
npm config set @npm:registry https://registry.npmjs.org/
npm config set strict-ssl false
npm cache clean --force