// User
export const MOCK_USER = {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    avatar: "https://i.pravatar.cc/300",
    subAccounts: [
        {
            id: "sub1",
            name: "Bé Nam",
            birthYear: 2010,
            gender: "male",
            avatar: "https://i.pravatar.cc/300?img=3",
            activeCourses: ["1"],
        },
        {
            id: "sub2",
            name: "Bé Hoa",
            birthYear: 2012,
            gender: "female",
            avatar: "https://i.pravatar.cc/300?img=5",
            activeCourses: ["2"],
        },
    ],
    purchasedCourses: ["1", "2", "3"], // Array of course IDs
};

type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    rating: number;
    students: number;
    price: number;
    category: string;
    level: string;
    duration: string;
    featured: boolean;
    progress?: number;
    topics: string[];
    chapters: {
        id: string;
        title: string;
        description: string;
        duration: string;
        lessons: {
            id: string;
            title: string;
            duration: string;
            type: "video" | "text";
            completed: boolean;
            content?: string;
            videoUrl?: string;
        }[];
    }[];
};

// Thêm type và data cho my courses
type MyCourse = Course & {
    purchaseDate: string;
    progress: number;
    lastLearnedLessonId?: string;
};

// Courses
export const MOCK_COURSES: Course[] = [
    {
        id: "1",
        title: "Hiểu về cơ thể trong giai đoạn dậy thì",
        description:
            "Khám phá và hiểu về những thay đổi của cơ thể trong giai đoạn dậy thì. Khóa học giúp các bạn teen hiểu rõ hơn về các thay đổi sinh lý và tâm lý trong giai đoạn này.",
        thumbnail:
            "https://images.unsplash.com/photo-1532012197267-da84d127e765",
        rating: 4.8,
        students: 1234,
        price: 299000,
        category: "Sức khỏe",
        level: "Cơ bản",
        duration: "6 giờ",
        featured: true,
        progress: 35,
        topics: [
            "Thay đổi về thể chất",
            "Thay đổi về tâm lý",
            "Dinh dưỡng cho tuổi dậy thì",
            "Vệ sinh cá nhân",
            "Chăm sóc sức khỏe",
            "Phát triển bản thân",
        ],
        chapters: [
            {
                id: "c1",
                title: "Chương 1: Tổng quan về giai đoạn dậy thì",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l1",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    // More lessons...
                    {
                        id: "l2",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l3",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l4",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l5",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c2",
                title: "Chương 2: Các thay đổi về tâm lý",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l6",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l7",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l8",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l9",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l10",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c3",
                title: "Chương 3: Dinh dưỡng cho tuổi dậy thì",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l11",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l12",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l13",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l14",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c4",
                title: "Chương 4: Vệ sinh cá nhân",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l15",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l16",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l17",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l18",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l19",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c5",
                title: "Chương 5: Tổng quan về giai đoạn dậy thì",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l20",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l21",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l22",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l23",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l24",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            // More chapters...
        ],
    },
    {
        id: "2",
        title: "Kỹ năng giao tiếp cho tuổi teen",
        description:
            "Phát triển kỹ năng giao tiếp hiệu quả, tự tin trong các mối quan hệ và thể hiện bản thân một cách tích cực.",
        thumbnail:
            "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a",
        rating: 4.7,
        students: 856,
        price: 199000,
        category: "Kỹ năng",
        level: "Trung bình",
        duration: "4 giờ",
        featured: true,
        progress: 20,
        topics: [
            "Nguyên tắc giao tiếp cơ bản",
            "Kỹ năng lắng nghe",
            "Giao tiếp phi ngôn ngữ",
            "Xử lý xung đột",
            "Thuyết trình",
            "Làm việc nhóm",
        ],
        chapters: [
            {
                id: "c1",
                title: "Chương 1: Tổng quan về kỹ năng giao tiếp",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l1",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l2",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l3",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l4",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l5",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            // More chapters...
        ],
    },
    {
        id: "3",
        title: "Quản lý cảm xúc tuổi dậy thì",
        description:
            "Hiểu và kiểm soát cảm xúc, xây dựng sự tự tin và phát triển trí tuệ cảm xúc trong giai đoạn dậy thì.",
        thumbnail:
            "https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1",
        rating: 4.9,
        students: 647,
        price: 249000,
        category: "Tâm lý",
        level: "Cơ bản",
        duration: "5 giờ",
        featured: false,
        progress: 10,
        topics: [
            "Nhận diện cảm xúc",
            "Kiểm soát cảm xúc",
            "Xây dựng lòng tự trọng",
            "Đối mặt với áp lực",
            "Phát triển EQ",
        ],
        chapters: [
            {
                id: "c1",
                title: "Chương 1: Nhận diện cảm xúc",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l1",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l2",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l3",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l4",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l5",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c2",
                title: "Chương 2: Kiểm soát cảm xúc",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l6",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l7",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l8",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l9",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l10",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c3",
                title: "Chương 3: Xây dựng lòng tự trọng",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l11",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l12",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l13",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l14",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c4",
                title: "Chương 4: Đối mặt với áp lực",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l15",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l16",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l17",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l18",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l19",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            {
                id: "c5",
                title: "Chương 5: Phát triển trí tuệ cảm xúc",
                description: "Hiểu về các thay đổi trong giai đoạn dậy thì",
                duration: "1 giờ",
                lessons: [
                    {
                        id: "l20",
                        title: "Bài 1: Dậy thì là gì?",
                        duration: "15 phút",
                        type: "video",
                        completed: true,
                    },
                    {
                        id: "l21",
                        title: "Bài 2: Các thay đổi về thể chất",
                        duration: "20 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l22",
                        title: "Bài 3: Các thay đổi về tâm lý",
                        duration: "25 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l23",
                        title: "Bài 4: Dinh dưỡng cho tuổi dậy thì",
                        duration: "30 phút",
                        type: "video",
                        completed: false,
                    },
                    {
                        id: "l24",
                        title: "Bài 5: Vệ sinh cá nhân",
                        duration: "15 phút",
                        type: "video",
                        completed: false,
                    },
                ],
            },
            // More chapters...
        ],
    },
    // More courses...
];

// Courses đã mua
export const MOCK_MY_COURSES: MyCourse[] = [
    {
        ...MOCK_COURSES[0], // Copy từ course hệ thống
        purchaseDate: "15/03/2024",
        progress: 35,
        lastLearnedLessonId: "l2",
    },
    {
        ...MOCK_COURSES[1],
        purchaseDate: "10/03/2024",
        progress: 20,
        lastLearnedLessonId: "l1",
    },
];

// Blog Posts
export const MOCK_BLOG_POSTS = [
    {
        id: "1",
        title: "10 cách giúp teen tự tin hơn trong giao tiếp",
        excerpt:
            "Khám phá những phương pháp hiệu quả giúp teen phát triển kỹ năng giao tiếp...",
        content: `
            <h2>Giao tiếp là kỹ năng quan trọng</h2>
            <p>Trong giai đoạn tuổi teen, giao tiếp đóng vai trò quan trọng trong cuộc sống hàng ngày. Nó giúp bạn:</p>
            <ul>
                <li>Kết nối với bạn bè và gia đình</li>
                <li>Tạo điều kiện cho việc học tập tốt hơn</li>
                <li>Phát triển kỹ năng sống và tư duy logic</li>
            </ul>
            <p>Ngoài ra, giao tiếp còn giúp bạn:</p>
            <ul>
                <li>Tăng cường khả năng tư duy logic</li>
                <li>Phát triển kỹ năng sống và tư duy logic</li>
            </ul>
            <p>Và nhiều hơn nữa...</p>
        `,
        thumbnail:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        author: "TS. Nguyễn Thị A",
        date: "15/03/2024",
        readTime: "5 phút",
        category: "Kỹ năng",
        featured: true,
    },
    {
        id: "2",
        title: "Dinh dưỡng hợp lý cho tuổi dậy thì",
        excerpt:
            "Chế độ ăn uống khoa học giúp phát triển toàn diện trong giai đoạn dậy thì...",
        content: `
            <h2>Tầm quan trọng của dinh dưỡng</h2>
            <p>Giai đoạn dậy thì cần được bổ sung đầy đủ các chất...</p>
        `,
        thumbnail:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        author: "ThS. Phạm Văn B",
        date: "14/03/2024",
        readTime: "7 phút",
        category: "Sức khỏe",
        featured: false,
    },
    {
        id: "3",
        title: "5 cách giúp teen đối mặt với áp lực học tập",
        excerpt:
            "Phương pháp hiệu quả giúp cân bằng việc học và sức khỏe tinh thần...",
        thumbnail:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        author: "PGS.TS. Trần Thị C",
        date: "13/03/2024",
        readTime: "6 phút",
        category: "Tâm lý",
        featured: false,
    },
    // More blog posts...
];

// Notifications
export const MOCK_NOTIFICATIONS = [
    {
        id: "1",
        title: "Khóa học mới",
        message: "Khám phá khóa học mới về kỹ năng giao tiếp",
        time: "5 phút trước",
        type: "course",
        read: false,
    },
    {
        id: "2",
        title: "Hoàn thành bài học",
        message: "Chúc mừng bạn đã hoàn thành bài học 'Kỹ năng lắng nghe'",
        time: "2 giờ trước",
        type: "achievement",
        read: true,
    },
    {
        id: "3",
        title: "Bài viết mới",
        message: "Đã có bài viết mới về 'Dinh dưỡng cho tuổi teen'",
        time: "1 ngày trước",
        type: "blog",
        read: true,
    },
    // More notifications...
];

// Orders
export const MOCK_ORDERS = [
    {
        id: "1",
        courseTitle: "Hiểu về cơ thể trong giai đoạn dậy thì",
        date: "15/03/2024",
        price: 299000,
        status: "completed",
        paymentMethod: "Thẻ tín dụng",
    },
    {
        id: "2",
        courseTitle: "Kỹ năng giao tiếp cho tuổi teen",
        date: "10/03/2024",
        price: 199000,
        status: "processing",
        paymentMethod: "Ví điện tử",
    },
    {
        id: "3",
        courseTitle: "Quản lý cảm xúc tuổi dậy thì",
        date: "05/03/2024",
        price: 249000,
        status: "completed",
        paymentMethod: "Chuyển khoản",
    },
    // More orders...
];

// Trong type định nghĩa lesson
type Lesson = {
    id: string;
    title: string;
    duration: string;
    type: "video" | "text" | "both";
    completed: boolean;
    content?: string; // Thêm trường content cho text lesson
    videoUrl?: string; // Thêm trường videoUrl cho video lesson
};

// Cập nhật mock data cho lessons
export const MOCK_LESSONS: Lesson[] = [
    {
        id: "l1",
        title: "Bài 1: Giới thiệu",
        duration: "15 phút",
        type: "text",
        completed: false,
        content: `
            <h1>Giới thiệu khóa học</h1>
            <p>Chào mừng bạn đến với khóa học. Trong bài học này, chúng ta sẽ tìm hiểu:</p>
            <ul>
                <li>Mục tiêu của khóa học</li>
                <li>Nội dung chính</li>
                <li>Cách thức học tập hiệu quả</li>
            </ul>
        `,
    },
    {
        id: "l2",
        title: "Bài 2: Video hướng dẫn",
        duration: "20 phút",
        type: "video",
        completed: false,
        videoUrl: "https://example.com/video.mp4",
    },
    {
        id: "l3",
        title: "Bài 3: Video hướng dẫn",
        duration: "20 phút",
        type: "both",
        completed: false,
        videoUrl: "https://example.com/video.mp4",
        content: `
            <h1>Giới thiệu khóa học</h1>
            <p>Chào mừng bạn đến với khóa học. Trong bài học này, chúng ta sẽ tìm hiểu:</p>
            <ul>
                <li>Mục tiêu của khóa học</li>
                <li>Nội dung chính</li>
            </ul>
        `,
    },
];

// Cart Items
export const MOCK_CART_ITEMS = [
    {
        id: "1",
        title: "Hiểu về cơ thể trong giai đoạn dậy thì",
        thumbnail: "./../../../assets/images/default-my-course-banner.jpg",
        duration: "6 giờ",
        price: 299000,
        quantity: 2,
    },
    {
        id: "2",
        title: "Kỹ năng giao tiếp cho tuổi teen",
        thumbnail: "https://example.com/course2.jpg",
        duration: "8 giờ",
        price: 399000,
        quantity: 1,
    },
];

// Purchased Courses
export const MOCK_PURCHASED_COURSES = [
    {
        courseId: "1",
        purchaseDate: "15/03/2024",
        quantity: 2,
        activated: 1,
        activatedFor: ["sub1"],
        orderId: "ord_1",
        price: 299000,
        status: "completed",
        paymentMethod: "Thẻ tín dụng",
    },
    {
        courseId: "2",
        purchaseDate: "10/03/2024",
        quantity: 3,
        activated: 0,
        activatedFor: [],
        orderId: "ord_2",
        price: 399000,
        status: "processing",
        paymentMethod: "Ví điện tử",
    },
    {
        courseId: "3",
        purchaseDate: "05/03/2024",
        quantity: 1,
        activated: 1,
        activatedFor: ["main"],
        orderId: "ord_3",
        price: 249000,
        status: "completed",
        paymentMethod: "Chuyển khoản",
    },
];

// Thêm type và data cho sub-accounts
type SubAccount = {
    id: string;
    name: string;
    avatar?: string;
    birthYear: number;
    gender: "male" | "female";
    activeCourses: string[]; // Array of course IDs
};

// Thêm vào mock data
export const MOCK_ACCOUNTS = [
    {
        id: "parent1",
        email: "parent@example.com",
        password: "123456", // Trong thực tế nên hash password
        name: "Nguyễn Văn A",
        role: "parent",
        avatar: "https://i.pravatar.cc/300",
        subAccounts: ["child1", "child2"],
    },
    {
        id: "child1",
        email: "child1@example.com",
        password: "123456",
        name: "Bé Nam",
        role: "child",
        avatar: "https://i.pravatar.cc/300?img=3",
        parentId: "parent1",
        birthYear: 2010,
        gender: "male",
        activeCourses: ["1", "3"], // Các khóa học đã được kích hoạt
    },
];

// Blog posts dành cho trẻ em
export const MOCK_CHILD_BLOGS = [
    {
        id: "1",
        title: "Làm thế nào để học tập hiệu quả?",
        thumbnail: "https://example.com/blog1.jpg",
        description: "Những mẹo hay giúp bạn học tập tốt hơn",
        content: "...",
        category: "study_tips",
        readTime: "5 phút",
        publishDate: "2024-03-15",
    },
    // Thêm các bài viết khác...
];

// Mock data cho child
export const MOCK_CHILD = {
    id: "child1",
    name: "Bé Nam",
    avatar: "https://i.pravatar.cc/300?img=3",
    age: 12,
    level: "Beginner",
    points: 1250,
    streakDays: 5,
    badges: [
        {
            id: "1",
            title: "Siêu sao học tập",
            description: "Hoàn thành 5 bài học liên tiếp",
            icon: "star",
            color: "violet",
        },
        {
            id: "2",
            title: "Người khám phá",
            description: "Hoàn thành 3 khóa học",
            icon: "explore",
            color: "blue",
        },
    ],
    activeCourses: [
        {
            id: "1",
            title: "Hiểu về cơ thể trong giai đoạn dậy thì",
            description:
                "Khóa học giúp bạn hiểu về cơ thể trong giai đoạn dậy thì",
            thumbnail: "https://example.com/puberty.jpg",
            progress: 65,
            lastLesson: {
                id: "l3",
                title: "Thay đổi tâm sinh lý",
                duration: "15 phút",
            },
            totalLessons: 10,
            completedLessons: 6,
        },
        {
            id: "2",
            title: "Kỹ năng giao tiếp cơ bản",
            description:
                "Khóa học giúp bạn hiểu về cơ thể trong giai đoạn dậy thì",
            thumbnail: "https://example.com/communication.jpg",
            progress: 30,
            lastLesson: {
                id: "l2",
                title: "Lắng nghe tích cực",
                duration: "20 phút",
            },
            totalLessons: 8,
            completedLessons: 2,
        },
    ],
    dailyTasks: [
        {
            id: "1",
            title: "Hoàn thành bài học",
            description: "Hoàn thành 3 bài học",
            icon: "school",
            points: 100,
            progress: 2,
            total: 3,
        },
        {
            id: "2",
            title: "Luyện tập",
            description: "Làm 5 bài tập",
            icon: "edit",
            points: 50,
            progress: 3,
            total: 5,
        },
    ],
    games: [
        {
            id: "1",
            title: "Quiz vui",
            description: "Trả lời câu hỏi về sức khỏe",
            thumbnail: "https://example.com/quiz.jpg",
            type: "quiz",
            points: 50,
            duration: "10 phút",
        },
        {
            id: "2",
            title: "Memory Game",
            description: "Rèn luyện trí nhớ",
            thumbnail: "https://example.com/memory.jpg",
            type: "memory",
            points: 30,
            duration: "5 phút",
        },
    ],
};

// Thêm mock data cho games
export const MOCK_GAMES = [
    {
        id: "1",
        title: "Quiz Sức khỏe",
        description: "Kiểm tra kiến thức về sức khỏe",
        thumbnail: "https://example.com/health-quiz.jpg",
        type: "quiz",
        category: "health",
        points: 100,
        duration: "10 phút",
        questions: [
            {
                id: "q1",
                question: "Nên uống bao nhiêu nước mỗi ngày?",
                options: ["1-2 lít", "2-3 lít", "3-4 lít", "4-5 lít"],
                correct: 1,
            },
            {
                id: "q2",
                question: "Nên ngủ bao nhiêu tiếng mỗi ngày?",
                options: ["4-5 tiếng", "6-7 tiếng", "7-8 tiếng", "9-10 tiếng"],
                correct: 2,
            },
        ],
    },
    {
        id: "2",
        title: "Memory Match",
        description: "Trò chơi rèn luyện trí nhớ",
        thumbnail: "https://example.com/memory.jpg",
        type: "memory",
        category: "brain",
        points: 50,
        duration: "5 phút",
        pairs: 8,
        cards: ["🍎", "🍌", "🍇", "🍊", "🍓", "🍉", "🥝", "🥭"],
    },
    {
        id: "3",
        title: "Puzzle",
        description: "Xếp hình các con số",
        thumbnail: "https://example.com/puzzle.jpg",
        type: "puzzle",
        category: "anatomy",
        points: 80,
        duration: "15 phút",
        pieces: 16,
        image: "https://example.com/anatomy.jpg",
    },
];

// Thêm mock data cho achievements
export const MOCK_ACHIEVEMENTS = [
    {
        id: "1",
        title: "Người học chăm chỉ",
        description: "Hoàn thành 5 bài học liên tiếp",
        icon: "school",
        progress: 3,
        total: 5,
        reward: 100,
        color: "violet",
    },
    {
        id: "2",
        title: "Siêu sao điểm số",
        description: "Đạt điểm tuyệt đối trong 3 bài kiểm tra",
        icon: "star",
        progress: 1,
        total: 3,
        reward: 200,
        color: "yellow",
    },
];
