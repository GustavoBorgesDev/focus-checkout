#!/bin/bash

if [ -f package.json ]; then
  yarn
  yarn format
  yarn lint
else
  echo "No package.json found; skipping lint and format."
fi
