// import React from "react";
// import { View, Text, ScrollView, Image, Pressable } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// const LEARNING_PATHS = [
//     {
//         id: "1",
//         title: "Lộ trình cho Teen mới bắt đầu",
//         description: "Khám phá các kiến thức cơ bản về tâm sinh lý và kỹ năng sống",
//         totalCourses: 5,
//         duration: "3 tháng",
//         level: "Beginner",
//         thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
//         progress: 30,
//     },
//     {
//         id: "2",
//         title: "Kỹ năng giao tiếp và xây dựng mối quan hệ",
//         description: "Phát triển kỹ năng mềm và tự tin trong giao tiếp",
//         totalCourses: 4,
//         duration: "2 tháng",
//         level: "Intermediate",
//         thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
//         progress: 0,
//     },
//     {
//         id: "3",
//         title: "Tự tin và phát triển bản thân",
//         description: "Xây dựng sự tự tin và định hướng tương lai",
//         totalCourses: 6,
//         duration: "4 tháng",
//         level: "Advanced",
//         thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2",
//         progress: 0,
//     },
// ];

// const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

// export default function LearningPathScreen() {
//     const [selectedLevel, setSelectedLevel] = React.useState("All");

//     return (
//         <ScrollView className="flex-1 bg-white">
//             <SafeAreaView>
//                 {/* Header Section */}
//                 <View className="px-4 pt-4">
//                     <Text className="text-2xl font-bold">Learning Paths</Text>
//                     <Text className="text-gray-600 mt-1">
//                         Khám phá lộ trình học phù hợp với bạn
//                     </Text>
//                 </View>

//                 {/* Level Filter */}
//                 <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     className="mt-4 pl-4"
//                 >
//                     {LEVELS.map((level) => (
//                         <Pressable
//                             key={level}
//                             onPress={() => setSelectedLevel(level)}
//                             className={`px-4 py-2 rounded-full mr-2 ${
//                                 selectedLevel === level
//                                     ? "bg-blue-500"
//                                     : "bg-gray-100"
//                             }`}
//                         >
//                             <Text
//                                 className={
//                                     selectedLevel === level
//                                         ? "text-white font-medium"
//                                         : "text-gray-600"
//                                 }
//                             >
//                                 {level}
//                             </Text>
//                         </Pressable>
//                     ))}
//                 </ScrollView>

//                 {/* Learning Paths */}
//                 <View className="p-4">
//                     {LEARNING_PATHS.filter(
//                         path =>
//                             selectedLevel === "All" ||
//                             path.level === selectedLevel
//                     ).map((path) => (
//                         <Pressable
//                             key={path.id}
//                             className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
//                             style={{
//                                 shadowColor: "#000",
//                                 shadowOffset: { width: 0, height: 2 },
//                                 shadowOpacity: 0.05,
//                                 shadowRadius: 4,
//                                 elevation: 3,
//                             }}
//                             onPress={() => router.push(`/paths/${path.id}`)}
//                         >
//                             <Image
//                                 source={{ uri: path.thumbnail }}
//                                 className="w-full h-48"
//                             />
//                             <View className="p-4">
//                                 <View className="flex-row items-center">
//                                     <View className="bg-blue-100 px-3 py-1 rounded-full">
//                                         <Text className="text-blue-600 text-sm">
//                                             {path.level}
//                                         </Text>
//                                     </View>
//                                     <View className="flex-row items-center ml-3">
//                                         <MaterialIcons
//                                             name="schedule"
//                                             size={16}
//                                             color="#6B7280"
//                                         />
//                                         <Text className="text-gray-600 text-sm ml-1">
//                                             {path.duration}
//                                         </Text>
//                                     </View>
//                                 </View>

//                                 <Text
//                                     className="text-lg font-bold mt-2"
//                                     numberOfLines={2}
//                                 >
//                                     {path.title}
//                                 </Text>
//                                 <Text
//                                     className="text-gray-600 mt-1"
//                                     numberOfLines={2}
//                                 >
//                                     {path.description}
//                                 </Text>

//                                 <View className="flex-row items-center mt-3">
//                                     <MaterialIcons
//                                         name="menu-book"
//                                         size={16}
//                                         color="#6B7280"
//                                     />
//                                     <Text className="text-gray-600 ml-1">
//                                         {path.totalCourses} khóa học
//                                     </Text>
//                                 </View>

//                                 {path.progress > 0 && (
//                                     <View className="mt-3">
//                                         <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                                             <View
//                                                 className="h-full bg-blue-500 rounded-full"
//                                                 style={{
//                                                     width: `${path.progress}%`,
//                                                 }}
//                                             />
//                                         </View>
//                                         <Text className="text-gray-500 text-xs mt-1">
//                                             {path.progress}% completed
//                                         </Text>
//                                     </View>
//                                 )}

//                                 <Pressable
//                                     className={`mt-3 p-3 rounded-xl ${
//                                         path.progress > 0
//                                             ? "bg-blue-500"
//                                             : "bg-gray-100"
//                                     }`}
//                                 >
//                                     <Text
//                                         className={`text-center font-medium ${
//                                             path.progress > 0
//                                                 ? "text-white"
//                                                 : "text-gray-600"
//                                         }`}
//                                     >
//                                         {path.progress > 0
//                                             ? "Tiếp tục học"
//                                             : "Bắt đầu ngay"}
//                                     </Text>
//                                 </Pressable>
//                             </View>
//                         </Pressable>
//                     ))}
//                 </View>
//             </SafeAreaView>
//         </ScrollView>
//     );
// } 