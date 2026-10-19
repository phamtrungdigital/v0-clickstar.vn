import Page from '@/app/services/speech-insight-ai/page'
import { SPEECH_SLUG, SpeechInsightShell } from '@/app/services/speech-insight-ai/_components/shell'
import { pageMetadata } from '@/lib/cms/page-metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata(SPEECH_SLUG, undefined, 'en')

export default function EnSpeechInsightPage() {
  return (
    <SpeechInsightShell lang="en">
      <Page />
    </SpeechInsightShell>
  )
}
