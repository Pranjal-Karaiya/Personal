export const weddingConfig = {
  couple: {
    groom: 'Pranjal',
    bride: 'Vaishali',
    displayName: 'Pranjal & Vaishali',
    groomLines: ['Son of Mr. & Mrs. Khan', 'M.Tech, Phd', 'Software Engineer'],
    brideLines: ['Daughter of Mr. & Mrs. Pathan', 'B.Tech, MBA', 'Advocate, High Court']
  },
  hero: {
    welcomeMessage: 'We are honored to welcome you to the Wedding ceremony of..'
  },
  wedding: {
    date: '2027-02-15',
    time: '18:00',
    timezone: 'Asia/Kolkata',
    displayDate: '15 FEBRUARY 2027',
    displayLocation: 'BILASPUR, CHHATTISGARH'
  },
  location: {
    city: 'Bilaspur',
    state: 'Chhattisgarh',
    country: 'India',
    display: 'Bilaspur, Chhattisgarh, India'
  },
  venue: {
    name: 'VENUE NAME',
    address: 'VENUE ADDRESS',
    city: 'Bilaspur, Chhattisgarh',
    mapUrl: '',
    image: 'assets/images/venue/venue.svg'
  },
  contact: {
    whatsapp: '',
    phone: ''
  },
  music: {
    enabled: true,
    source: 'assets/audio/wedding-music.mp3'
  },
  share: {
    title: 'Pranjal & Vaishali — Wedding Invitation',
    text: 'Join Pranjal & Vaishali for their wedding celebration.'
  },
  envelope: {
    enabled: true,
    useVideo: true,
    sealText: 'Tap to open',
    inviteText: 'You are invited'
  },
  theme: {
    id: 'royal-prestige',
    heroVideo: 'assets/video/royal-prestige.mp4',
    /**
     * Seconds from intro play start when HTML copy appears (12 = 00:12).
     * Fine-tune ±0.2 if it must match baked-in video typography.
     */
    heroTextRevealAt: 0.9,
    /** If true, HTML copy is hidden until heroTextRevealAt. */
    heroHtmlSyncedToVideo: true,
    /**
     * Royal Prestige demo MP4 includes typography in the video file.
     * Set false when using a background-only export — then only HTML shows names.
     */
    /** Only set true if your MP4 already has names baked in (hides HTML names to avoid double text). */
    heroVideoBurnedInText: false,
    heroSlideshowIntervalMs: 5500
  },
  images: {
    hero: 'assets/images/hero/hero-main.svg',
    heroMobile: 'assets/images/hero/hero-mobile.svg',
    heroSlides: [
      'assets/images/hero/slide-01.svg',
      'assets/images/hero/slide-02.svg',
      'assets/images/hero/slide-03.svg',
      'assets/images/hero/slide-04.svg'
    ],
    couple: [
      'assets/images/couple/couple-01.svg',
      'assets/images/couple/couple-02.svg',
      'assets/images/couple/couple-03.svg',
      'assets/images/couple/couple-04.svg'
    ],
    gallery: [
      'assets/images/gallery/gallery-01.svg',
      'assets/images/gallery/gallery-02.svg',
      'assets/images/gallery/gallery-03.svg',
      'assets/images/gallery/gallery-04.svg',
      'assets/images/gallery/gallery-05.svg',
      'assets/images/gallery/gallery-06.svg',
      'assets/images/gallery/gallery-07.svg',
      'assets/images/gallery/gallery-08.svg'
    ]
  }
};
