
// Sample data for alternatives
export interface Alternative {
  id: string;
  name: string;
  description: string;
  category: string;
  likes: number;
  platform: string[];
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  imageUrl: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const alternatives: Alternative[] = [
  {
    id: '1',
    name: 'GIMP',
    description: 'A free and open-source raster graphics editor used for image manipulation and editing.',
    category: 'Photo Editing',
    likes: 3425,
    platform: ['Windows', 'macOS', 'Linux'],
    pricing: 'Open Source',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/The_GIMP_icon_-_gnome.svg/1200px-The_GIMP_icon_-_gnome.svg.png',
    url: 'https://www.gimp.org/'
  },
  {
    id: '2',
    name: 'Figma',
    description: 'A collaborative interface design tool that enables multiple designers to work on the same project simultaneously.',
    category: 'Design',
    likes: 5829,
    platform: ['Web', 'Windows', 'macOS'],
    pricing: 'Freemium',
    imageUrl: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png?w=670&h=670&q=75&fit=max&auto=format',
    url: 'https://www.figma.com/'
  },
  {
    id: '3',
    name: 'Visual Studio Code',
    description: 'A source-code editor made by Microsoft with support for debugging, syntax highlighting, and Git integration.',
    category: 'Development',
    likes: 7291,
    platform: ['Windows', 'macOS', 'Linux'],
    pricing: 'Free',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png',
    url: 'https://code.visualstudio.com/'
  },
  {
    id: '4',
    name: 'DaVinci Resolve',
    description: 'A professional video editing, color correction, visual effects, and audio post-production application.',
    category: 'Video Editing',
    likes: 4128,
    platform: ['Windows', 'macOS', 'Linux'],
    pricing: 'Freemium',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/1200px-DaVinci_Resolve_17_logo.svg.png',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve/'
  },
  {
    id: '5',
    name: 'Brave Browser',
    description: 'A free and open-source web browser focused on privacy and security with built-in ad blocking.',
    category: 'Web Browsers',
    likes: 6239,
    platform: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'],
    pricing: 'Free',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Brave_lion_icon.svg/1024px-Brave_lion_icon.svg.png',
    url: 'https://brave.com/'
  },
  {
    id: '6',
    name: 'Notion',
    description: 'An all-in-one workspace for notes, tasks, wikis, and databases with a flexible, modular design.',
    category: 'Productivity',
    likes: 8127,
    platform: ['Web', 'Windows', 'macOS', 'Android', 'iOS'],
    pricing: 'Freemium',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    url: 'https://www.notion.so/'
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Photo Editing', icon: 'image', count: 48 },
  { id: '2', name: 'Design', icon: 'palette', count: 64 },
  { id: '3', name: 'Development', icon: 'code', count: 127 },
  { id: '4', name: 'Video Editing', icon: 'video', count: 37 },
  { id: '5', name: 'Web Browsers', icon: 'globe', count: 22 },
  { id: '6', name: 'Productivity', icon: 'check-square', count: 95 },
  { id: '7', name: 'Music', icon: 'music', count: 41 },
  { id: '8', name: 'Communication', icon: 'message-circle', count: 53 }
];

export const featuredAlternative: Alternative = {
  id: '7',
  name: 'Affinity Designer',
  description: 'A professional graphic design software that serves as a powerful alternative to Adobe Illustrator with a one-time purchase model instead of subscription.',
  category: 'Design',
  likes: 6843,
  platform: ['Windows', 'macOS', 'iPad'],
  pricing: 'Paid',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Affinity_Designer_logo_new.png',
  url: 'https://affinity.serif.com/designer/'
};
