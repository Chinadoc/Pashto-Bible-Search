#!/usr/bin/env node
/**
 * Upload Isaiah audio files to Supabase Storage and update database
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadIsaiahAudioFiles() {
  console.log('🚀 Starting Isaiah audio upload...')
  
  const isaiahDir = 'ot_audio_files/isaiah'
  
  if (!existsSync(isaiahDir)) {
    console.error(`❌ Isaiah directory not found: ${isaiahDir}`)
    return
  }
  
  let uploadedCount = 0
  let failedCount = 0
  
  try {
    // Import fs for directory reading
    const { readdir, readFile } = await import('fs/promises')
    const { join } = await import('path')
    
    const chapterDirs = await readdir(isaiahDir, { withFileTypes: true })
    
    for (const chapterDir of chapterDirs) {
      if (!chapterDir.isDirectory() || !chapterDir.name.startsWith('chapter-')) {
        continue
      }
      
      console.log(`📁 Processing ${chapterDir.name}`)
      
      const chapterPath = join(isaiahDir, chapterDir.name)
      const files = await readdir(chapterPath)
      
      for (const file of files) {
        if (!file.endsWith('.mp3')) continue
        
        try {
          const filePath = join(chapterPath, file)
          const fileData = readFileSync(filePath)
          
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('audio')
            .upload(file, fileData, {
              contentType: 'audio/mpeg',
              upsert: true // Overwrite if exists
            })
          
          if (error) {
            console.error(`❌ Failed to upload ${file}:`, error.message)
            failedCount++
          } else {
            console.log(`✅ Uploaded ${file}`)
            uploadedCount++
          }
        } catch (err) {
          console.error(`❌ Error uploading ${file}:`, err.message)
          failedCount++
        }
      }
    }
    
    console.log(`\n📊 Upload Summary:`)
    console.log(`✅ Successfully uploaded: ${uploadedCount}`)
    console.log(`❌ Failed uploads: ${failedCount}`)
    
  } catch (err) {
    console.error('❌ Error reading directory:', err.message)
  }
}

async function updateVersesTable() {
  console.log('🔄 Updating verses table...')
  
  try {
    // Get all Isaiah verses
    const { data: verses, error: fetchError } = await supabase
      .from('verses')
      .select('id, book, chapter, verse')
      .eq('book', 'Isaiah')
    
    if (fetchError) {
      console.error('❌ Error fetching Isaiah verses:', fetchError.message)
      return
    }
    
    if (!verses || verses.length === 0) {
      console.log('❌ No Isaiah verses found in database')
      return
    }
    
    let updatedCount = 0
    
    for (const verse of verses) {
      const chapter = verse.chapter
      const verseNum = verse.verse
      
      // Generate expected filename
      const filename = `isaiah${chapter.toString().padStart(3, '0')}_verse_${verseNum.toString().padStart(3, '0')}.mp3`
      
      // Update the verse with the audio filename
      const { error: updateError } = await supabase
        .from('verses')
        .update({ audio_filename: filename })
        .eq('id', verse.id)
      
      if (updateError) {
        console.error(`❌ Failed to update verse ${verse.id}:`, updateError.message)
      } else {
        updatedCount++
      }
    }
    
    console.log(`✅ Updated ${updatedCount} Isaiah verses with audio filenames`)
    
  } catch (err) {
    console.error('❌ Error updating verses table:', err.message)
  }
}

async function main() {
  console.log('🚀 Starting Isaiah audio upload process...')
  
  // Upload audio files
  await uploadIsaiahAudioFiles()
  
  // Update database
  await updateVersesTable()
  
  console.log('✅ Isaiah audio upload process completed!')
}

main().catch(console.error)
