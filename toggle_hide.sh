#!/usr/bin/env bash

# ==============================================================================
# EDIT YOUR VS CODE USER SETTINGS PATH & HARDCODED PATTERNS HERE
# ==============================================================================
# Windows APPDATA path resolution for Git Bash / WSL
SETTINGS_FILE="${APPDATA}/Code/User/settings.json"

# List of patterns/folders you wish to hide/unhide in VS Code
PATTERNS=(
  "**/node_modules"
  "**/android"
  "**/windows"
  "**/ios"
  "**/*.lock"
  "**/.build"
  "**/.bundle"
  ".gitignore"
  "__tests__/"
  "babel.config.js"
  "Gemfile"
  "jest.config.windows.js"
  "metro.config.js"
  "NuGet.config"
  "package-lock.json"
  "jest.config.js"
  "package.json"
  "yarn.lock"
  "tsconfig.json"
  ".vscode"
  ".prettierrc.js"
  ".watchmanconfig"
  ".eslintrc.js"
  "app.json"
)
# ==============================================================================

if [ ! -f "$SETTINGS_FILE" ]; then
    echo "Error: VS Code settings file not found at: $SETTINGS_FILE"
    exit 1
fi

ACTION="$1"

if [ -z "$ACTION" ]; then
    echo "Usage: $0 -h (hide) | -u (unhide) | -t (toggle)"
    exit 1
fi

# Convert Bash array into a space-separated string for Python
PATTERN_ARGS="${PATTERNS[*]}"

python - "$SETTINGS_FILE" "$ACTION" $PATTERN_ARGS << 'EOF'
import sys
import json
import os

settings_path = sys.argv[1]
action = sys.argv[2]
patterns = sys.argv[3:]

if not os.path.exists(settings_path):
    print(f"Error: File not found {settings_path}")
    sys.exit(1)

# Read existing JSON settings (handling empty or formatted files)
try:
    with open(settings_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
        data = json.loads(content) if content else {}
except Exception as e:
    print(f"Error parsing JSON from settings.json: {e}")
    sys.exit(1)

if "files.exclude" not in data or not isinstance(data["files.exclude"], dict):
    data["files.exclude"] = {}

exclude_dict = data["files.exclude"]

# Determine desired state for toggle
if action in ["-t", "--toggle"]:
    # If first pattern is hidden, unhide all; otherwise, hide all
    first_state = exclude_dict.get(patterns[0], False)
    target_state = not first_state
elif action in ["-h", "--hide"]:
    target_state = True
elif action in ["-u", "--unhide"]:
    target_state = False
else:
    print(f"Invalid flag: {action}")
    sys.exit(1)

# Apply settings
for pattern in patterns:
    exclude_dict[pattern] = target_state
    status = "Hidden" if target_state else "Unhidden"
    print(f"  [{status}] {pattern}")

# Write back formatted JSON
try:
    with open(settings_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Successfully updated VS Code settings.json!")
except Exception as e:
    print(f"Error writing to settings.json: {e}")
    sys.exit(1)

EOF