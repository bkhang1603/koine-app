import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderWithBackProps = {
  title: string;
  showMoreOptions?: boolean;
  returnTab?: string;
};

const MENU_OPTIONS = [
  {
    id: "home",
    title: "Trang chủ",
    icon: "home",
    route: "/(tabs)/home",
  },
  {
    id: "courses",
    title: "Khóa học",
    icon: "menu-book",
    route: "/(tabs)/course/course",
  },
  {
    id: "my-courses",
    title: "Khóa học của tôi",
    icon: "school",
    route: "/(tabs)/my-courses/my-courses",
  },
  {
    id: "profile",
    title: "Tài khoản",
    icon: "person",
    route: "/(tabs)/profile/profile",
  },
  {
    id: "blog",
    title: "Blog",
    icon: "article",
    route: "/(tabs)/blog/blog",
  },
];

export default function HeaderWithBack({
  title,
  showMoreOptions = true,
  returnTab: returnTab,
}: HeaderWithBackProps) {
  const [showMenu, setShowMenu] = useState(false);
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    try {
      if(!returnTab){
        router.replace("/(tabs)/home");
      }else{
        router.replace(returnTab as any)
      }
      
    } catch (error) {
      console.log("error at header with back component ", error);
    }
  };

  return (
    <>
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white border-b border-gray-200"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </Pressable>

            <Text
              className="text-xl font-bold ml-4 flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>

          {showMoreOptions && (
            <Pressable
              onPress={() => setShowMenu(true)}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-4"
            >
              <MaterialIcons name="more-vert" size={24} color="#374151" />
            </Pressable>
          )}
        </View>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowMenu(false)}
        >
          <View
            className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl w-64"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {MENU_OPTIONS.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  setShowMenu(false);
                  router.replace(option.route as any);
                }}
                className={`flex-row items-center p-4 ${
                  index !== MENU_OPTIONS.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <MaterialIcons
                  name={option.icon as any}
                  size={24}
                  color="#374151"
                />
                <Text className="ml-3 text-gray-700">{option.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
