#!/bin/bash

read -p "Enter the text string you are searching for: " old
read -p "Enter the replacement string: " new

# Escape all forward slashes in both search and replace strings
old_escaped=$(printf '%s\n' "$old" | sed 's/\//\\\//g')
new_escaped=$(printf '%s\n' "$new" | sed 's/\//\\\//g')

echo "Searching for files containing '$old'..."

# Use a temporary file to store null-separated filenames
temp_file=$(mktemp)
trap 'rm -f "$temp_file"' EXIT

if ! grep -rl --null "$old" . > "$temp_file"; then
    echo "No files found containing '$old'."
    exit 1
fi

# Check if temp file is empty
if [ ! -s "$temp_file" ]; then
    echo "No files found containing '$old'."
    exit 1
fi

echo "Files found:"
# Display files in readable format
tr '\0' '\n' < "$temp_file"

read -p "Proceed with replacement? (y/n): " confirm
if [[ "$confirm" != "y" ]]; then
    echo "Aborted."
    exit 0
fi

# Use xargs -0 to handle null-separated input
xargs -0 perl -pi.bak -e "s/$old_escaped/$new_escaped/g" < "$temp_file"

echo "Replacement complete. Backups saved as .bak files."
