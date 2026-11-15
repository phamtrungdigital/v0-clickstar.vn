import { KhamPhaView, khamPhaMetadata } from './_view'

export const revalidate = 3600
export const generateMetadata = () => khamPhaMetadata('vi')

export default function KhamPhaPage() {
  return <KhamPhaView lang="vi" />
}
