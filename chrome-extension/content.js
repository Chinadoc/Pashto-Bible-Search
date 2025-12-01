/**
 * Pashto Dictionary Chrome Extension - Content Script
 * 
 * Provides hover-over dictionary functionality for Pashto text,
 * similar to Zhongwen for Chinese.
 */

(function() {
  'use strict';

  // Configuration
  const API_URL = 'https://pashto-bible-search.vercel.app/api/word-analysis';
  const PASHTO_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/;
  
  // State (session-only, no persistence)
  let isEnabled = false;
  let isCompoundMode = false;
  let currentPopup = null;
  let currentHighlight = null;
  let modeIndicator = null;
  let cache = new Map();
  let debounceTimer = null;
  let hasAskedForPermission = false;
  
  // Create mode indicator
  function createModeIndicator() {
    if (modeIndicator) return;
    
    modeIndicator = document.createElement('div');
    modeIndicator.className = 'pashto-dict-mode';
    modeIndicator.innerHTML = `
      <span class="pashto-dict-mode-dot"></span>
      <span class="pashto-dict-mode-text">پښتو قاموس ON</span>
    `;
    document.body.appendChild(modeIndicator);
  }
  
  // Show/hide mode indicator
  function updateModeIndicator() {
    if (!modeIndicator) createModeIndicator();
    
    if (isEnabled) {
      modeIndicator.classList.add('visible');
      modeIndicator.classList.toggle('compound', isCompoundMode);
      modeIndicator.querySelector('.pashto-dict-mode-text').textContent = 
        isCompoundMode ? 'Compound Mode' : 'پښتو قاموس ON';
    } else {
      modeIndicator.classList.remove('visible');
    }
  }
  
  // Check if text contains Pashto
  function containsPashto(text) {
    return PASHTO_REGEX.test(text);
  }
  
  // Get word at position in text node
  function getWordAtPosition(textNode, offset) {
    const text = textNode.textContent;
    if (!text || !containsPashto(text)) return null;
    
    // Find word boundaries
    let start = offset;
    let end = offset;
    
    // Move start back to beginning of word
    while (start > 0 && !isWordBoundary(text[start - 1])) {
      start--;
    }
    
    // Move end forward to end of word
    while (end < text.length && !isWordBoundary(text[end])) {
      end++;
    }
    
    const word = text.slice(start, end).trim();
    
    // Only return if it's Pashto
    if (!containsPashto(word)) return null;
    
    return {
      word: word.replace(/[،.؟!؛:«»\-]/g, ''),
      start,
      end,
      textNode
    };
  }
  
  // Check if character is a word boundary
  function isWordBoundary(char) {
    return /[\s،.؟!؛:«»\-\[\](){}]/.test(char);
  }
  
  // Get compound word (current + next word)
  function getCompoundWord(textNode, offset) {
    const text = textNode.textContent;
    const singleWord = getWordAtPosition(textNode, offset);
    if (!singleWord) return null;
    
    // Look for next word
    let nextStart = singleWord.end;
    while (nextStart < text.length && isWordBoundary(text[nextStart])) {
      nextStart++;
    }
    
    let nextEnd = nextStart;
    while (nextEnd < text.length && !isWordBoundary(text[nextEnd])) {
      nextEnd++;
    }
    
    const nextWord = text.slice(nextStart, nextEnd).trim().replace(/[،.؟!؛:«»\-]/g, '');
    
    if (containsPashto(nextWord)) {
      return {
        word: singleWord.word,
        nextWord: nextWord,
        compound: `${singleWord.word} ${nextWord}`,
        start: singleWord.start,
        end: nextEnd,
        textNode
      };
    }
    
    return singleWord;
  }
  
  // Create popup element
  function createPopup() {
    const popup = document.createElement('div');
    popup.className = 'pashto-dict-popup hidden';
    document.body.appendChild(popup);
    return popup;
  }
  
  // Get POS badge class
  function getPosClass(pos) {
    if (!pos) return 'pashto-dict-pos-other';
    const lower = pos.toLowerCase();
    if (lower.includes('verb')) return 'pashto-dict-pos-verb';
    if (lower.includes('noun')) return 'pashto-dict-pos-noun';
    if (lower.includes('adj')) return 'pashto-dict-pos-adjective';
    return 'pashto-dict-pos-other';
  }
  
  // Render popup content
  function renderPopup(data, word) {
    if (!currentPopup) currentPopup = createPopup();
    
    let html = `
      <div class="pashto-dict-header">
        <span class="pashto-dict-word">${data.word || word}</span>
        ${data.pos ? `<span class="pashto-dict-pos ${getPosClass(data.pos)}">${data.pos}</span>` : ''}
      </div>
      <div class="pashto-dict-body">
    `;
    
    // Romanization
    if (data.romanized) {
      html += `<div class="pashto-dict-romanized">${data.romanized}</div>`;
    }
    
    // English definition
    if (data.english) {
      html += `<div class="pashto-dict-english">${data.english}</div>`;
    }
    
    // Base form
    if (data.baseForm && data.baseForm !== data.word) {
      html += `
        <div class="pashto-dict-base">
          <span class="pashto-dict-base-label">Base:</span>
          <span class="pashto-dict-base-word">${data.baseForm}</span>
        </div>
      `;
    }
    
    // Grammatical tags
    const tags = [];
    if (data.person) tags.push({ label: data.person + (data.number ? ' ' + data.number : ''), class: 'person' });
    if (data.tense) tags.push({ label: data.tense, class: 'tense' });
    if (data.mood && data.mood !== 'indicative') tags.push({ label: data.mood, class: 'mood' });
    if (data.gender) tags.push({ label: data.gender, class: 'gender' });
    if (data.inflectionState) tags.push({ label: data.inflectionState, class: 'inflection' });
    
    if (tags.length > 0) {
      html += `<div class="pashto-dict-grammar">`;
      for (const tag of tags) {
        html += `<span class="pashto-dict-tag pashto-dict-tag-${tag.class}">${tag.label}</span>`;
      }
      html += `</div>`;
    }
    
    // Compound verb info
    if (data.compoundVerbInfo) {
      const cvi = data.compoundVerbInfo;
      html += `
        <div class="pashto-dict-compound">
          <div class="pashto-dict-compound-title">Compound Verb</div>
          <div class="pashto-dict-compound-form">${cvi.fullForm}</div>
          <div class="pashto-dict-compound-meaning">${cvi.meaning} — ${cvi.note || ''}</div>
        </div>
      `;
    }
    
    html += `</div>`;
    
    // Footer with shortcuts
    html += `
      <div class="pashto-dict-footer">
        <span class="pashto-dict-shortcut">
          <span class="pashto-dict-key">Alt+C</span> toggle compound
        </span>
        <span class="pashto-dict-shortcut">
          <span class="pashto-dict-key">Alt+P</span> toggle off
        </span>
      </div>
    `;
    
    currentPopup.innerHTML = html;
    currentPopup.classList.remove('hidden');
    
    return currentPopup;
  }
  
  // Position popup near target
  function positionPopup(popup, x, y) {
    const rect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = x + 10;
    let top = y + 20;
    
    // Adjust if overflowing right
    if (left + rect.width > viewportWidth - 20) {
      left = viewportWidth - rect.width - 20;
    }
    
    // Adjust if overflowing bottom
    if (top + rect.height > viewportHeight - 20) {
      top = y - rect.height - 10;
    }
    
    // Ensure not off screen left
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }
  
  // Hide popup
  function hidePopup() {
    if (currentPopup) {
      currentPopup.classList.add('hidden');
    }
    if (currentHighlight) {
      currentHighlight.classList.remove('pashto-dict-highlight', 'pashto-dict-highlight-compound');
      currentHighlight = null;
    }
  }
  
  // Fetch word analysis
  async function fetchAnalysis(word, context) {
    const cacheKey = `${word}|${context?.slice(0, 100) || ''}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    try {
      const params = new URLSearchParams({
        word: word,
        context: context || ''
      });
      
      const response = await fetch(`${API_URL}?${params}`);
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      cache.set(cacheKey, data);
      
      // Limit cache size
      if (cache.size > 500) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return data;
    } catch (error) {
      console.error('Pashto Dict: Fetch error', error);
      return null;
    }
  }
  
  // Handle mouse move
  function handleMouseMove(event) {
    if (!isEnabled) return;
    
    // Clear debounce
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(async () => {
      const target = event.target;
      
      // Skip if hovering over our popup
      if (target.closest('.pashto-dict-popup, .pashto-dict-mode')) {
        return;
      }
      
      // Get text node and position
      const range = document.caretRangeFromPoint(event.clientX, event.clientY);
      if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
        hidePopup();
        return;
      }
      
      // Get word at position
      const wordInfo = isCompoundMode
        ? getCompoundWord(range.startContainer, range.startOffset)
        : getWordAtPosition(range.startContainer, range.startOffset);
      
      if (!wordInfo || !wordInfo.word) {
        hidePopup();
        return;
      }
      
      // Get context (surrounding text)
      const context = range.startContainer.textContent;
      
      // Highlight the word
      // Note: We can't easily highlight text in a text node, so we'll just style the parent
      if (currentHighlight) {
        currentHighlight.classList.remove('pashto-dict-highlight', 'pashto-dict-highlight-compound');
      }
      currentHighlight = target;
      currentHighlight.classList.add(isCompoundMode ? 'pashto-dict-highlight-compound' : 'pashto-dict-highlight');
      
      // Fetch analysis
      const word = isCompoundMode && wordInfo.compound ? wordInfo.compound : wordInfo.word;
      const data = await fetchAnalysis(word, context);
      
      if (data) {
        const popup = renderPopup(data, word);
        positionPopup(popup, event.clientX, event.clientY);
      } else {
        hidePopup();
      }
    }, 100);
  }
  
  // Handle key press
  function handleKeyDown(event) {
    // Alt+P to toggle extension
    if (event.altKey && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      isEnabled = !isEnabled;
      updateModeIndicator();
      if (!isEnabled) hidePopup();
    }
    
    // Alt+C to toggle compound mode
    if (event.altKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      isCompoundMode = !isCompoundMode;
      updateModeIndicator();
    }
    
    // N for next word (when popup visible)
    if (isEnabled && currentPopup && !currentPopup.classList.contains('hidden')) {
      if (event.key.toLowerCase() === 'n') {
        // TODO: Navigate to next word
      }
      if (event.key.toLowerCase() === 'b') {
        // TODO: Navigate to previous word
      }
    }
  }
  
  // Initialize
  function init() {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', hidePopup, { passive: true });
    
    // Listen for messages from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggle') {
        isEnabled = !isEnabled;
        updateModeIndicator();
        if (!isEnabled) hidePopup();
        sendResponse({ enabled: isEnabled });
      }
      if (message.action === 'toggleCompound') {
        isCompoundMode = !isCompoundMode;
        updateModeIndicator();
        sendResponse({ compoundMode: isCompoundMode });
      }
      if (message.action === 'getState') {
        sendResponse({ enabled: isEnabled, compoundMode: isCompoundMode });
      }
      return true; // Keep channel open for async response
    });
    
    // Extension starts disabled - user can toggle with Alt+P
    isEnabled = false;
    isCompoundMode = false;
    updateModeIndicator();
    
    console.log('Pashto Dictionary Extension loaded - Press Alt+P to enable');
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

