export type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    instructor: string;
    rating: number;
    students: number;
    category: "teen" | "parent" | "general";
    topics: string[];
    level: "beginner" | "intermediate" | "advanced";
    duration: string;
    chapters: Chapter[];
};

export type Chapter = {
    id: string;
    title: string;
    description: string;
    duration: string;
    lessons: Lesson[];
};

export type Lesson = {
    id: string;
    title: string;
    duration: string;
    type: "video" | "quiz" | "reading";
    completed?: boolean;
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: 'book' | 'gift' | 'souvenir';
  stock: number;
} 