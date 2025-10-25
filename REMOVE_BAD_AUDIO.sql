-- Remove the placeholder audio that's causing issues
-- This fixes the problem where wrong audio is being downloaded

-- For Afghan 2023: Remove ALL placeholder audio (most shouldn't have audio anyway)
UPDATE public.verses
SET audio_public_url = NULL, audio_storage_path = NULL
WHERE audio_public_url LIKE '%1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY%'
   OR audio_public_url IS NOT NULL AND audio_public_url LIKE '%drive.google.com%';

-- For Yousafzai: Only keep audio if it has the correct pattern
-- (You can verify these manually later)
-- For now, comment out if you want to keep them
-- UPDATE public.verses_yousafzai
-- SET audio_public_url = NULL, audio_storage_path = NULL
-- WHERE audio_public_url LIKE '%1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY%';

-- Verify what we removed
SELECT 'Afghan 2023 after cleanup' as label, COUNT(*) as verses_with_audio
FROM public.verses
WHERE audio_public_url IS NOT NULL;

SELECT 'Yousafzai after cleanup' as label, COUNT(*) as verses_with_audio  
FROM public.verses_yousafzai
WHERE audio_public_url IS NOT NULL;
