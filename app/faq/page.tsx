import { FaqView, faqMetadata } from './_view'

export const revalidate = 3600
export const generateMetadata = () => faqMetadata('vi')

export default function FaqPage() {
  return <FaqView lang="vi" />
}
