import Page from '@/app/services/custom-software/page'
import { customSoftwareMetadata, CustomSoftwareShell } from '@/app/services/custom-software/_components/shell'

export const revalidate = 3600
export const generateMetadata = () => customSoftwareMetadata('en')

export default function EnCustomSoftwarePage() {
  return (
    <CustomSoftwareShell lang="en">
      <Page />
    </CustomSoftwareShell>
  )
}
