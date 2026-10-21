'use client'

import { AI_MODULE_ENABLED } from '@/lib/ai/module-flag'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Trash2, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/cms/posts'
import { savePost, deletePost, type PostSave, type PostUpdate, type SeoPatch } from '../actions'
import { I18nInput, TextInput } from '@/app/admin-cls/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher, useEditLang } from '@/lib/cms/edit-lang-context'
import { SeoPanel, TONE_TEXT } from '@/app/admin-cls/seo/_components/seo-panel'
import { analyze, scoreTone, type SeoDraft, type SeoItem } from '@/lib/seo/admin-seo'
import { SITE_URL } from '@/lib/seo/site'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { cn } from '@/lib/utils'
import { Chip, EditorBar, SaveStatus, SectionCard, btn, fieldInputClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import { AiWholePost } from './ai-whole-post'
import { AiCoverImage } from './ai-cover-image'
import { BodyImageReplacer } from './body-image-replacer'
import { MarkdownEditor } from './markdown-editor'
import { AutoTranslate } from './auto-translate'
import { KIND_LIST, PILLARS, STAGES } from '@/lib/cms/content-plan'

const EMPTY_I18N = { vi: '', en: '' }

type SeoCols = Pick<PostUpdate, 'seo_title' | 'seo_description' | 'og_image'>

const toSeoDraft = (d: SeoCols): SeoDraft => ({
  vi: { title: d.seo_title?.vi ?? '', desc: d.seo_description?.vi ?? '' },
  en: { title: d.seo_title?.en ?? '', desc: d.seo_description?.en ?? '' },
  og: d.og_image ?? '',
})

/** Các ô SEO khác với bản đã lưu: chỉ gửi những ô này để máy chủ gộp, không ghi đè ô người dùng không đụng tới. */
function diffSeo(cur: SeoDraft, base: SeoDraft): SeoPatch {
  const patch: SeoPatch = {}
  if (cur.vi.title !== base.vi.title) patch.title_vi = cur.vi.title
  if (cur.en.title !== base.en.title) patch.title_en = cur.en.title
  if (cur.vi.desc !== base.vi.desc) patch.desc_vi = cur.vi.desc
  if (cur.en.desc !== base.en.desc) patch.desc_en = cur.en.desc
  if (cur.og.trim() !== base.og.trim()) patch.og = cur.og
  return patch
}

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

export function PostEditor({ post, mode, siteUrl }: { post: Post | null; mode: 'new' | 'edit'; siteUrl?: string }) {
  return (
    <EditLangProvider initial="vi">
      <PostEditorInner post={post} mode={mode} siteUrl={siteUrl} />
    </EditLangProvider>
  )
}

function PostEditorInner({ post, mode, siteUrl }: { post: Post | null; mode: 'new' | 'edit'; siteUrl?: string }) {
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
    topic_pillar: post?.topic_pillar ?? null,
    topic_stage: post?.topic_stage ?? null,
    topic_kind: post?.topic_kind ?? null,
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // SEO đang lưu trong DB (lúc mở bài hoặc sau lần lưu thành công gần nhất): để biết ô nào người dùng đã sửa (xem SeoPatch).
  const [savedSeo, setSavedSeo] = useState<SeoDraft>(() =>
    toSeoDraft({
      seo_title: post?.seo_title ?? null,
      seo_description: post?.seo_description ?? null,
      og_image: post?.og_image ?? null,
    })
  )
  const { lang } = useEditLang()
  const [tab, setTab] = useState<'content' | 'seo'>('content')

  const seoDraft = toSeoDraft(draft)
  // Mô hình hóa bài đang soạn thành một mục SEO để dùng lại khối kiểm tra/xem trước của màn SEO.
  const seoItem: SeoItem = {
    key: 'post:editor',
    kind: 'post',
    id: post?.id ?? 'new',
    label: draft.title.vi || draft.title.en,
    path: `/blog/${draft.slug || 'ten-bai-viet'}`,
    published: draft.status === 'published',
    editable: true,
    hasEn: postHasEnglish({ title: draft.title, content: draft.content }),
    editHref: '',
    saved: seoDraft,
    fallback: {
      vi: { title: draft.title.vi, desc: draft.excerpt.vi },
      en: { title: draft.title.en, desc: draft.excerpt.en },
    },
    ogFallback: draft.cover_image ?? '',
    descFallbackNote: 'Đang lấy từ mô tả ngắn (excerpt) của bài.',
  }
  const seoAnalysis = analyze(seoItem, seoDraft)
  const seoTone = scoreTone(seoAnalysis.score)
  const seoHost = (() => {
    try {
      return new URL(siteUrl || SITE_URL).hostname
    } catch {
      return new URL(SITE_URL).hostname
    }
  })()

  // Nhận hàm cập nhật (không phải bản sao draft) để không ghi đè chữ gõ thêm trong lúc chờ tải ảnh lên.
  const updateSeo = (change: (d: SeoDraft) => SeoDraft) => {
    setDraft((prev) => {
      const next = change(toSeoDraft(prev))
      return {
        ...prev,
        seo_title: { vi: next.vi.title, en: next.en.title },
        seo_description: { vi: next.vi.desc, en: next.en.desc },
        og_image: next.og.trim() === '' ? null : next.og,
      }
    })
    setStatus('dirty')
  }

  const update = <K extends keyof PostUpdate>(key: K, value: PostUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    const sentSeo = seoDraft
    startTransition(async () => {
      const { seo_title, seo_description, og_image, ...content } = draft
      const patch = diffSeo(sentSeo, savedSeo)
      const payload: PostSave = Object.keys(patch).length > 0 ? { ...content, seo_patch: patch } : content
      const result = await savePost(post?.id ?? 'new', payload)
      if (result && 'error' in result && result.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setSavedSeo(sentSeo)
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

  const seoChipText = seoAnalysis.issues.length === 0 ? 'SEO đạt' : `SEO: ${seoAnalysis.issues.length} mục cần xem`

  return (
    <div>
      <EditorBar
        backHref="/admin-cls/posts"
        stickyOnMobile={false}
        title={isNew ? 'Thêm bài viết mới' : draft.title.vi || '(chưa có tiêu đề)'}
        subtitle={`/blog/${draft.slug || 'ten-bai-viet'}`}
      >
        {AI_MODULE_ENABLED && (
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
        )}
        {AI_MODULE_ENABLED && (
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
        )}
        <LangSwitcher />

        <SaveStatus status={status} errorMsg={errorMsg} />

        {!isNew && post && draft.status === 'published' && (
          <Link href={`/blog/${post.slug}`} target="_blank" className={btn('ghost')}>
            <ExternalLink className="h-3.5 w-3.5" />
            Xem trên website
          </Link>
        )}

        {!isNew && (
          <button onClick={handleDelete} disabled={isPending} className={btn('danger')}>
            <Trash2 className="h-3.5 w-3.5" />
            Xoá
          </button>
        )}

        <button onClick={handleSave} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu thay đổi'}
        </button>
      </EditorBar>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main */}
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              ariaLabel="Chọn phần soạn"
              value={tab}
              onChange={setTab}
              options={[
                { id: 'content', label: 'Nội dung' },
                { id: 'seo', label: 'SEO và chia sẻ' },
              ]}
            />
            <Chip tone={seoTone === 'ok' ? 'ok' : seoTone === 'warn' ? 'warn' : 'bad'}>{seoChipText}</Chip>
          </div>

          <div className={cn(tab !== 'seo' && 'hidden')}>
            <SectionCard
              title="SEO và chia sẻ"
              description="Cách bài hiện trên Google và khi gửi link lên Facebook, Zalo. Đang sửa bản ngôn ngữ chọn ở thanh trên."
              actions={<LangSwitcher />}
              bodyClassName="px-5 pb-5 pt-4"
            >
              <SeoPanel
                item={seoItem}
                draft={seoDraft}
                onChange={updateSeo}
                lang={lang}
                canEdit
                pending={isPending}
                host={seoHost}
                layout="wide"
              />
            </SectionCard>
          </div>

          <div className={cn(tab !== 'content' && 'hidden')}>
            <SectionCard title="Nội dung" bodyClassName="space-y-4 px-5 pb-5 pt-4">
              <I18nInput label="Tiêu đề" value={draft.title} onChange={(v) => update('title', v)} />
              <TextInput
                label="Đường dẫn (slug)"
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
                hint={`Địa chỉ bài: /blog/${draft.slug || 'ten-bai-viet'}`}
              />
              <I18nInput
                label="Mô tả ngắn"
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
              {AI_MODULE_ENABLED && (
                <BodyImageReplacer
                  content={draft.content}
                  onContentChange={(next) => update('content', next)}
                />
              )}
            </SectionCard>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <SectionCard title="Xuất bản" bodyClassName="space-y-4 px-5 pb-5 pt-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[var(--ad-fg-2)]">Trạng thái</label>
              <select
                value={draft.status}
                onChange={(e) => update('status', e.target.value as 'draft' | 'published')}
                className={fieldInputClass}
              >
                <option value="draft">Bản nháp (chưa đăng)</option>
                <option value="published">Đã đăng (hiện công khai)</option>
              </select>
            </div>

            <TextInput
              label="Thẻ (cách nhau bởi dấu phẩy)"
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
              hint="Ví dụ: AI, Marketing, Dashboard"
            />
          </SectionCard>

          <SectionCard
            title="Phân loại nội dung"
            description="Để bài vào đúng biểu đồ ở mục Quản trị bài viết. Chọn đủ 3 ô."
            bodyClassName="space-y-4 px-5 pb-5 pt-4"
          >
            <TopicSelect
              label="Nhóm chủ đề"
              value={draft.topic_pillar}
              options={PILLARS}
              onChange={(v) => update('topic_pillar', v)}
            />
            <TopicSelect
              label="Giai đoạn người đọc"
              value={draft.topic_stage}
              options={STAGES}
              onChange={(v) => update('topic_stage', v)}
            />
            <TopicSelect
              label="Loại bài"
              value={draft.topic_kind}
              options={KIND_LIST}
              onChange={(v) => update('topic_kind', v)}
            />
          </SectionCard>

          <SectionCard
            title="Ảnh bìa"
            actions={
              AI_MODULE_ENABLED ? (
                <AiCoverImage
                  postTitle={draft.title.vi || draft.title.en}
                  tags={draft.tags}
                  onApply={(url) => update('cover_image', url)}
                />
              ) : undefined
            }
            bodyClassName="px-5 pb-5 pt-4"
          >
            <ImagePicker
              label=""
              value={draft.cover_image ?? ''}
              onChange={(v) => update('cover_image', v.trim() === '' ? null : v)}
            />
          </SectionCard>
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-4 rounded-xl bg-[rgba(255,59,48,.10)] px-4 py-2.5 text-[13.5px] text-[#d70015]">{errorMsg}</div>
      )}
    </div>
  )
}

function TopicSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: { id: string; label: string; hint?: string }[]
  onChange: (v: string | null) => void
}) {
  const current = options.find((o) => o.id === value)
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-[var(--ad-fg-2)]">{label}</label>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} className={fieldInputClass}>
        <option value="">Chưa chọn</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      {current?.hint && <p className="mt-1 text-[12px] text-[var(--ad-fg-3)]">{current.hint}</p>}
    </div>
  )
}
