#!/bin/bash

# Source directory (Next.js build output)
SOURCE_DIR="out"

# Destination directory
DEST_DIR="../elysia/api/static"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: '$SOURCE_DIR' directory not found!"
    echo "Please run 'next build' first to generate the static files."
    exit 1
fi

# Check if destination parent directory exists
if [ ! -d "$(dirname "$DEST_DIR")" ]; then
    echo "Error: Destination parent directory '$(dirname "$DEST_DIR")' does not exist!"
    exit 1
fi

# Create destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    echo "Creating destination directory..."
    mkdir -p "$DEST_DIR"
fi

# Copy files with replacement
echo "Copying files from '$SOURCE_DIR' to '$DEST_DIR'..."
cp -r "$SOURCE_DIR"/* "$DEST_DIR"

echo "Export completed successfully!"
