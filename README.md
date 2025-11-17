# Basic Apps - Calculator PWA

This repository contains a minimal React/Vite progressive web app that provides a basic calculator with clipboard utilities.

👉 If you are browsing this repository on GitHub, you can launch the hosted PWA directly at: https://your-org.github.io/basicapps/

> Replace `your-org` with your GitHub user or organization name once GitHub Pages is enabled for this repository.

## Installation (GitHub workflow)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/basicapps.git
   cd basicapps
   ```
2. Install client dependencies and build the app:
   ```bash
   cd client
   npm install
   npm run build
   ```
3. Preview locally (optional):
   ```bash
   npm run preview
   ```
4. Deploy the contents of `client/dist` to your preferred static host. Make sure service workers and the manifest are served from the web root so the PWA can register correctly. All icons are inlined (no binary assets required), and the service worker caches the app shell for offline use once it has been loaded once.

### Deploying to GitHub Pages

1. Build the client:
   ```bash
   cd client
   npm install
   npm run build
   ```
2. In the repository settings, enable **Pages** using the `client/dist` folder (or the branch/folder where you publish the build output).
3. Confirm the public URL follows the pattern `https://<your-org>.github.io/basicapps/` (or the repository name if different).
4. Verify offline readiness by visiting the page once online—static assets are cached by the service worker for subsequent offline access.

## iOS “Add to Home Screen”

1. Open the deployed site in Safari on iOS.
2. Tap the share icon, then choose **Add to Home Screen**.
3. Launch the installed app from the home screen. The PWA uses standalone display mode, touch icons, and iOS-specific meta tags to remove Safari chrome.
4. On first launch, ensure the network is available so the service worker can cache assets for offline use (including on mobile Safari).

## Clipboard testing notes

- The calculator includes **Copy** and **Paste** buttons powered by the Clipboard API. On some mobile browsers you may need user interaction (taps) before the API is available.
- For iOS devices, test copy/paste directly on the home-screen-installed PWA to confirm permissions. If access is blocked, interact with the page first (e.g., tap the display) and retry.
- When offline, calculations still work from the cache, but clipboard access depends on the device’s security policies.
