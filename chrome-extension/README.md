# Pashto Dictionary Chrome Extension - پښتو قاموس

A Chrome extension for looking up Pashto words by hovering, similar to [Zhongwen](https://chrome.google.com/webstore/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde) for Chinese.

## Features

- **Hover to look up**: Simply hover over any Pashto text to see:
  - Word definition in English
  - Romanization/transliteration
  - Part of speech (verb, noun, adjective, etc.)
  - Grammatical information (person, tense, mood, gender)
  - Base form / lemma
  
- **Compound verb detection**: Toggle compound mode (Alt+C) to see:
  - Combined meanings for compound verbs like "تېر کړم" (to pass)
  - Dynamic compounds like "دوام ورکړي" (to continue)
  - Stative compounds like "پاتې شم" (to stay)

- **Keyboard navigation**: 
  - `Alt+P` - Toggle extension on/off
  - `Alt+C` - Toggle compound word mode
  - `N` - Move to next word
  - `B` - Move to previous word

## Installation

### From Chrome Web Store (Coming Soon)
Search for "Pashto Dictionary" in the Chrome Web Store.

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `chrome-extension` folder
6. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon or press `Alt+P` to activate
2. Hover over any Pashto text on a webpage
3. A popup will appear showing the word's meaning and grammatical info
4. Press `Alt+C` to toggle between single-word and compound-word modes

## Compound Word Mode

Pashto has many compound verbs where a noun/adjective combines with an auxiliary:

- **Stative compounds**: پاتې کېدل (to stay), تېر کول (to pass something)
- **Dynamic compounds**: مرسته کول (to help), دوام ورکول (to continue)

In compound mode, hovering shows the combined meaning along with conjugation info.

## API

This extension uses the Pashto Bible Search API for word analysis:
https://pashto-bible-search.vercel.app/api/word-analysis

## Building Icons

The extension requires icons in these sizes:
- icons/icon16.png (16x16)
- icons/icon48.png (48x48)
- icons/icon128.png (128x128)

You can generate these from an SVG using any image editing tool.

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content.js` - Injected script for hover detection
- `content.css` - Popup styling
- `background.js` - Service worker for toggle/shortcuts
- `popup.html/css/js` - Extension popup UI

## License

MIT License - Free to use and modify.

## Credits

- Powered by [Pashto Bible Search](https://pashto-bible-search.vercel.app)
- Inspired by [Zhongwen Chinese Dictionary](https://github.com/cschiller/zhongwen)
- Dictionary data from [LingDocs](https://lingdocs.com)

