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
    { src: 'assets/images/hero/hero4.jpg', alt: 'Hero artwork 4' },
    { src: 'assets/images/hero/hero5.jpg', alt: 'Hero artwork 5' },
    { src: 'assets/images/hero/hero6.jpg', alt: 'Hero artwork 6' },
    { src: 'assets/images/hero/hero7.jpg', alt: 'Hero artwork 7' },
    { src: 'assets/images/hero/hero8.jpg', alt: 'Hero artwork 8' },

  ],

  illustrations: [
    { id: 'hero1', src: 'assets/images/hero/hero1.jpg', alt: 'Illustration 1' },
    { id: 'hero2', src: 'assets/images/hero/hero2.jpg', alt: 'Illustration 2' },
    { id: 'hero3', src: 'assets/images/hero/hero3.jpg', alt: 'Illustration 3' },
    { id: 'hero4', src: 'assets/images/hero/hero4.jpg', alt: 'Illustration 4' },
    { id: 'hero5', src: 'assets/images/hero/hero5.jpg', alt: 'Illustration 5' },
    { id: 'hero6', src: 'assets/images/hero/hero6.jpg', alt: 'Illustration 6' },
    { id: 'hero7', src: 'assets/images/hero/hero7.jpg', alt: 'Illustration 7' },
    { id: 'hero8', src: 'assets/images/hero/hero8.jpg', alt: 'Illustration 8' },
  ],

  motionProjects: [
    {
      id:          'food-of-the-philippines',
      title:       'Food of The Philippines',
      tagline:     'Enter tagline here! :3',
      thumbnail:   'assets/images/motion/food-of-philippines.jpg',
      description: 'A personal project showcasing the different food found in various parts of the Philippines, my home country! Made with Adobe After Effects.',
      video:       'https://www.youtube.com/watch?v=y0sF5xhGreA',
    },
    {
      id:          'cup-noodle-ad',
      title:       'Cup Noodles Advetisement',
      tagline:     'Enter tagline here! :3',
      thumbnail:   'assets/images/motion/cup-noodle-ad.jpg',
      description: 'A seamlessly looping animated piece drawing from Eastern European folk art motifs, exploring the rhythm and repetition found in traditional textile patterns.',
      video:       'https://www.youtube.com/watch?v=PEJ2vWtrJ-E',
    },
    // Add more motion projects here
  ],

  surfaceProjects: [
    {
      id:          'medieval-fairytale',
      title:       'Medieval Fairytale',
      tagline:     'Medieval history, art, and culture with a mix of fantasy',
      thumbnail:   'assets/images/surface/medieval-fairytale.jpg',
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
    {
      id:          'dinosaurs-in-space',
      title:       'Dinosaurs in Space',
      tagline:     'cool dinosaurs :3',
      thumbnail:   'assets/images/surface/dinosaurs-in-space.jpg',
      description: 'A self-directed pattern project designed for children’s apparel, wrapping paper, greeting cards, and school materials.',
      images: [
        'assets/images/surface/dinosaurs-in-space.jpg',
      ],
      processDescription: '',
      processImages: [],
      mockupImages: [],
    },
    {
      id:          'filipino-christmas',
      title:       'Filipino Christmas',
      tagline:     'Maligayang pasko: a Filipino Christmas',
      thumbnail:   'assets/images/surface/filipino-christmas.webp',
      description: 'A Christmas collection inspired by cultural aspects of the traditional Filipino Christmas.',
      images: [
        'assets/images/surface/filipino-christmas.webp',
      ],
      processDescription: '',
      processImages: [],
      mockupImages: [],
    },
  ],
};
