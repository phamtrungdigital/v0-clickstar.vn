'use client'

import { Plus, Trash2 } from 'lucide-react'
import type {
  PricingGroupedTiersContent,
  PricingTierGroup,
  PricingTierItem,
  I18n,
} from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'

function emptyTier(): PricingTierItem {
  return {
    name: { vi: '', en: '' },
    description: { vi: '', en: '' },
    price: { vi: '', en: '' },
    price_period: { vi: '', en: '' },
    popular: false,
    features: [],
    cta_label: { vi: 'Liên hệ tư vấn', en: 'Get consultation' },
    cta_href: '/contact',
  }
}

function emptyGroup(): PricingTierGroup {
  return {
    id: `group-${Date.now()}`,
    label: { vi: '', en: '' },
    tiers: [emptyTier(), emptyTier(), emptyTier()],
  }
}

export function PricingGroupedTiersForm({
  content,
  onChange,
}: {
  content: PricingGroupedTiersContent
  onChange: (next: PricingGroupedTiersContent) => void
}) {
  const update = <K extends keyof PricingGroupedTiersContent>(
    key: K,
    value: PricingGroupedTiersContent[K],
  ) => onChange({ ...content, [key]: value })

  const updateGroup = (idx: number, next: PricingTierGroup) => {
    const groups = [...content.groups]
    groups[idx] = next
    onChange({ ...content, groups })
  }
  const addGroup = () => onChange({ ...content, groups: [...content.groups, emptyGroup()] })
  const removeGroup = (idx: number) =>
    onChange({ ...content, groups: content.groups.filter((_, i) => i !== idx) })

  return (
    <div className="space-y-4">
      {/* Header chung */}
      <div id="form-pricing_grouped_tiers.eyebrow" className="scroll-mt-32">
        <I18nInput label="Eyebrow" value={content.eyebrow} onChange={(v) => update('eyebrow', v)} />
      </div>

      <div
        id="form-pricing_grouped_tiers.heading"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 scroll-mt-32"
      >
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

      <div id="form-pricing_grouped_tiers.description" className="scroll-mt-32">
        <I18nInput
          label="Mô tả"
          value={content.description}
          onChange={(v) => update('description', v)}
          multiline
          rows={2}
        />
      </div>

      {/* Groups list */}
      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {content.groups.length} nhóm dịch vụ (tabs)
          </p>
          <button
            type="button"
            onClick={addGroup}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm nhóm
          </button>
        </div>
        {content.groups.map((group, gIdx) => (
          <details
            key={group.id}
            id={`form-pricing_grouped_tiers.group_tab.${gIdx}`}
            open={gIdx === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-semibold select-none flex items-center justify-between bg-amber-50 dark:bg-amber-900/20">
              <span>
                Nhóm {gIdx + 1}: {group.label.vi || '(chưa đặt tên)'} ({group.tiers.length} gói)
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm(`Xoá nhóm "${group.label.vi}"?`)) removeGroup(gIdx)
                }}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </summary>
            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TextInput
                  label="Group ID (slug, không trùng)"
                  value={group.id}
                  onChange={(v) =>
                    updateGroup(gIdx, { ...group, id: v.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
                  }
                  hint="vd: marketing, ai, crm"
                />
                <I18nInput
                  label="Nhãn tab"
                  value={group.label}
                  onChange={(v) => updateGroup(gIdx, { ...group, label: v })}
                />
              </div>
              <I18nInput
                label="Badge (optional, vd: Phổ biến)"
                value={group.badge ?? { vi: '', en: '' }}
                onChange={(v) => updateGroup(gIdx, { ...group, badge: v })}
              />

              {/* Tiers within group */}
              <TiersEditor
                tiers={group.tiers}
                onChange={(tiers) => updateGroup(gIdx, { ...group, tiers })}
              />

              <I18nInput
                label="Disclaimer (note nhỏ dưới group)"
                value={group.disclaimer ?? { vi: '', en: '' }}
                onChange={(v) => updateGroup(gIdx, { ...group, disclaimer: v })}
                multiline
                rows={2}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

function TiersEditor({
  tiers,
  onChange,
}: {
  tiers: PricingTierItem[]
  onChange: (next: PricingTierItem[]) => void
}) {
  const updateTier = (idx: number, next: PricingTierItem) => {
    const arr = [...tiers]
    arr[idx] = next
    onChange(arr)
  }
  const addTier = () => onChange([...tiers, emptyTier()])
  const removeTier = (idx: number) => onChange(tiers.filter((_, i) => i !== idx))

  const updateFeature = (tIdx: number, fIdx: number, val: I18n) => {
    const tier = tiers[tIdx]
    const features = [...tier.features]
    features[fIdx] = val
    updateTier(tIdx, { ...tier, features })
  }
  const addFeature = (tIdx: number) => {
    const tier = tiers[tIdx]
    updateTier(tIdx, { ...tier, features: [...tier.features, { vi: '', en: '' }] })
  }
  const removeFeature = (tIdx: number, fIdx: number) => {
    const tier = tiers[tIdx]
    updateTier(tIdx, { ...tier, features: tier.features.filter((_, i) => i !== fIdx) })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {tiers.length} gói (tier) trong nhóm
        </p>
        <button
          type="button"
          onClick={addTier}
          className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
        >
          <Plus className="w-3 h-3" />
          Thêm gói
        </button>
      </div>
      {tiers.map((tier, tIdx) => (
        <details
          key={tIdx}
          className="bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-700"
        >
          <summary className="px-3 py-1.5 cursor-pointer text-xs font-medium select-none flex items-center justify-between">
            <span>
              Gói {tIdx + 1}: {tier.name.vi || '(chưa đặt)'} — {tier.price.vi || '???'}
              {tier.popular && <span className="ml-2 text-amber-600">⭐ popular</span>}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                removeTier(tIdx)
              }}
              className="text-red-500 p-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </summary>
          <div className="p-3 space-y-2 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <I18nInput label="Tên gói" value={tier.name} onChange={(v) => updateTier(tIdx, { ...tier, name: v })} />
              <I18nInput label="Mô tả ngắn" value={tier.description} onChange={(v) => updateTier(tIdx, { ...tier, description: v })} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <I18nInput label="Giá" value={tier.price} onChange={(v) => updateTier(tIdx, { ...tier, price: v })} />
              <I18nInput label="Period (vd /tháng)" value={tier.price_period ?? { vi: '', en: '' }} onChange={(v) => updateTier(tIdx, { ...tier, price_period: v })} />
              <label className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  checked={tier.popular}
                  onChange={(e) => updateTier(tIdx, { ...tier, popular: e.target.checked })}
                />
                Popular (highlight)
              </label>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-slate-800 rounded p-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase text-slate-500">
                  {tier.features.length} feature
                </span>
                <button type="button" onClick={() => addFeature(tIdx)} className="text-primary text-xs hover:underline">
                  + Thêm feature
                </button>
              </div>
              {tier.features.map((f, fIdx) => (
                <div key={fIdx} className="flex items-start gap-1.5 mb-1">
                  <div className="flex-1">
                    <I18nInput label="" value={f} onChange={(v) => updateFeature(tIdx, fIdx, v)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(tIdx, fIdx)}
                    className="text-red-500 p-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <I18nInput label="CTA Label" value={tier.cta_label} onChange={(v) => updateTier(tIdx, { ...tier, cta_label: v })} />
              <TextInput label="CTA Href" value={tier.cta_href} onChange={(v) => updateTier(tIdx, { ...tier, cta_href: v })} />
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
