interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    chapters: Chapter[];
}

interface Chapter {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    isCustomizable: boolean;
}

interface Lesson {
    id: string;
    title: string;
    content: string;
    duration: number;
    videoUrl?: string;
}

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: 'book' | 'gift' | 'souvenir';
    stock: number;
} 