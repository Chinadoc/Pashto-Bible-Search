/**
 * Main script to process LingDocs dictionary and populate D1 database
 * Run this script to align your D1 database with LingDocs format
 */

import { processLingDocsDictionary } from './main_processing';

// This is a wrapper that can be called from the shell script
// The actual implementation is in main_processing.ts

export { processLingDocsDictionary };

