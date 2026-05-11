import { createClient } from '@/lib/supabase/client'

/**
 * Uploads a file to the public 'media' Supabase Storage bucket and returns its public URL.
 * Caller must be an authenticated admin (RLS-enforced).
 */
export async function uploadMedia(file: File): Promise<{ url?: string; error?: string }> {
  const supabase = createClient()

  // Generate safe filename: timestamp + random suffix + extension
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `cms/${safeName}`

  const { error } = await supabase.storage.from('media').upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: '31536000',
    upsert: false,
  })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return { url: data.publicUrl }
}
