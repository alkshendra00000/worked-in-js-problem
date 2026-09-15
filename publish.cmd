@echo off
set "MESSAGE=%~1"
if "%MESSAGE%"=="" set "MESSAGE=Update project"

git add -A
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo No new changes found. Save your files first.
    exit /b 0
)

git commit -m "%MESSAGE%"
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

git push
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

echo Changes pushed to GitHub successfully.
