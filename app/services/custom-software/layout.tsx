import { customSoftwareMetadata, CustomSoftwareShell } from './_components/shell'

export const revalidate = 3600
export const generateMetadata = () => customSoftwareMetadata('vi')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CustomSoftwareShell lang="vi">{children}</CustomSoftwareShell>
}
