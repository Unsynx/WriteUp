#!/bin/sh

if [ "$MODE" = "deploy" ]; then
  echo "Building for production..."
  npm run build

  echo "Serving static site on port $PORT..."
  serve -s dist -l "$PORT"
else
  echo "Starting development server..."
  npm run dev
fi