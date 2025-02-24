import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderWithBackProps = {
  title: string;
  showMoreOptions?: boolean;
  isNotBackable?: boolean;
};

const MENU_OPTIONS = [
  {
    id: "home",
    title: "Trang chủ",
    icon: "home",
    route: "/child/(tabs)/home",
  },
  {
    id: "my-courses",
    title: "Khóa học của tôi",
    icon: "school",
    route: "/child/(tabs)/my-courses",
  },
  {
    id: "games",
    title: "Trò chơi",
    icon: "sports-esports",
    route: "/child/(tabs)/games",
  },
  {
    id: "achievements",
    title: "Thành tích",
    icon: "emoji-events",
    route: "/child/achievements",
  },
  {
    id: "settings",
    title: "Cài đặt",
    icon: "settings",
    route: "/child/settings",
  },
];

export default function HeaderWithBack({
  title,
  showMoreOptions = true,
  isNotBackable: isNotBackable,
}: HeaderWithBackProps) {
  const [showMenu, setShowMenu] = useState(false);
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    try {
      router.push("/child/(tabs)/home");
    } catch (error) {
      console.log("error at header with back component ", error);
    }
  };

  return (
    <>
      <View
        className="flex-row items-center justify-between p-4 bg-white"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center flex-1">
          {!isNotBackable ? (
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </Pressable>
          ) : (
            <></>
          )}
          <Text
            className="text-xl font-bold ml-4 max-w-[250px]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {showMoreOptions && (
          <Pressable
            onPress={() => setShowMenu(true)}
            className="w-10 h-10 items-center justify-center rounded-full bg-violet-50"
            hitSlop={8}
          >
            <MaterialIcons name="more-vert" size={24} color="#7C3AED" />
          </Pressable>
        )}
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
            className="absolute right-4 bg-white rounded-2xl w-64 overflow-hidden"
            style={{ top: insets.top + 60 }}
          >
            {MENU_OPTIONS.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  setShowMenu(false);
                  router.push(option.route as any);
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
