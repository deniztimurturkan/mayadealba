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
    long:  'My name is Maya Angela de Alba and I am an illustrator currently pursuing a BFA at the Savannah College of Art and Design. My work spans editorial illustration and surface design, drawing from a love of folklore, natural history, and handcrafted ornament.',
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
    { id: 'pepsi-cola', src: 'assets/images/illustration/ATL_202520_ILLU100_MayadeAlba_A3_PepsiCola.jpg', alt: 'Pepsi Cola illustration' },
    { id: 'pokemon', src: 'assets/images/illustration/ATL_202520_ILLU100_MayadeAlba_A4_Pokemon.jpg', alt: 'Pokémon-inspired illustration' },
    { id: 'slavic-fairytales', src: 'assets/images/illustration/ATL_202530_ILLU218_MayadeAlba_A1_slavicfairytalesCL.jpg', alt: 'Slavic fairy tales illustration' },
    { id: 'album-cover', src: 'assets/images/illustration/ATL_202530_ILLU218_MayadeAlba_A4_AlbumCoverwithtext.jpg', alt: 'Album cover illustration' },
    { id: 'genre-swap', src: 'assets/images/illustration/ATL_202530_ILLU225_MayadeAlba_A2_GenreSwap.jpg', alt: 'Genre swap illustration' },
    { id: 'fortune-teller', src: 'assets/images/illustration/ATL_202610_ILLU309_MayadeAlba_A1_AFortuneTeller.jpg', alt: 'A Fortune Teller illustration' },
    { id: 'draw-a-crowd', src: 'assets/images/illustration/ATL_202710_ILLU318_MayadeAlba_A2_DrawACrowd_Poster.png', alt: 'Draw a Crowd poster illustration' },
    { id: 'the-tower', src: 'assets/images/illustration/TheTower.jpg', alt: 'The Tower illustration' },
    { id: 'witch', src: 'assets/images/illustration/Witch.jpg', alt: 'Witch illustration' },
    { id: 'girl-paint', src: 'assets/images/illustration/GirlPaint.jpg', alt: 'Girl painting illustration' },
    { id: 'holiday-market-poster', src: 'assets/images/illustration/HolidayMarketPoster_MayadeAlba_Invitation.jpg', alt: 'Holiday Market Poster invitation illustration' },
    { id: 'illustration-1', src: 'assets/images/illustration/1.jpg', alt: 'Illustration' },
  ],

  surfaceProjects: [
    {
      id:          'medieval-fairytale',
      title:       'Medieval Fairytale',
      tagline:     'Medieval history, art, and culture with a mix of fantasy',
      thumbnail:   'assets/images/surface/medieval/medieval-fairytale.jpg',
      description: 'A personal pattern project based on my favorite things: Medieval history, art, and culture with a mix of fantasy!',
      images: [
        'assets/images/surface/medieval/1.jpg',
        'assets/images/surface/medieval/2.jpg',
        'assets/images/surface/medieval/3.jpg',
        'assets/images/surface/medieval/4.jpg',
        'assets/images/surface/medieval/5.jpg',
        'assets/images/surface/medieval/6.jpg',
      ],
      processDescription: 'I often start my projects by creating three different themes with various motifs for each. After landing on a theme, I move forward with refining my sketch and doing my linework traditionally with ink. I then color everything digitally and create my patterns with Adobe Illustrator!',
      processImages: [
        'assets/images/surface/medieval/7.jpg',
        'assets/images/surface/medieval/8.jpg',
      ],
      mockupImages: [
        'assets/images/surface/medieval/9.jpg',
        'assets/images/surface/medieval/10.jpg',
        'assets/images/surface/medieval/11.jpg',
        'assets/images/surface/medieval/12.jpg',
        'assets/images/surface/medieval/13.jpg',
        'assets/images/surface/medieval/14.jpg',

      ],
    },
    {
      id:          'dinosaurs-in-space',
      title:       'Dinosaurs in Space',
      tagline:     'cool dinosaurs :3',
      thumbnail:   'assets/images/surface/dinosaurs/dinosaurs-in-space.jpg',
      description: 'A self-directed pattern project designed for children`s apparel, wrapping paper, greeting cards, and school materials.',
      images: [
        'assets/images/surface/dinosaurs/dinosaurs-in-space.jpg',
      ],
      processDescription: '',
      processImages: [],
      mockupImages: [],
    },
    {
      id:          'filipino-christmas',
      title:       'Filipino Christmas',
      tagline:     'Maligayang pasko: a Filipino Christmas',
      thumbnail:   'assets/images/surface/filipinoChristmas/filipino-christmas.webp',
      description: 'A Christmas collection inspired by cultural aspects of the traditional Filipino Christmas.',
      images: [
        'assets/images/surface/filipinoChristmas/filipino-christmas.webp',
      ],
      processDescription: '',
      processImages: [],
      mockupImages: [],
    },
  ],
};
