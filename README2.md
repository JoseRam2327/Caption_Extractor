# UT Austin Tower Lecture Caption Extractor 📝

A lightweight Chrome extension that automatically captures and extracts captions from UT Austin Tower lecture videos in real-time.

![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Size](https://img.shields.io/badge/Size-%3C5KB-success)

## Features ✨

- ✅ **Automatic real-time capture** - Captions are captured automatically as you watch
- ✅ **No button clicks needed** - Just open a lecture and captions appear in the popup
- ✅ **Multiple export options** - Copy to clipboard or download as text file
- ✅ **Privacy-first** - All processing happens locally, no data sent to external servers
- ✅ **Clean interface** - Simple, intuitive design with real-time stats
- ✅ **Lightweight** - Less than 5KB, minimal performance impact

## Quick Start 🚀

### Installation

1. **Clone or download** this repository
   ```bash
   git clone https://github.com/yourusername/ut-austin-caption-extractor.git
   cd ut-austin-caption-extractor
   ```

2. **Open Chrome** and go to `chrome://extensions/`

3. **Enable Developer Mode** - Toggle in the top right corner

4. **Click "Load unpacked"** and select this project folder

5. **Done!** The extension is now installed and ready to use

### Usage

1. Open a **UT Austin Tower lecture video**
2. Make sure **captions are enabled** in the video player
3. **Click the extension icon** in your Chrome toolbar
4. **Watch the lecture** - Captions will automatically appear in the popup
5. **Copy or download** captions when you're done

## How It Works 🔧

The extension uses a content script that:
1. Monitors the video player's caption container for changes
2. Extracts caption text from Video.js cue elements
3. Deduplicates captions to avoid repeats
4. Sends captions to the popup for display and export
5. Works completely offline with no external dependencies

```
Watch Video → Captions Auto-Captured → Display in Popup → Export
```

## File Structure 📁

```
.
├── manifest.json      # Extension configuration (Manifest V3)
├── popup.html         # User interface
├── popup.js          # UI interaction logic
├── content.js        # Webpage interaction script
└── README.md         # This file
```

### manifest.json
Defines extension metadata, permissions, and which URLs to run on.

### popup.html & popup.js
Clean, responsive user interface with four main buttons:
- **Extract Captions** - Get all captions from video
- **Copy** - Copy to clipboard
- **Download TXT** - Save as text file
- **Clear** - Clear captured captions

### content.js
Runs on the webpage and handles:
- Real-time caption detection
- Deduplication logic
- Communication with popup

## Use Cases 💡

- 📚 **Accessibility** - Read lectures while watching for better comprehension
- 📝 **Note-Taking** - Export transcripts for study notes
- 🤖 **AI Analysis** - Upload to NotebookLM for deeper understanding
- 🌍 **Language Learning** - Review content in text form
- 💾 **Archiving** - Keep searchable records of important lectures

## Screenshots 📸

### Extension Popup
- Clean interface with four action buttons
- Real-time caption display in text area
- Live caption count and duration estimate
- Status messages for user feedback

## Privacy & Security 🔒

- **No tracking** - Zero analytics or tracking code
- **No data transmission** - Everything stays on your computer
- **No external APIs** - Doesn't contact any servers
- **Open source** - Fully auditable code
- **Local processing** - All operations happen in your browser

## Technical Stack 🛠️

- **Language**: JavaScript (Vanilla, no dependencies)
- **APIs**: Chrome Extensions API (Manifest V3)
- **Platform**: UT Austin Tower (Video.js-based player)
- **Size**: ~5KB total

## Limitations ⚠️

- Only works with UT Austin Tower platform
- Requires captions to be available in the video
- Only captures captions while actively watching
- Chrome/Chromium-based browsers only
- Cannot retroactively capture all captions from a video

## Installation Troubleshooting 🐛

### Captions not appearing?
1. Make sure captions are **enabled** in the video player
2. **Refresh the page** after installing the extension
3. Check that you're on an actual **video page** (not Tower home page)

### Extension not loading?
1. Go to `chrome://extensions/`
2. Verify **Developer mode** is enabled
3. Check for any error messages in the extension details

### Connection error?
1. Make sure the extension is **enabled** at `chrome://extensions/`
2. Try **clicking the extension icon** while on a Tower video page
3. Check the **DevTools console** for error messages

## Advanced: Modifying for Other Platforms 🔧

To adapt this for other video platforms:

1. **Inspect the caption HTML** on your target platform
2. **Update the selectors** in `content.js`:
   - Change `.vjs-text-track-display` to match your platform
   - Change `.vjs-text-track-cue` to match your platform
3. **Update `manifest.json`** to include the new URL pattern
4. **Test** and iterate

Example for a hypothetical platform:
```javascript
// Original (Tower)
const captionContainer = document.querySelector('.vjs-text-track-display');
const captionCues = document.querySelectorAll('.vjs-text-track-cue');

// New platform
const captionContainer = document.querySelector('.custom-captions-container');
const captionCues = document.querySelectorAll('.caption-text');
```

## FAQs ❓

**Q: Will this work with videos I've already watched?**
A: No, it only captures captions in real-time. You'd need to rewatch the video.

**Q: Can I use this on my phone?**
A: Not directly, but Chrome on Android supports extensions with some limitations.

**Q: Does this record audio or video?**
A: No, it only reads text from captions displayed on the page.

**Q: Will UT Austin ban me for using this?**
A: The extension is designed for accessibility and personal study. It doesn't violate any terms of service, but check your university's policies to be sure.

**Q: Can you make this for other platforms?**
A: Check the "Modifying for Other Platforms" section above. Contributions are welcome!

**Q: Is my data safe?**
A: Yes. All data stays on your computer. No external servers are contacted.

## Getting Help 🆘

1. **Check DevTools Console** - Press F12 while using the extension
2. **Verify extension is enabled** - Go to `chrome://extensions/`
3. **Try refreshing the page** - Sometimes helps with timing issues
4. **Open an issue** - Include browser version, Tower URL, and any error messages

