import { CookiePolicyView, cookiePolicyMetadata } from '@/app/cookie-policy/_view'

export const revalidate = 3600
export const generateMetadata = () => cookiePolicyMetadata('en')

export default function EnCookiePolicyPage() {
  return <CookiePolicyView lang="en" />
}
