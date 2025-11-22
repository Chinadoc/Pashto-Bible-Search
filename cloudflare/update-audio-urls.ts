/**
 * Update audio_public_url fields in the database to use r2.dev public URLs
 */

export async function updateAudioUrls(env: any) {
  const publicBaseUrl = 'https://pub-03f80a5e522e408e9ff0f40c3392140f.r2.dev';

  // Update Afghan2023 verses
  await env.DB.prepare(`
    UPDATE verses_afghan2023
    SET audio_public_url = ? || '/' || audio_r2_key
    WHERE audio_r2_key IS NOT NULL AND audio_public_url IS NULL
  `).bind(publicBaseUrl).run();

  // Update Yousafzai verses
  await env.DB.prepare(`
    UPDATE verses_yousafzai
    SET audio_public_url = ? || '/' || audio_r2_key
    WHERE audio_r2_key IS NOT NULL AND audio_public_url IS NULL
  `).bind(publicBaseUrl).run();

  return { success: true };
}
