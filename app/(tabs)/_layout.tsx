import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TabIcon = ({ icon, focused }: any) => {
    return (
        <View
            className={`w-10 h-10 items-center justify-center rounded-xl ${
                focused ? "bg-blue-200" : "bg-transparent"
            }`}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            <MaterialIcons
                name={icon}
                size={22}
                color={focused ? "#3b82f6" : "#3b82f6"}
            />
        </View>
    );
};

const HomeIcon = ({ focused }: any) => {
    return (
        <View
            className="items-center justify-center"
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#3b82f6",
                borderWidth: 4,
                borderColor: "#eff6ff",
                marginBottom: 30,
            }}
        >
            <MaterialIcons name="home" size={28} color="#ffffff" />
        </View>
    );
};

export default function TabsLayout() {
    return (
        <View className="flex-1 bg-gray-50">
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: "#eff6ff",
                        borderTopWidth: 2,
                        elevation: 0,
                        shadowOpacity: 0,
                        shadowColor: "transparent",
                        shadowRadius: 0,
                        shadowOffset: { height: 0, width: 0 },
                        paddingTop: 10,
                        paddingHorizontal: 16,
                        marginHorizontal: 20,
                        marginBottom: Platform.OS === "ios" ? 20 : 20,
                        borderRadius: 100,
                        position: "absolute",
                        borderWidth: 2,
                        borderColor: "#e2e8f0",
                        ...Platform.select({
                            android: {
                                elevation: 0,
                                backgroundColor: "white",
                            },
                        }),
                    },
                    tabBarShowLabel: false,
                }}
            >
                <Tabs.Screen
                    name="blog/blog"
                    options={{
                        title: "Blog",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon icon="article" focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="course/course"
                    options={{
                        title: "Khóa học",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon icon="menu-book" focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Trang chủ",
                        tabBarIcon: ({ focused }) => (
                            <HomeIcon focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="my-courses/my-courses"
                    options={{
                        title: "Của tôi",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon icon="school" focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile/profile"
                    options={{
                        title: "Cá nhân",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon icon="person" focused={focused} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
