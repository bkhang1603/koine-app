import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, View } from "react-native";

export default function ChildTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    backgroundColor: "#ede9fe",
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    paddingTop: 10,
                    paddingHorizontal: 16,
                    marginHorizontal: 20,
                    marginBottom: Platform.OS === "ios" ? 20 : 10,
                    borderRadius: 100,
                    position: "absolute",
                    ...Platform.select({
                        android: {
                            elevation: 8,
                            backgroundColor: "white",
                        },
                    }),
                },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20,
                            }}
                        >
                            <MaterialIcons
                                name="home"
                                size={28}
                                color={focused ? "#7c3aed" : "#c4b5fd"}
                            />
                            {focused && (
                                <View className="absolute -bottom-1 left-2 translate-x-1/2 w-3 h-1 rounded-full bg-violet-500" />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="my-courses"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20,
                            }}
                        >
                            <MaterialIcons
                                name="school"
                                size={28}
                                color={focused ? "#7c3aed" : "#c4b5fd"}
                            />
                            {focused && (
                                <View className="absolute -bottom-1 left-2 translate-x-1/2 w-3 h-1 rounded-full bg-violet-500" />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="games"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20,
                            }}
                        >
                            <MaterialIcons
                                name="sports-esports"
                                size={28}
                                color={focused ? "#7c3aed" : "#c4b5fd"}
                            />
                            {focused && (
                                <View className="absolute -bottom-1 left-2 translate-x-1/2 w-3 h-1 rounded-full bg-violet-500" />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20,
                            }}
                        >
                            <MaterialIcons
                                name="person"
                                size={28}
                                color={focused ? "#7c3aed" : "#c4b5fd"}
                            />
                            {focused && (
                                <View className="absolute -bottom-1 left-2 translate-x-1/2 w-3 h-1 rounded-full bg-violet-500" />
                            )}
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
