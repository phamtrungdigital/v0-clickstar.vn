'use client'

import type { PricingTiersContent, PricingTierItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

export function PricingTiersForm({
  content,
  onChange,
}: {
  content: PricingTiersContent
  onChange: (next: PricingTiersContent) => void
}) {
  const update = <K extends keyof PricingTiersContent>(key: K, value: PricingTiersContent[K]) =>
    onChange({ ...content, [key]: value })

  const updateTier = (idx: number, next: PricingTierItem) => {
    const tiers = [...content.tiers]
    tiers[idx] = next
    onChange({ ...content, tiers })
  }

  return (
    <div className="space-y-4">
      <div id="form-pricing_tiers.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div id="form-pricing_tiers.heading" className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32">
        <I18nInput label="Heading — phần đầu" value={content.heading_lead} onChange={(v) => update('heading_lead', v)} />
        <I18nInput label="Heading — chữ highlight" value={content.heading_highlight} onChange={(v) => update('heading_highlight', v)} />
      </div>

      <div id="form-pricing_tiers.description" className="scroll-mt-32">
        <I18nInput label="Mô tả" multiline rows={2} value={content.description} onChange={(v) => update('description', v)} />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {content.tiers.length} gói
        </p>
        {content.tiers.map((tier, idx) => (
          <details key={idx} id={`form-pricing_tiers.tier.${idx}`} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32">
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center gap-2">
              <span>{idx + 1}. {tier.name.vi || `(Gói ${idx + 1})`}</span>
              {tier.popular && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">PHỔ BIẾN</span>}
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput label="Tên gói" value={tier.name} onChange={(v) => updateTier(idx, { ...tier, name: v })} />
              <I18nInput label="Mô tả ngắn" multiline rows={2} value={tier.description} onChange={(v) => updateTier(idx, { ...tier, description: v })} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <I18nInput label="Giá" value={tier.price} onChange={(v) => updateTier(idx, { ...tier, price: v })} />
                <I18nInput
                  label="Chu kỳ giá (vd /tháng, /năm)"
                  value={tier.price_period ?? { vi: '', en: '' }}
                  onChange={(v) => updateTier(idx, { ...tier, price_period: v })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={tier.popular}
                  onChange={(e) => updateTier(idx, { ...tier, popular: e.target.checked })}
                  className="w-4 h-4"
                />
                Gói phổ biến nhất (highlight)
              </label>

              <div>
                <label className="block text-xs font-medium mb-1.5">Tính năng (mỗi dòng 1 feature — VI ở trái, EN ở phải)</label>
                <div className="space-y-1.5">
                  {tier.features.map((f, fi) => (
                    <div key={fi} className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={f.vi}
                        placeholder="Feature VI"
                        onChange={(e) => {
                          const features = [...tier.features]
                          features[fi] = { ...features[fi], vi: e.target.value }
                          updateTier(idx, { ...tier, features })
                        }}
                        className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                      />
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={f.en}
                          placeholder="Feature EN"
                          onChange={(e) => {
                            const features = [...tier.features]
                            features[fi] = { ...features[fi], en: e.target.value }
                            updateTier(idx, { ...tier, features })
                          }}
                          className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const features = tier.features.filter((_, i) => i !== fi)
                            updateTier(idx, { ...tier, features })
                          }}
                          className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const features = [...tier.features, { vi: '', en: '' }]
                      updateTier(idx, { ...tier, features })
                    }}
                    className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    + Thêm feature
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <I18nInput label="CTA — text" value={tier.cta_label} onChange={(v) => updateTier(idx, { ...tier, cta_label: v })} />
                <TextInput label="CTA — link" value={tier.cta_href} onChange={(v) => updateTier(idx, { ...tier, cta_href: v })} />
              </div>
            </div>
          </details>
        ))}
      </div>

      <I18nInput
        label="Disclaimer (text nhỏ dưới cùng)"
        value={content.disclaimer ?? { vi: '', en: '' }}
        onChange={(v) => update('disclaimer', v)}
      />
    </div>
  )
}
