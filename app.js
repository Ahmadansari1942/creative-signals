const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load articles data
let articlesData = [];
try {
  const rawData = fs.readFileSync(path.join(__dirname, 'data', 'articles.json'), 'utf8');
  articlesData = JSON.parse(rawData);
} catch (err) {
  console.error('Error loading articles:', err);
}

// Experiments data
const experiments = [
  {
    id: 1,
    title: "Particle Flow System",
    description: "Interactive particle system responding to mouse movements with WebGL",
    tech: ["WebGL", "GLSL", "Canvas"],
    thumbnail: "/images/exp-1.jpg",
    demoUrl: "/experiments/particle-flow",
    featured: true
  },
  {
    id: 2,
    title: "Generative Typography",
    description: "Algorithm-driven letterforms that evolve based on audio input",
    tech: ["p5.js", "Web Audio API"],
    thumbnail: "/images/exp-2.jpg",
    demoUrl: "/experiments/generative-type",
    featured: true
  },
  {
    id: 3,
    title: "Neural Canvas",
    description: "Real-time neural style transfer applied to webcam feed",
    tech: ["TensorFlow.js", "WebGL"],
    thumbnail: "/images/exp-3.jpg",
    demoUrl: "/experiments/neural-canvas",
    featured: false
  },
  {
    id: 4,
    title: "Data Sculptures",
    description: "3D visualizations of climate data spanning 100 years",
    tech: ["Three.js", "D3.js"],
    thumbnail: "/images/exp-4.jpg",
    demoUrl: "/experiments/data-sculptures",
    featured: true
  },
  {
    id: 5,
    title: "Sound Forest",
    description: "Procedurally generated audio-visual landscape",
    tech: ["Tone.js", "Canvas", "WebGL"],
    thumbnail: "/images/exp-5.jpg",
    demoUrl: "/experiments/sound-forest",
    featured: false
  },
  {
    id: 6,
    title: "Liquid Text",
    description: "Typography that behaves like fluid under interaction",
    tech: ["WebGL", "Metaballs"],
    thumbnail: "/images/exp-6.jpg",
    demoUrl: "/experiments/liquid-text",
    featured: true
  },
  {
    id: 7,
    title: "Echo Chamber",
    description: "Spatial audio experience with generative visuals",
    tech: ["Web Audio API", "Three.js"],
    thumbnail: "/images/exp-7.jpg",
    demoUrl: "/experiments/echo-chamber",
    featured: false
  },
  {
    id: 8,
    title: "Memory Palace",
    description: "VR-enabled interactive archival space",
    tech: ["A-Frame", "WebXR"],
    thumbnail: "/images/exp-8.jpg",
    demoUrl: "/experiments/memory-palace",
    featured: false
  }
];

// Timeline data
const timeline = [
  { year: 2018, title: "The Beginning", description: "Started exploring creative coding and generative art", type: "milestone" },
  { year: 2019, title: "First Exhibition", description: "Showcased interactive installations at local gallery", type: "achievement" },
  { year: 2020, title: "Deep Dive into WebGL", description: "Mastered shader programming and GPU-accelerated graphics", type: "learning" },
  { year: 2021, title: "Creative Tech Lead", description: "Joined leading design studio as creative technologist", type: "career" },
  { year: 2022, title: "Award Recognition", description: "Won Awwwards Site of the Day for experimental project", type: "achievement" },
  { year: 2023, title: "Speaking Engagements", description: "Presented at FITC, OFFF, and SmashingConf", type: "milestone" },
  { year: 2024, title: "Independent Practice", description: "Launched full-time creative technology studio", type: "career" }
];

// Routes
app.get('/', (req, res) => {
  const featuredArticles = articlesData.filter(a => a.featured).slice(0, 4);
  const featuredExperiments = experiments.filter(e => e.featured).slice(0, 3);
  const recentArticles = articlesData.slice(0, 6);
  
  res.render('index', { 
    title: 'Creative Signals - Technology Meets Art',
    featuredArticles,
    featuredExperiments,
    recentArticles,
    articles: articlesData
  });
});

app.get('/blog', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 9;
  const totalPages = Math.ceil(articlesData.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedArticles = articlesData.slice(startIndex, startIndex + perPage);
  
  res.render('blog', { 
    title: 'Writings - Creative Signals',
    articles: paginatedArticles,
    currentPage: page,
    totalPages,
    totalArticles: articlesData.length
  });
});

app.get('/blog/:slug', (req, res) => {
  const article = articlesData.find(a => a.slug === req.params.slug);
  if (!article) {
    return res.status(404).render('404', { title: 'Not Found - Creative Signals' });
  }
  
  // Get related articles
  const relatedArticles = articlesData
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);
  
  res.render('article', { 
    title: `${article.title} - Creative Signals`,
    article,
    relatedArticles
  });
});

app.get('/experiments', (req, res) => {
  res.render('experiments', { 
    title: 'Experiments - Creative Signals',
    experiments
  });
});

app.get('/timeline', (req, res) => {
  res.render('timeline', { 
    title: 'Journey - Creative Signals',
    timeline
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Connect - Creative Signals'
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, type } = req.body;
  
  // In production, you would send email or save to database
  console.log('Contact form submission:', { name, email, subject, message, type });
  
  res.json({ 
    success: true, 
    message: 'Thank you for reaching out! I will respond within 24-48 hours.' 
  });
});

app.get('/api/articles', (req, res) => {
  res.json(articlesData);
});

app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = articlesData.filter(article => 
    article.title.toLowerCase().includes(query) ||
    article.excerpt.toLowerCase().includes(query) ||
    article.tags.some(tag => tag.toLowerCase().includes(query))
  );
  res.json(results);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found - Creative Signals' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error - Creative Signals',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Creative Signals running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
