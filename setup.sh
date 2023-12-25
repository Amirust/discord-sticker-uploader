#!/bin/bash

if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "Error: Python not installed."
    exit 1
fi

if ! command -v pip &> /dev/null; then
    echo "Error: pip not installed."
    exit 1
fi

npm ci
pip install ultralytics

mkdir "stickers"