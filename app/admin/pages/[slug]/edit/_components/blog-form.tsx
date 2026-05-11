'use client'

import type { BlogContent, BlogPostItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

export function BlogForm({
  content,
  onChange,
}: {
  content: BlogContent
  onChange: (next: BlogContent) => void
}) {
  const update = <K extends keyof BlogContent>(key: K, value: BlogContent[K]) =>
    onChange({ ...content, [key]: value })

  const updatePost = (index: number, next: BlogPostItem) => {
    const posts = [...content.posts]
    posts[index] = next
    onChange({ ...content, posts })
  }

  return (
    <div className="space-y-4">
      <div id="form-blog.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-blog.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="Heading — phần đầu"
          value={content.heading_lead}
          onChange={(v) => update('heading_lead', v)}
        />
        <I18nInput
          label="Heading — chữ highlight"
          value={content.heading_highlight}
          onChange={(v) => update('heading_highlight', v)}
        />
      </div>

      <div id="form-blog.subtitle" className="scroll-mt-32">
        <I18nInput
          label="Subtitle"
          multiline
          value={content.subtitle}
          onChange={(v) => update('subtitle', v)}
        />
      </div>

      <div id="form-blog.read_more" className="scroll-mt-32">
        <I18nInput
          label="'Đọc thêm' label"
          value={content.read_more_label}
          onChange={(v) => update('read_more_label', v)}
        />
      </div>

      <div id="form-blog.view_all" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput
          label="'Xem tất cả' — text"
          value={content.view_all_label}
          onChange={(v) => update('view_all_label', v)}
        />
        <TextInput
          label="'Xem tất cả' — link"
          value={content.view_all_href}
          onChange={(v) => update('view_all_href', v)}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.posts.length} bài viết
        </p>
        {content.posts.map((post, idx) => (
          <details
            key={idx}
            id={`form-blog.post.${idx}`}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none">
              {idx + 1}. {post.title.vi || `(bài ${idx + 1})`}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Tiêu đề bài"
                value={post.title}
                onChange={(v) => updatePost(idx, { ...post, title: v })}
              />
              <ImagePicker
                label="Hình ảnh bài viết"
                value={post.image}
                onChange={(v) => updatePost(idx, { ...post, image: v })}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Tags (cách nhau bởi dấu phẩy)"
                  value={post.tags.join(', ')}
                  onChange={(v) =>
                    updatePost(idx, {
                      ...post,
                      tags: v
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  hint="VD: AI, Marketing, Dashboard"
                />
                <TextInput
                  label="Slug (link)"
                  value={post.slug}
                  onChange={(v) => updatePost(idx, { ...post, slug: v })}
                  placeholder="/blog/ten-bai-viet"
                />
              </div>
              <I18nInput
                label="Ngày đăng"
                value={post.date}
                onChange={(v) => updatePost(idx, { ...post, date: v })}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
