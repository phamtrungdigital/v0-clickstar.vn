'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadMedia } from '@/lib/cms/upload'

export function ImagePicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)
    const result = await uploadMedia(file)
    setUploading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.url) onChange(result.url)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = '' // allow re-uploading same file
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>

      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-32 h-24 flex-shrink-0 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative group"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="Xoá"
            >
              <X className="w-3 h-3 text-slate-700" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            onChange={onFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Đang upload…
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Upload ảnh
              </>
            )}
          </button>

          <input
            type="text"
            value={value}
            placeholder="https://… hoặc kéo thả ảnh vào ô bên trái"
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono truncate"
          />

          {error && <p className="text-[10px] text-red-600">⚠ {error}</p>}
          {hint && !error && <p className="text-[10px] text-slate-500">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
