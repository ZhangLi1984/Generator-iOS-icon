# iOS Icon Generator Web App

A web-based tool for generating iOS app icons from a single source image. This tool creates all required icon sizes and packages them with the necessary metadata in a downloadable ZIP file.

## Features
- Generates all required iOS app icon sizes
- Creates proper Contents.json metadata
- Packages icons in a ready-to-use AppIcon.appiconset folder
- Downloads as a single ZIP file
- Simple and intuitive web interface

## Usage
1. Open the web app in your browser
2. Click "Generate Icons"
3. Select your source image (recommended: 1024x1024 PNG)
4. Wait for the generation to complete
5. Download the ZIP file containing your icons

## Deployment to GitHub Pages
1. Create a new GitHub repository
2. Push all files to the repository
3. Go to repository Settings > Pages
4. Select the main branch as the source
5. Save and wait for deployment to complete
6. Access your live web app at the provided GitHub Pages URL

## Technical Details
- Built with HTML, CSS, and JavaScript
- Uses JSZip for ZIP file creation
- Leverages Canvas API for image processing
- Follows Apple's Human Interface Guidelines
- Generates icons compatible with iOS 14+

## Requirements
- Modern web browser with Canvas and Blob support
- Source image should be at least 1024x1024 pixels
- Internet connection for loading required libraries

## License
MIT License - Free for personal and commercial use