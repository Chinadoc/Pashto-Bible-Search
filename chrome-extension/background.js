/**
 * Pashto Dictionary Chrome Extension - Background Service Worker
 */

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    
    // Update icon badge to show state
    const text = response?.enabled ? 'ON' : '';
    chrome.action.setBadgeText({ tabId: tab.id, text });
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#22c55e' });
    
    // Save state
    chrome.storage.sync.set({ enabled: response?.enabled ?? false });
  } catch (error) {
    console.log('Could not toggle - page may not be loaded yet');
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'toggle_compound_mode') {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleCompound' });
    } catch (error) {
      console.log('Could not toggle compound mode');
    }
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: false,
    compoundMode: false,
    apiUrl: 'https://pashto-bible-search.vercel.app/api/word-analysis'
  });
  
  console.log('Pashto Dictionary Extension installed');
});

