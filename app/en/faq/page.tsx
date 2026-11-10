import { FaqView, faqMetadata } from '@/app/faq/_view'

export const revalidate = 3600
export const generateMetadata = () => faqMetadata('en')

export default function EnFaqPage() {
  return <FaqView lang="en" />
}
