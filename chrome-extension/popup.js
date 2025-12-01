/**
 * Pashto Dictionary Chrome Extension - Popup Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const compoundToggle = document.getElementById('compoundToggle');
  const statusEl = document.getElementById('status');
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Update status display
  function updateStatus(enabled) {
    if (enabled) {
      statusEl.className = 'status enabled';
      statusEl.innerHTML = '<span class="status-dot"></span><span>Active</span>';
    } else {
      statusEl.className = 'status disabled';
      statusEl.innerHTML = '<span class="status-dot"></span><span>Inactive</span>';
    }
  }
  
  // Load saved state
  chrome.storage.sync.get(['enabled', 'compoundMode'], (result) => {
    enableToggle.checked = result.enabled ?? false;
    compoundToggle.checked = result.compoundMode ?? false;
    updateStatus(result.enabled);
  });
  
  // Also try to get state from content script
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getState' });
    if (response) {
      enableToggle.checked = response.enabled;
      compoundToggle.checked = response.compoundMode;
      updateStatus(response.enabled);
    }
  } catch (e) {
    // Content script may not be loaded
  }
  
  // Handle enable toggle
  enableToggle.addEventListener('change', async () => {
    const enabled = enableToggle.checked;
    
    // Save state
    chrome.storage.sync.set({ enabled });
    updateStatus(enabled);
    
    // Send to content script
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    } catch (e) {
      console.log('Could not toggle - refreshing page may help');
    }
    
    // Update badge
    chrome.action.setBadgeText({ tabId: tab.id, text: enabled ? 'ON' : '' });
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#22c55e' });
  });
  
  // Handle compound toggle
  compoundToggle.addEventListener('change', async () => {
    const compoundMode = compoundToggle.checked;
    
    // Save state
    chrome.storage.sync.set({ compoundMode });
    
    // Send to content script
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleCompound' });
    } catch (e) {
      console.log('Could not toggle compound mode');
    }
  });
});

