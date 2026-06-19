import { getWebContent } from '@/lib/cms/web-content'
import { FooterCtaForm } from './_components/footer-cta-form'

export const dynamic = 'force-dynamic'

export default async function FooterCtaPage() {
  const content = await getWebContent()
  return <FooterCtaForm initial={content} />
}
