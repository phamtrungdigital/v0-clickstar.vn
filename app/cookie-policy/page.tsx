import { CookiePolicyView, cookiePolicyMetadata } from './_view'

export const revalidate = 3600
export const generateMetadata = () => cookiePolicyMetadata('vi')

export default function CookiePolicyPage() {
  return <CookiePolicyView lang="vi" />
}
