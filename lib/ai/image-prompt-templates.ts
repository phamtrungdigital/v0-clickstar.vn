// Curated cover image prompt templates for ClickStar.
// Each template is in English (GPT-image-1 / DALL-E understand English best).
// Categorized to match ClickStar's 6 service pages + tech themes.

export type PromptTemplate = {
  id: string
  label: string
  emoji: string
  category: 'marketing' | 'website' | 'dashboard' | 'crm' | 'ai' | 'automation' | 'abstract'
  prompt: string
}

export const COVER_PROMPT_TEMPLATES: PromptTemplate[] = [
  // === Digital Marketing ===
  {
    id: 'marketing-dashboard',
    label: 'Digital Marketing Dashboard',
    emoji: '📊',
    category: 'marketing',
    prompt:
      'Modern digital marketing analytics dashboard with colorful charts, KPI cards, conversion funnel, blue and purple gradient background, clean professional design, 16:9 aspect ratio',
  },
  {
    id: 'multi-channel-ads',
    label: 'Multi-channel Ads',
    emoji: '📢',
    category: 'marketing',
    prompt:
      'Multi-channel advertising visualization showing Google, Meta, TikTok logos connected via flowing data streams, vibrant tech illustration, gradient background, professional',
  },
  {
    id: 'seo-ranking',
    label: 'SEO Growth',
    emoji: '📈',
    category: 'marketing',
    prompt:
      'SEO ranking growth illustration with magnifying glass over Google search results, upward trending arrows, green accent colors, clean flat design',
  },
  {
    id: 'content-marketing',
    label: 'Content Marketing',
    emoji: '✍️',
    category: 'marketing',
    prompt:
      'Content marketing strategy concept: writing on tablet, mind-map of content pillars, social media icons, warm professional palette, modern illustration',
  },

  // === Website ===
  {
    id: 'modern-website',
    label: 'Modern Website',
    emoji: '🖥️',
    category: 'website',
    prompt:
      'Modern responsive website showcase on laptop and mobile, clean UI design with dashboard preview, soft shadows, blue and white palette, professional photorealistic',
  },
  {
    id: 'code-editor',
    label: 'Code & Development',
    emoji: '💻',
    category: 'website',
    prompt:
      'Developer workspace with code editor on screen, syntax highlighting, dark mode IDE, coffee cup, modern minimal desk setup, soft warm lighting, photorealistic',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    emoji: '🛒',
    category: 'website',
    prompt:
      'E-commerce website mockup with product cards, shopping cart, payment flow, modern UI, gradient background, isometric illustration style',
  },

  // === Dashboard / BI ===
  {
    id: 'business-dashboard',
    label: 'Business Intelligence',
    emoji: '📉',
    category: 'dashboard',
    prompt:
      'Business intelligence dashboard with real-time charts, line graphs, pie charts, metrics cards, dark theme with neon accents, professional data visualization',
  },
  {
    id: 'data-viz',
    label: 'Data Visualization',
    emoji: '🔢',
    category: 'dashboard',
    prompt:
      'Abstract data visualization with flowing particles forming charts and graphs, blue and cyan gradient, futuristic tech aesthetic, clean composition',
  },

  // === CRM / CDP ===
  {
    id: 'crm-pipeline',
    label: 'CRM Pipeline',
    emoji: '🔄',
    category: 'crm',
    prompt:
      'CRM sales pipeline visualization with customer cards moving through stages, connected nodes, flat modern illustration, purple and teal gradient',
  },
  {
    id: 'customer-journey',
    label: 'Customer Journey',
    emoji: '🛣️',
    category: 'crm',
    prompt:
      'Customer journey map with persona avatars, touchpoints, connected timeline path, modern flat illustration, friendly warm colors',
  },

  // === AI Integration ===
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    emoji: '🤖',
    category: 'ai',
    prompt:
      'AI assistant concept: glowing chatbot interface, neural network background, data streams, blue and violet neon gradient, futuristic tech illustration',
  },
  {
    id: 'neural-network',
    label: 'Neural Network',
    emoji: '🧠',
    category: 'ai',
    prompt:
      'Abstract neural network visualization with interconnected glowing nodes, brain-like structure, dark background with bright accent colors, AI machine learning concept',
  },
  {
    id: 'ai-workspace',
    label: 'AI for Business',
    emoji: '⚡',
    category: 'ai',
    prompt:
      'Vietnamese business owner using AI tools on laptop, AI suggestions floating on screen, modern office, warm professional lighting, photorealistic',
  },

  // === Automation ===
  {
    id: 'workflow-automation',
    label: 'Workflow Automation',
    emoji: '⚙️',
    category: 'automation',
    prompt:
      'Workflow automation diagram with connected gears, process nodes, robotic arm icon, blue gradient background, isometric illustration',
  },
  {
    id: 'process-flow',
    label: 'Process Flow',
    emoji: '🔁',
    category: 'automation',
    prompt:
      'Business process automation flow chart with connected steps, conditional branches, integration logos, modern flat design, professional palette',
  },

  // === Abstract / Tech ===
  {
    id: 'abstract-tech',
    label: 'Abstract Tech',
    emoji: '✨',
    category: 'abstract',
    prompt:
      'Abstract futuristic technology background, glowing geometric shapes, gradient mesh, blue and purple, premium tech brand aesthetic, no text',
  },
  {
    id: 'gradient-mesh',
    label: 'Gradient Mesh',
    emoji: '🎨',
    category: 'abstract',
    prompt:
      'Smooth gradient mesh background with soft purple, pink, and blue tones, abstract organic shapes, suitable as cover for modern Vietnamese tech blog',
  },
  {
    id: 'tech-isometric',
    label: 'Tech Isometric',
    emoji: '🧊',
    category: 'abstract',
    prompt:
      'Isometric illustration of digital ecosystem: connected devices, cloud, data flowing between them, vibrant gradient, clean modern style',
  },
]

export const CATEGORIES: { id: PromptTemplate['category']; label: string }[] = [
  { id: 'marketing', label: '📢 Marketing' },
  { id: 'website', label: '🖥️ Website' },
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'crm', label: '👥 CRM' },
  { id: 'ai', label: '🤖 AI' },
  { id: 'automation', label: '⚙️ Automation' },
  { id: 'abstract', label: '🎨 Abstract' },
]
