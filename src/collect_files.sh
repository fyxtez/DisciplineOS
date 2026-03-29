#!/usr/bin/env bash

# Root folder = folder where this script is located
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Global variable that will store file paths + contents
ALL_CONTENT=""

# Traverse all files recursively
while IFS= read -r -d '' file; do
    ALL_CONTENT="${ALL_CONTENT}===== FILE: ${file} =====
"
    ALL_CONTENT="${ALL_CONTENT}$(cat "$file")

"
done < <(find "$ROOT_DIR" -type f ! -name "$(basename "$0")" -print0)

# Copy to clipboard
if command -v xclip >/dev/null 2>&1; then
    printf "%s" "$ALL_CONTENT" | xclip -selection clipboard
    echo "Copied to clipboard using xclip."
elif command -v xsel >/dev/null 2>&1; then
    printf "%s" "$ALL_CONTENT" | xsel --clipboard --input
    echo "Copied to clipboard using xsel."
elif command -v pbcopy >/dev/null 2>&1; then
    printf "%s" "$ALL_CONTENT" | pbcopy
    echo "Copied to clipboard using pbcopy."
else
    echo "No clipboard tool found."
    echo "Install one of: xclip, xsel, or use macOS pbcopy."
fi