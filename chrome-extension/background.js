/**
 * Pashto Dictionary Chrome Extension - Background Service Worker
 * 
 * Dynamically injects content script when user clicks the extension icon.
 * This avoids needing host permissions and privacy policy.
 */

// Track which tabs have the content script injected
const injectedTabs = new Set();

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // If not already injected, inject the content script
    if (!injectedTabs.has(tab.id)) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      });
      injectedTabs.add(tab.id);
    }
    
    // Send toggle message
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    
    // Update icon badge to show state
    const text = response?.enabled ? 'ON' : '';
    chrome.action.setBadgeText({ tabId: tab.id, text });
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#22c55e' });
  } catch (error) {
    console.log('Could not toggle extension:', error);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'toggle_compound_mode') {
    try {
      // Inject if needed
      if (!injectedTabs.has(tab.id)) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        injectedTabs.add(tab.id);
      }
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleCompound' });
    } catch (error) {
      console.log('Could not toggle compound mode');
    }
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Pashto Dictionary Extension installed');
  console.log('Click the extension icon to enable on any page');
});

