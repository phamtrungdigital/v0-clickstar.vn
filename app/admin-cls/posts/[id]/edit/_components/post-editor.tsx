'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Save, Trash2, CheckCircle2, AlertCircle, ExternalLink, AlertTriangle } from 'lucide-react'
import type { Post } from '@/lib/cms/posts'
import { savePost, deletePost, type PostUpdate } from '../actions'
import { I18nInput, TextInput } from '@/app/admin-cls/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'
import { AiWholePost } from './ai-whole-post'
import { AiCoverImage } from './ai-cover-image'
import { BodyImageReplacer } from './body-image-replacer'
import { MarkdownEditor } from './markdown-editor'
import { AutoTranslate } from './auto-translate'
import { AiFullDraft } from './ai-full-draft'
import { countExpertPlaceholders } from '@/lib/ai/content-rules'

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

type EditorProps = { post: Post | null; mode: 'new' | 'edit'; currentEditorName?: string | null }

export function PostEditor(props: EditorProps) {
  return (
    <EditLangProvider initial="vi">
      <PostEditorInner {...props} />
    </EditLangProvider>
  )
}

function PostEditorInner({ post, mode, currentEditorName }: EditorProps) {
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
    // Cột nhãn AI có thể chưa có trong DB (undefined) → giữ undefined để không gửi lên.
    ai_assisted: post ? post.ai_assisted : false,
    editor_name: post?.editor_name ?? null,
    editor_title: post?.editor_title ?? null,
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [warning, setWarning] = useState('')
  const expertLeft = countExpertPlaceholders(draft.content.vi) + countExpertPlaceholders(draft.content.en)

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
        setWarning(result && 'warning' in result && result.warning ? result.warning : '')
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
          <Link href="/admin-cls/posts" className="text-xs text-slate-500 hover:text-slate-700">
            ← Bài viết
          </Link>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            {isNew ? 'Thêm bài viết mới' : draft.title.vi || '(chưa có tiêu đề)'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <AiFullDraft
            onApply={(r) => {
              if (
                draft.status === 'published' &&
                !confirm(
                  'Bài này đang đăng công khai. Đưa bản nháp AI vào sẽ chuyển bài về Draft (bấm Lưu thì bài tạm gỡ khỏi blog, ngày đăng gốc vẫn giữ). Tiếp tục?'
                )
              ) {
                return false
              }
              setDraft((prev) => ({
                ...prev,
                title: r.title,
                excerpt: r.excerpt,
                content: r.content,
                slug: prev.slug || r.slug,
                tags: prev.tags.length ? prev.tags : r.tags,
                seo_title: r.seo_title,
                seo_description: r.seo_description,
                cover_image: r.cover_image ?? prev.cover_image,
                og_image: r.cover_image ?? prev.og_image,
                status: 'draft',
                ai_assisted: true,
                editor_name: prev.editor_name || currentEditorName || null,
              }))
              setStatus('dirty')
              return true
            }}
          />
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
                // Bài AI viết → bật nhãn AI, mặc định người biên tập là người đang soạn.
                ai_assisted: true,
                editor_name: prev.editor_name || currentEditorName || null,
              }))
              setStatus('dirty')
            }}
          />
          <AutoTranslate
            title={draft.title}
            excerpt={draft.excerpt}
            content={draft.content}
            onApply={(fields) => {
              setDraft((prev) => ({
                ...prev,
                title: fields.title !== undefined ? { ...prev.title, en: fields.title } : prev.title,
                excerpt:
                  fields.excerpt !== undefined
                    ? { ...prev.excerpt, en: fields.excerpt }
                    : prev.excerpt,
                content:
                  fields.content !== undefined
                    ? { ...prev.content, en: fields.content }
                    : prev.content,
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
              onReplaceMarker={(raw, replacement) => {
                setDraft((prev) => ({
                  ...prev,
                  content: {
                    vi: prev.content.vi.split(raw).join(replacement),
                    en: prev.content.en.split(raw).join(replacement),
                  },
                }))
                setStatus('dirty')
              }}
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

          {expertLeft > 0 && (
            <div className="flex gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Còn {expertLeft} ô <code>[[CHUYÊN GIA: ...]]</code> trong nội dung. Thay bằng kinh nghiệm thật (hoặc xoá) rồi mới đăng được.
              </span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Nhãn AI</h2>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={!!draft.ai_assisted}
                onChange={(e) => {
                  update('ai_assisted', e.target.checked)
                  if (e.target.checked && !draft.editor_name && currentEditorName) update('editor_name', currentEditorName)
                }}
                className="mt-0.5"
              />
              <span>Bài có AI hỗ trợ soạn (hiện nhãn AI ở đầu bài, cả 2 ngôn ngữ)</span>
            </label>
            {draft.ai_assisted && (
              <>
                <TextInput
                  label="Người biên tập *"
                  value={draft.editor_name ?? ''}
                  onChange={(v) => update('editor_name', v)}
                  hint="Người đọc lại, kiểm nguồn và chịu trách nhiệm nội dung"
                />
                <TextInput
                  label="Chức danh"
                  value={draft.editor_title ?? ''}
                  onChange={(v) => update('editor_title', v)}
                  hint="VD: Trưởng nhóm Marketing"
                />
              </>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">SEO</h2>
            <I18nInput
              label="Tiêu đề SEO (tối đa ~60 ký tự)"
              value={draft.seo_title ?? EMPTY_I18N}
              onChange={(v) => update('seo_title', v)}
            />
            <I18nInput
              label="Mô tả SEO (140-160 ký tự)"
              multiline
              rows={3}
              value={draft.seo_description ?? EMPTY_I18N}
              onChange={(v) => update('seo_description', v)}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Cover image
              </h2>
              <AiCoverImage
                postTitle={draft.title.vi || draft.title.en}
                tags={draft.tags}
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
      {warning && status !== 'error' && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">{warning}</div>
      )}
    </div>
  )
}
