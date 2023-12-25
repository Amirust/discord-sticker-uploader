@echo off


where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed.
    exit /b 1
)


where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python is not installed.
    exit /b 1
)


where pip >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: pip is not installed.
    exit /b 1
)

npm ci
pip install ultralytics

mkdir "stickers"