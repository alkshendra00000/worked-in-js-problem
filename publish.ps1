param(
    [string]$Message = "Update project"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath ".git")) {
    throw "Run this script from the project folder."
}

git add -A

$pendingChanges = git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No new changes found. Save your files first."
    exit 0
}

git commit -m $Message
git push
Write-Host "Changes pushed to GitHub successfully."
