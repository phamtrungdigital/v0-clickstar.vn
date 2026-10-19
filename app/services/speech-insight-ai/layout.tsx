import { pageMetadata } from '@/lib/cms/page-metadata'
import { SPEECH_SLUG, SpeechInsightShell } from './_components/shell'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata(SPEECH_SLUG)

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SpeechInsightShell lang="vi">{children}</SpeechInsightShell>
}
