/**
 * Popup Script for Caption Extractor
 * Handles button clicks and communicates with content script
 */

const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const captionText = document.getElementById('captionText');
const statusDiv = document.getElementById('status');
const captionCountEl = document.getElementById('captionCount');
const captionDurationEl = document.getElementById('captionDuration');

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  if (type !== 'error') {
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }
}

/**
 * Update caption count display
 */
function updateStats() {
  const count = captionText.value.split('\n\n').filter(c => c.trim()).length;
  captionCountEl.textContent = count;
  
  // Rough estimate: average caption is ~3 seconds
  const estimatedDuration = Math.round(count * 3);
  const minutes = Math.floor(estimatedDuration / 60);
  const seconds = estimatedDuration % 60;
  captionDurationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Extract captions from current page
 */
extractBtn.addEventListener('click', async () => {
  extractBtn.disabled = true;
  showStatus('Extracting captions...', 'info');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'getCaptions' },
      (response) => {
        if (chrome.runtime.lastError) {
          showStatus('❌ Error: Could not connect to page. Make sure you\'re on a Tower video page.', 'error');
          extractBtn.disabled = false;
          return;
        }

        if (response && response.captions) {
          captionText.value = response.captions;
          updateStats();
          showStatus(`✅ Extracted ${response.count} captions!`, 'success');
        } else {
          showStatus('❌ No captions found. Make sure captions are enabled.', 'error');
        }
        
        extractBtn.disabled = false;
      }
    );
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
    extractBtn.disabled = false;
  }
});

/**
 * Copy captions to clipboard
 */
copyBtn.addEventListener('click', async () => {
  if (!captionText.value) {
    showStatus('⚠️ No captions to copy. Extract first!', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(captionText.value);
    showStatus('✅ Copied to clipboard!', 'success');
  } catch (error) {
    showStatus('❌ Failed to copy: ' + error.message, 'error');
  }
});

/**
 * Download captions as text file
 */
downloadBtn.addEventListener('click', () => {
  if (!captionText.value) {
    showStatus('⚠️ No captions to download. Extract first!', 'error');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `lecture_captions_${timestamp}.txt`;
  
  const blob = new Blob([captionText.value], { type: 'text/plain; charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showStatus(`✅ Downloaded as ${filename}`, 'success');
});

/**
 * Clear captions
 */
clearBtn.addEventListener('click', async () => {
  if (!captionText.value) {
    showStatus('⚠️ Nothing to clear', 'error');
    return;
  }

  const confirmed = confirm('Are you sure you want to clear all captions?');
  if (!confirmed) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'clearCaptions' },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        
        captionText.value = '';
        updateStats();
        showStatus('✅ Captions cleared', 'success');
      }
    );
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
  }
});

/**
 * Update stats when user types manually
 */
captionText.addEventListener('input', updateStats);

/**
 * Load any previously extracted captions when popup opens
 */
window.addEventListener('load', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'getCaptionCount' },
      (response) => {
        if (response && response.count > 0) {
          showStatus(`📊 ${response.count} captions ready. Click "Extract Captions" to load them.`, 'info');
        }
      }
    );
  } catch (error) {
    console.log('Could not connect to page yet');
  }
});

console.log('Popup script loaded');
