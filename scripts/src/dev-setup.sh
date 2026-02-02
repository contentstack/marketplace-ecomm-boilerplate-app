#!/bin/bash

# 16-byte random hex string
uuid_raw=$(openssl rand -hex 16)

# UUID as JWT secret(which you need to update it in ./api/.env)
uuid_formatted="${uuid_raw:0:8}-${uuid_raw:8:4}-${uuid_raw:12:4}-${uuid_raw:16:4}-${uuid_raw:20:12}"

# Function to open a new terminal in a specific directory
open_terminal() {
    local TARGET_PATH=$1
    local COMMAND=$2
    local TITLE=$3

    # Convert relative path to absolute path
    # Using 'cd' then 'pwd' ensures the path actually exists
    ABS_PATH=$(cd "$TARGET_PATH" && pwd)

    if [ $? -ne 0 ]; then
        echo "Error: Directory '$TARGET_PATH' does not exist."
        return 1
    fi

    # Detect Operating System
    OS_TYPE="$(uname -s)"

    case "${OS_TYPE}" in
        # --- WINDOWS (Git Bash / MSYS) ---
        *MINGW*|*MSYS*|*CYGWIN*)
            # Note: We convert the Unix-style path to Windows-style for CMD
            WIN_PATH=$(cygpath -w "$ABS_PATH")
            start cmd /k "title $TITLE && cd /d $WIN_PATH && $COMMAND"
            ;;

        # --- macOS ---
        Darwin*)
            osascript -e "tell application \"Terminal\"
                do script \"cd '$ABS_PATH' && $COMMAND\"
                activate
            end tell"
            ;;

        # --- LINUX ---
        Linux*)
            # Tries the generic emulator first
            if command -v x-terminal-emulator >/dev/null 2>&1; then
                x-terminal-emulator -e bash -c "cd '$ABS_PATH' && $COMMAND; exec bash" &
            elif command -v gnome-terminal >/dev/null 2>&1; then
                gnome-terminal --working-directory="$ABS_PATH" -- bash -c "$COMMAND; exec bash" &
            else
                echo "Error: No supported terminal emulator found."
            fi
            ;;

        *)
            echo "Unsupported OS: ${OS_TYPE}"
            ;;
    esac
}


echo "installing API dependencies."
cd ../api
npm i 
echo "creating api/.env file."
rm -f "./.env"
cat <<EOF > ".env"
NODE_ENV=development
JWT_API_SECRET=$uuid_formatted
EOF

echo "created api/.env file."


echo "installing UI dependencies."
cd ../ui
npm i
echo "creating ui/.env file."
rm -f "./.env"
cat <<EOF > ".env"
REACT_APP_UI_URL=http://localhost:4000
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_AUTH_URL=http://localhost:8080/auth
REACT_APP_ENCRYPTION_KEY=123
EOF

echo "created api/.env file."


echo "Setting up an initial development app."
cd ../scripts
npm run create-dev-app

echo "Starting the backend server..."
open_terminal "../api" "npm run dev" "backend server(API)"

echo "Starting the frontend app..."
open_terminal "../ui" "npm run start" "Frontend App(UI)"

echo "Creating content model and its entry for the latest app."
npm run create-content-model
