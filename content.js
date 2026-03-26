/**
 * Content Script for UT Austin Tower Caption Extraction
 * This script runs on the webpage and listens for captions in real-time
 */

let capturedCaptions = [];
let captionTimestamps = [];
let isListening = false;
let previousCaption = '';

/**
 * Extract caption text from a Video.js text track cue element
 */
function extractCaptionFromElement(element) {
  // The caption text is usually in a nested div
  const textContent = element.textContent.trim();
  return textContent;
}

/**
 * Get all current captions from the video player
 */
function getAllCaptionsFromPlayer() {
  const captions = [];

  // Method 1: Try to access Video.js player directly
  if (window.videojs) {
    try {
      const players = Object.values(window.videojs.getAllPlayers());
      for (const player of players) {
        if (player && player.remoteTextTracks && player.remoteTextTracks()) {
          const tracks = player.remoteTextTracks();
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            if (track.kind === 'captions' || track.kind === 'subtitles') {
              if (track.cues) {
                for (let j = 0; j < track.cues.length; j++) {
                  const cue = track.cues[j];
                  captions.push({
                    text: cue.text,
                    startTime: cue.startTime,
                    endTime: cue.endTime
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('Could not access Video.js tracks:', e);
    }
  }

  return captions;
}

/**
 * Add a caption if it's new
 */
function addCaptionIfNew(text) {
  if (text && text !== previousCaption) {
    if (text.length > 0) {
      capturedCaptions.push(text);
      previousCaption = text;

      // Notify popup of update (silently fail if popup not open)
      try {
        chrome.runtime.sendMessage({
          action: 'updateCaptionCount',
          count: capturedCaptions.length
        }).catch(() => {
          // Silently ignore errors (popup may not be open)
        });
      } catch (e) {
        // Extension context may have changed, ignore silently
      }

      return true;
    }
  }
  return false;
}

/**
 * Watch for caption changes in real-time - AUTOMATIC
 */
function startCapturingCaptions() {
  if (isListening) return;
  isListening = true;

  // Find the caption container
  const captionContainer = document.querySelector('.vjs-text-track-display');

  if (!captionContainer) {
    console.log('Caption container not found. Player may not be loaded yet.');
    isListening = false;
    return;
  }

  // Watch for changes in the caption container
  const observer = new MutationObserver(() => {
    // Find all active caption cues
    const captionCues = document.querySelectorAll('.vjs-text-track-cue');

    captionCues.forEach(cue => {
      const text = cue.textContent.trim();
      addCaptionIfNew(text);
    });
  });

  // Start observing the caption container for changes
  observer.observe(captionContainer, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log('✅ Automatic caption capture started - captions will be captured as you watch');
}

/**
 * Also check periodically in case mutations aren't caught
 */
function startPeriodicCheck() {
  setInterval(() => {
    const captionCues = document.querySelectorAll('.vjs-text-track-cue');

    captionCues.forEach(cue => {
      const text = cue.textContent.trim();
      addCaptionIfNew(text);
    });
  }, 500);
}

/**
 * Format captions into readable text
 */
function formatCaptions() {
  return capturedCaptions.join('\n\n');
}

/**
 * Clear captured captions
 */
function clearCaptions() {
  capturedCaptions = [];
  captionTimestamps = [];
  previousCaption = '';
}

/**
 * Listen for messages from the popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startCapture') {
    startCapturingCaptions();
    sendResponse({ status: 'capturing' });
  }
  else if (request.action === 'getCaptions') {
    // First, try to get any captions we haven't captured yet from Video.js
    const allCaptions = getAllCaptionsFromPlayer();
    if (allCaptions.length > capturedCaptions.length) {
      // We got more captions from the player
      allCaptions.forEach(caption => {
        if (!capturedCaptions.includes(caption.text)) {
          capturedCaptions.push(caption.text);
        }
      });
    }

    sendResponse({
      captions: formatCaptions(),
      count: capturedCaptions.length
    });
  }
  else if (request.action === 'clearCaptions') {
    clearCaptions();
    sendResponse({ status: 'cleared' });
  }
  else if (request.action === 'getCaptionCount') {
    sendResponse({
      count: capturedCaptions.length,
      captions: capturedCaptions
    });
  }
});

// Start AUTOMATIC capturing when the page loads
// Wait a bit for the video player to initialize
setTimeout(() => {
  startCapturingCaptions();
  startPeriodicCheck();
}, 2000);

console.log('✅ Caption extractor loaded - automatic capture active');