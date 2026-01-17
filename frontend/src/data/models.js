export const models = [
  {
    id: 1,
    slug: 'synexis-vision-pro',
    title: 'Synexis Vision Pro',
    description:
      'State-of-the-art image classifier tuned for high-variance datasets. Best for general image recognition across retail, lifestyle, and industrial imagery.',
    accuracy: '98.6%',
    speed: '22ms',
    category: 'image',
    best: true,
    datasets: [
      {
        id: 'ds-vision-01',
        name: 'Retail Images v4',
        rows: '120k',
        features: 'RGB 224x224',
        updated: '2026-01-08',
      },
      {
        id: 'ds-vision-02',
        name: 'Lifestyle Objects',
        rows: '85k',
        features: 'RGB 256x256',
        updated: '2025-12-19',
      },
    ],
    inputPlaceholder: 'product_8871.png',
    sampleOutput: 'Running Shoes',
  },
  {
    id: 2,
    slug: 'leaf-classifynet',
    title: 'Leaf ClassifyNet',
    description:
      'Specialized classifier for leaf disease detection with strong botanical accuracy across common crop conditions.',
    accuracy: '97.9%',
    speed: '28ms',
    category: 'image',
    best: true,
    datasets: [
      {
        id: 'ds-leaf-01',
        name: 'Leaf Disease Set',
        rows: '42k',
        features: 'RGB 224x224',
        updated: '2025-11-02',
      },
      {
        id: 'ds-leaf-02',
        name: 'Field Conditions',
        rows: '18k',
        features: 'RGB 256x256',
        updated: '2025-10-11',
      },
    ],
    inputPlaceholder: 'leaf_0234.jpg',
    sampleOutput: 'Powdery Mildew',
  },
  {
    id: 3,
    slug: 'retail-vision-lite',
    title: 'Retail Vision Lite',
    description:
      'Fast image classifier optimized for product catalog images and compact deployment footprints.',
    accuracy: '95.1%',
    speed: '14ms',
    category: 'image',
    best: false,
    datasets: [
      {
        id: 'ds-retail-01',
        name: 'Catalog Essentials',
        rows: '260k',
        features: 'RGB 192x192',
        updated: '2025-12-02',
      },
    ],
    inputPlaceholder: 'sku_19318.png',
    sampleOutput: 'Sports Backpack',
  },
  {
    id: 4,
    slug: 'sentiment-pulse',
    title: 'Sentiment Pulse',
    description:
      'Robust sentiment analysis for social and customer feedback with high precision on long-form text.',
    accuracy: '95.7%',
    speed: '16ms',
    category: 'text',
    best: true,
    datasets: [
      {
        id: 'ds-text-01',
        name: 'Customer Feedback',
        rows: '310k',
        features: 'Text, 3 classes',
        updated: '2025-12-20',
      },
      {
        id: 'ds-text-02',
        name: 'Social Mentions',
        rows: '520k',
        features: 'Text, 3 classes',
        updated: '2025-11-18',
      },
    ],
    inputPlaceholder: 'The delivery was fast and the packaging was perfect.',
    sampleOutput: 'Positive',
  },
  {
    id: 5,
    slug: 'price-predictor-x',
    title: 'Price Predictor X',
    description:
      'Tabular regression model for housing price predictions with strong calibration on metro areas.',
    accuracy: '92.8%',
    speed: '12ms',
    category: 'tabular',
    best: true,
    datasets: [
      {
        id: 'ds-tab-01',
        name: 'Metro Housing 2025',
        rows: '240k',
        features: '12 numeric + 5 categorical',
        updated: '2025-12-28',
      },
    ],
    inputPlaceholder: '3 bed, 2 bath, 1650 sqft, 94107',
    sampleOutput: '$412,000',
  },
];

export const getModelBySlug = (slug) => models.find((model) => model.slug === slug);
