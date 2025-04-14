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

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-gray-50">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            backgroundColor: "#eff6ff",
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
          name="home"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="approve-course"
          options={{
            title: "Khóa học cần duyệt",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="menu-book" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="event-list"
          options={{
            title: "Danh sách sự kiện",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="event-note" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Tài khoản",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="person" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
