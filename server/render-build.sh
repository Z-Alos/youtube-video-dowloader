#!/bin/bash

echo "📦 Installing Node modules..."
npm install

echo "⬇️ Downloading yt-dlp binary..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp

echo "✅ Build script completed!"

