import { KhamPhaView, khamPhaMetadata } from '@/app/kham-pha/_view'

export const revalidate = 3600
export const generateMetadata = () => khamPhaMetadata('en')

export default function EnKhamPhaPage() {
  return <KhamPhaView lang="en" />
}
