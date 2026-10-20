'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadMedia } from '@/lib/cms/upload'
import { btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'

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
      <label className={fieldLabelClass}>{label}</label>

      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="group relative flex h-24 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--ad-line-2)] bg-[var(--ad-fill-soft)]"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-[var(--ad-fg-3)]" />
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Xoá ảnh"
              className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
              title="Xoá ảnh"
            >
              <X className="h-3 w-3 text-[var(--ad-fg-2)]" />
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
            className={btn('primary', 'sm')}
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
            className={fieldInputClass + ' truncate !py-1.5 !text-[13px]'}
          />

          {error && <p className="text-[12.5px] text-[#d70015]">{error}</p>}
          {hint && !error && <p className="text-[12.5px] text-[var(--ad-fg-3)]">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
