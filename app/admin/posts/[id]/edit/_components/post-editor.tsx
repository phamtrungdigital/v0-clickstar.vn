'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Save, Trash2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/cms/posts'
import { savePost, deletePost, type PostUpdate } from '../actions'
import { I18nInput, TextInput } from '@/app/admin/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'
import { AiWholePost } from './ai-whole-post'
import { AiCoverImage } from './ai-cover-image'
import { BodyImageReplacer } from './body-image-replacer'
import { MarkdownEditor } from './markdown-editor'

const EMPTY_I18N = { vi: '', en: '' }

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đ]/g, 'd')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export function PostEditor({ post, mode }: { post: Post | null; mode: 'new' | 'edit' }) {
  return (
    <EditLangProvider initial="vi">
      <PostEditorInner post={post} mode={mode} />
    </EditLangProvider>
  )
}

function PostEditorInner({ post, mode }: { post: Post | null; mode: 'new' | 'edit' }) {
  const isNew = mode === 'new'

  const [draft, setDraft] = useState<PostUpdate>({
    slug: post?.slug ?? '',
    title: post?.title ?? EMPTY_I18N,
    excerpt: post?.excerpt ?? EMPTY_I18N,
    content: post?.content ?? EMPTY_I18N,
    cover_image: post?.cover_image ?? null,
    tags: post?.tags ?? [],
    status: post?.status ?? 'draft',
    seo_title: post?.seo_title ?? null,
    seo_description: post?.seo_description ?? null,
    og_image: post?.og_image ?? null,
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = <K extends keyof PostUpdate>(key: K, value: PostUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await savePost(post?.id ?? 'new', draft)
      if (result && 'error' in result && result.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      }
    })
  }

  const handleDelete = () => {
    if (!post) return
    if (!confirm(`Xoá bài "${draft.title.vi}"? Hành động này không thể hoàn tác.`)) return
    startTransition(async () => {
      await deletePost(post.id, post.slug)
    })
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="text-xs text-slate-500 hover:text-slate-700">
            ← Bài viết
          </Link>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            {isNew ? 'Thêm bài viết mới' : draft.title.vi || '(chưa có tiêu đề)'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <AiWholePost
            onApply={(p) => {
              setDraft((prev) => ({
                ...prev,
                title: { vi: p.title_vi, en: p.title_en },
                excerpt: { vi: p.excerpt_vi, en: p.excerpt_en },
                content: { vi: p.content_vi, en: p.content_en },
                // Slug: prefer SEO keyword, fall back to VI title
                slug: prev.slug || slugify(p.keyword || p.title_vi),
                // Auto-fill tags from keyword if empty
                tags: prev.tags.length === 0 && p.keyword ? [p.keyword.trim()] : prev.tags,
              }))
              setStatus('dirty')
            }}
          />
          <LangSwitcher />

          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã lưu
            </span>
          )}
          {status === 'dirty' && <span className="text-xs text-amber-600">● Chưa lưu</span>}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" />
              Lỗi
            </span>
          )}

          {!isNew && post && draft.status === 'published' && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem
            </Link>
          )}

          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xoá
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
        {/* Main */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Nội dung</h2>
            <I18nInput label="Tiêu đề" value={draft.title} onChange={(v) => update('title', v)} />
            <TextInput
              label="Slug (URL)"
              value={draft.slug}
              onChange={(v) =>
                update(
                  'slug',
                  v
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                )
              }
              hint={`URL: /blog/${draft.slug || 'ten-bai-viet'}`}
            />
            <I18nInput
              label="Mô tả ngắn (excerpt)"
              multiline
              rows={2}
              value={draft.excerpt}
              onChange={(v) => update('excerpt', v)}
            />
            <MarkdownEditor
              label="Nội dung (Markdown)"
              rows={20}
              value={draft.content}
              onChange={(v) => update('content', v)}
            />
            <BodyImageReplacer
              content={draft.content}
              onContentChange={(next) => update('content', next)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cài đặt</h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Trạng thái
              </label>
              <select
                value={draft.status}
                onChange={(e) => update('status', e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm"
              >
                <option value="draft">Draft (chưa publish)</option>
                <option value="published">Published (hiển thị công khai)</option>
              </select>
            </div>

            <TextInput
              label="Tags (cách nhau bởi dấu phẩy)"
              value={draft.tags.join(', ')}
              onChange={(v) =>
                update(
                  'tags',
                  v
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              hint="VD: AI, Marketing, Dashboard"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Cover image
              </h2>
              <AiCoverImage
                postTitle={draft.title.vi || draft.title.en}
                onApply={(url) => update('cover_image', url)}
              />
            </div>
            <ImagePicker
              label=""
              value={draft.cover_image ?? ''}
              onChange={(v) => update('cover_image', v.trim() === '' ? null : v)}
            />
          </div>
        </div>
      </div>

      {status === 'error' && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {errorMsg}
        </div>
      )}
    </div>
  )
}
