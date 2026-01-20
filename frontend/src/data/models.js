export const models = [
  {
    id: 1,
    slug: 'synexis-vision-pro',
    title: 'Flower Classifier',
    description:
      'Image classifier trained to identify Daisy, Dandelion, Roses, Sunflowers, and Tulips.',
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
    inputPlaceholder: 'flower_001.jpg',
    sampleOutput: 'Sunflowers',
  },
  {
    id: 2,
    slug: 'leaf-classifynet',
    title: 'Animal ClassifyNet',
    description:
      'Animal image classifier tuned for fast species recognition across common wildlife categories.',
    accuracy: '97.9%',
    speed: '28ms',
    category: 'image',
    best: true,
    datasets: [
      {
        id: 'ds-animal-01',
        name: 'Wildlife Essentials',
        rows: '52k',
        features: 'RGB 224x224',
        updated: '2026-01-12',
      },
      {
        id: 'ds-animal-02',
        name: 'Safari Conditions',
        rows: '21k',
        features: 'RGB 256x256',
        updated: '2025-12-09',
      },
    ],
    inputPlaceholder: 'animal_001.jpg',
    sampleOutput: 'Tiger',
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
