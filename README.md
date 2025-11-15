# Ultimate Meme Generator (Memester)

Memester is a lightweight, client-side meme generator built with vanilla HTML, CSS and JavaScript. It lets users browse a gallery of images, upload their own images, add and edit text or stickers, and save or download the resulting memes. The project stores saved memes locally using `localStorage` and optionally uploads images to Cloudinary for sharing.

## Features
- Responsive image gallery
- Upload your own images and edit them
- Add multiple text lines with full editing support (font, color, size, alignment)
- Add emoji stickers
- Drag/Click on canvas to select lines and edit
- Save memes to browser `localStorage`
- Download or share memes (sharing uses Cloudinary upload then opens Facebook share dialog)

## Quick Start
Requirements: a modern browser (Chrome, Firefox, Edge, Safari) with JavaScript enabled. No build step required.

1. Open the project directory.
2. Open `index.html` in your browser, or serve the folder using a small development server:

PowerShell example (recommended to avoid CORS for file uploads):
```powershell
# using http-server from npm
npx http-server -c-1

# or with Python 3
python -m http.server 8080
```

Visit http://localhost:8080 and the home page will load.

## How to Use
1. Click `Gallery` to browse stock images or click `I'm Feeling Lucky` to pick a random image.
2. Use `Upload Image` to bring your own photo.
3. When an image is selected, the editor appears — type text, change color, fonts, size, and alignment.
4. Add emoji stickers and move lines up or down. You can click on text/sticker in the canvas to select it.
5. Save your meme to the local gallery or download it as a JPG.
6. Use `Share` to upload the image to Cloudinary and share (opens Facebook dialog on success).

## Project Structure
- `index.html` – Main HTML file and app entry point
- `css/` – All styles (main and component CSS files)
  - `basics`, `components`, `setup` – subfolders for structure and layout
- `js/` – JavaScript files
  - `main.js` – app init and shared UI logic
  - `meme-controller.js` – canvas drawing and editor business logic
  - `gallery-controller.js` – gallery UI and interactions
  - `meme-service.js` – state and storage utilities
  - `utils.js` – helper utilities (random, storage, Cloudinary upload)
- `img/` – bundled images used by the gallery

## Important Notes
- The sharing feature (`uploadImg` in `js/utils.js`) posts the generated image to Cloudinary. The project currently uses `CLOUD_NAME = 'webify'` and `UPLOAD_PRESET = 'webify'` — to use sharing in production, change these values to your Cloudinary Cloud Name and an upload preset configured for unsigned uploads.
- Saved memes use `localStorage`, so they are stored per-browser and will be lost if the browser storage is cleared.

## Contribution
Contributions are welcome! Suggested steps:
1. Fork and clone this repository.
2. Make a feature branch and add your changes.
3. Run and test your changes locally.
4. Open a pull request with a clear description of changes and motivations.

## License
No license file is included. If you'd like, add an open-source license such as MIT by including a `LICENSE` file.

## Contact
Created by Aviad Ben Hamo – Coding Academy

If you want to add features or have questions about the implementation, open an issue or a PR.
