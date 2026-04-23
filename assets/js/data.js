/**
 * data.js — all portfolio content in one place.
 * Maya edits this file to add/update artwork; no HTML changes needed.
 */

const siteData = {
  owner:     'Maya Angela de Alba',
  email:     'mayadeangela@gmail.com',        // REPLACE with real email
  instagram: 'https://www.instagram.com/mayadealbaillustrations/',  // REPLACE with real URL

  bio: {
    short: 'My name is Maya Angela de Alba and I am an illustrator currently pursuing a BFA at the Savannah College of Art and Design.',
    long:  'My name is Maya Angela de Alba and I am an illustrator currently pursuing a BFA at the Savannah College of Art and Design. My work spans editorial illustration, surface design, and motion, drawing from a love of folklore, natural history, and handcrafted ornament.',
  },

  heroImages: [
    { src: 'assets/images/hero/hero1.jpg', alt: 'Hero artwork 1' },
    { src: 'assets/images/hero/hero2.jpg', alt: 'Hero artwork 2' },
    { src: 'assets/images/hero/hero3.jpg', alt: 'Hero artwork 3' },
  ],

  illustrations: [
    // Add illustration objects here:
    // { id: 'macabre', src: 'assets/images/macabre.jpg', alt: 'Macabre composition with skeleton and botanical elements' },
  ],

  surfaceProjects: [
    {
      id:          'medieval-fairytale',
      title:       'Medieval Fairytale',
      tagline:     'Medieval history, art, and culture with a mix of fantasy',
      thumbnail:   'assets/images/surface/medieval-thumb.jpg',
      description: 'A personal pattern project based on my favorite things: Medieval history, art, and culture with a mix of fantasy!',
      images: [
        'assets/images/surface/medieval-motifs-green.jpg',
        'assets/images/surface/medieval-motifs-orange.jpg',
        'assets/images/surface/medieval-pattern-orange.jpg',
        'assets/images/surface/medieval-pattern-green.jpg',
      ],
      processDescription: 'I often start my projects by creating three different themes with various motifs for each. After landing on a theme, I move forward with refining my sketch and doing my linework traditionally with ink. I then color everything digitally and create my patterns with Adobe Illustrator!',
      processImages: [
        'assets/images/surface/medieval-process-sketch.jpg',
        'assets/images/surface/medieval-process-ink.jpg',
      ],
      mockupImages: [
        'assets/images/surface/medieval-mockup-fabric.jpg',
      ],
    },
    // Add more surface design projects here
  ],
};
