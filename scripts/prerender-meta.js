const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Define metadata for routes
const staticMeta = {
  '/': {
    title: 'itzMiney\'s Home',
    description: 'Welcome to itzMiney\'s Homepage! Here you can find my portfolio and other cool stuff.',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/about',
    color: '#eb284c'
  },
  '/about': {
    title: 'itzMiney\'s Home',
    description: 'Welcome to itzMiney\'s Homepage! Here you can find my portfolio and other cool stuff.',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/about',
    color: '#eb284c'
  },
  '/portfolio': {
    title: 'Portfolio | itzMiney',
    description: 'This is my portfolio where you can find examples of my designs and other projects!',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/portfolio',
    color: '#eb284c'
  },
  '/socials': {
    title: 'Socials | itzMiney',
    description: 'Here you can find links to all the places I hang around in!',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/socials',
    color: '#eb284c'
  },
  '/services': {
    title: 'Services | itzMiney',
    description: 'All the Services I offer are listed here!',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/services',
    color: '#eb284c'
  },
  '/blog': {
    title: 'Blog | itzMiney',
    description: 'Welcome to my blog! I\'ll post occasional updates here on the stuff I\'m currently up to.',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/blog',
    color: '#eb284c'
  },
  '/login': {
    title: 'Login | itzMiney',
    description: 'Admin Panel Login',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/login',
    color: '#eb284c'
  },
  '/admin': {
    title: 'Admin Panel | itzMiney',
    description: 'Admin Panel',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/admin',
    color: '#eb284c'
  },
  '/404': {
    title: '404 | Page Not Found',
    description: 'How the hell did you end up here?',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/404',
    color: '#eb284c',
  },
  '/tos': {
    title: 'Terms of Service | itzMiney',
    description: 'My Terms of Service for the Freelancing work I provide',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/tos',
    color: '#eb284c'
  },
  '/imprint': {
    title: 'Imprint | itzMiney',
    description: 'Imprint and Contact',
    image: 'https://meta.itzminey.dev/assets/ogimg.png',
    url: 'https://itzminey.dev/imprint',
    color: '#eb284c'
  }
};

// Output directory for pre-rendered metadata
const outputDir = path.join(__dirname, '../dist/itzmineydev/meta');

// Ensure the output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Function to fetch dynamic metadata
async function fetchDynamicMeta() {
  try {
    const response = await axios.get('https://itzminey.dev/api/articles'); // Replace with your API endpoint
    const articles = response.data;

    return articles.reduce((acc, article) => {
      const createdAt = new Date(article.createdAt);

      // Format the date directly using toLocaleDateString
      const formattedCreatedAt = createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      const description = `By ${article.authorName} | Article from ${formattedCreatedAt}`;

    acc[`/blog/${article.slug}`] = {
      title: article.title,
      description: description,
      image: 'https://meta.itzminey.dev/assets/ogimg.png',
      url: `https://itzminey.dev/blog/${article.slug}`,
      color: '#eb284c',
    };
    return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching dynamic metadata:', error);
    return {};
  }
}

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

// Function to generate metadata files
async function generateMetaFiles() {
  const dynamicMeta = await fetchDynamicMeta();
  const allMeta = { ...staticMeta, ...dynamicMeta };
  Object.entries(allMeta).forEach(([route, meta]) => {
    const routePath = route === '/' ? 'index.html' : 'index.html';
    const folderPath = path.join(outputDir, route === '/' ? '' : route.replace(/\//g, '/'));
    const filePath = path.join(folderPath, routePath);

    // Ensure the folder path exists
    ensureFolderExists(folderPath);

    // Generate metadata content
    const metaTags = `
      <title>${meta.title}</title>
      <meta name="description" content="${meta.description}">
      <meta property="og:title" content="${meta.title}">
      <meta property="og:description" content="${meta.description}">
      <meta property="og:image" content="${meta.image}">
      <meta property="og:url" content="${meta.url}">
      <meta name="theme-color" content="${meta.color}">
    `;

    // Write the metadata to the file
    fs.writeFileSync(filePath, metaTags.trim());
    console.log(`Generated metadata for ${route}: ${filePath}`);
  });
}

generateMetaFiles().then();
console.log('Metadata generation complete!')
