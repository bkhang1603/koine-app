import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/queries/useCart";
import { CartType } from "@/model/cart";

export default function CartScreen() {
  const cart = useAppStore((state) => state.cart);
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const updateQuantity = useUpdateCartItemMutation();
  const deleteItem = useDeleteCartItemMutation();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState(cart ? cart?.cartDetails : []);
  const [debouncedUpdates, setDebouncedUpdates] = useState<
    { cartDetailId: string; quantity: number }[]
  >([]);

  const [itemsToCheckout, setItemToCheckout] = useState<
    CartType["cartDetails"]
  >([]);
  const isAllSelected = selectedItems.length === items.length;
  const total = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (sum, item) => sum + item.unitPrice * item.quantity * (1 - item.discount),
      0
    );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
      setItemToCheckout([]); // Xóa tất cả item khi bỏ chọn tất cả
    } else {
      setSelectedItems(items.map((item) => item.id));
      setItemToCheckout(items); // Thêm tất cả items vào itemsToCheckout khi chọn tất cả
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
      setItemToCheckout(itemsToCheckout.filter((item) => item.id !== id)); // Xóa item khỏi itemsToCheckout khi bỏ chọn
    } else {
      setSelectedItems([...selectedItems, id]);
      const selectedItem = items.find((item) => item.id === id);
      if (selectedItem) {
        setItemToCheckout([...itemsToCheckout, selectedItem]); // Thêm item vào itemsToCheckout khi chọn
      }
    }
  };

  const handleDeleteConfirmation = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            await deleteSelected(); // Gọi hàm xóa sản phẩm ở đây nếu cần
          },
          style: "destructive",
        },
      ]
    );
  };

  const deleteSelected = async () => {
    try {
      const body = {
        arrayCartDetailIds: selectedItems,
      };
      const res = await deleteItem.mutateAsync({
        body: body,
        token: token,
      });
      setItems(items.filter((item) => !selectedItems.includes(item.id)));
      setItemToCheckout(
        itemsToCheckout.filter((item) => !selectedItems.includes(item.id))
      );

      setSelectedItems([]);
    } catch (error) {
      console.log("Error when delete cart item ", error);
    }
  };

  //tạo thêm 1 mảng để lưu những item được update trong thời gian debounce để call
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Cập nhật lại itemsToCheckout nếu item có trong danh sách đã chọn
    if (selectedItems.includes(id)) {
      setItemToCheckout((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }

    // Cập nhật vào mảng debouncedUpdates
    setDebouncedUpdates((prev) => {
      const existingItem = prev.find((item) => item.cartDetailId === id);
      if (existingItem) {
        return prev.map((item) =>
          item.cartDetailId === id ? { ...item, quantity } : item
        );
      }
      return [...prev, { cartDetailId: id, quantity }];
    });
  };

  useEffect(() => {
    if (debouncedUpdates.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        // Chỉ gọi API khi debounce hết thời gian
        const updates = debouncedUpdates.map((update) => ({
          cartDetailId: update.cartDetailId,
          quantity: update.quantity,
        }));
        const res = await updateQuantity.mutateAsync({
          body: updates,
          token: token,
        });
      } catch (error) {
        console.error("Error updating cart items ", error);
      }

      // Sau khi gọi API xong, xóa mảng debouncedUpdates
      setDebouncedUpdates([]);
    }, 500);

    return () => {
      // Hủy gọi API nếu có thay đổi trong thời gian debounce
      clearTimeout(timer);
    };
  }, [debouncedUpdates, token, updateQuantity]);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack title="Giỏ hàng" showMoreOptions={false} />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Giỏ hàng của bạn đang trống
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Tiếp tục mua sắm</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Giỏ hàng" showMoreOptions={false} />
      {/* Actions */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <Pressable className="flex-row items-center" onPress={toggleSelectAll}>
          <MaterialIcons
            name={isAllSelected ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={isAllSelected ? "#3B82F6" : "#9CA3AF"}
          />
          <Text className="ml-2">Chọn tất cả</Text>
        </Pressable>
        {selectedItems.length > 0 && (
          <Pressable
            className="flex-row items-center"
            onPress={handleDeleteConfirmation}
          >
            <MaterialIcons name="delete" size={24} color="#EF4444" />
            <Text className="ml-2 text-red-500">
              Xóa đã chọn ({selectedItems.length})
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="bg-gray-100">
        <View className="p-3">
          {items.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center py-2 px-2 mb-3 rounded-2xl border-2 shadow-md ${
                selectedItems.includes(item.id)
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <Pressable
                onPress={() => toggleSelectItem(item.id)}
                hitSlop={8}
                className="self-center"
              >
                <MaterialIcons
                  name={
                    selectedItems.includes(item.id)
                      ? "check-box"
                      : "check-box-outline-blank"
                  }
                  size={24}
                  color={
                    selectedItems.includes(item.id) ? "#3B82F6" : "#9CA3AF"
                  }
                />
              </Pressable>
              <Image
                source={{ uri: item.objectImageUrl }}
                className="w-28 h-28 rounded-xl ml-1"
              />
              <View className="flex-1 ml-3">
                <Text
                  className="font-semibold text-gray-800 text-base"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.objectName}
                </Text>

                {/* Mô tả */}
                <View className="flex-row items-center mt-1.5">
                  <MaterialIcons
                    name="info-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text
                    className="text-gray-600 ml-1 text-sm flex-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.objectDescription}
                  </Text>
                </View>

                {/* Đơn giá */}
                <View className="flex-row items-center mt-1.5">
                  <MaterialIcons
                    name="receipt-long"
                    size={16}
                    color="#6B7280"
                  />
                  <View className="flex-row items-center ml-1">
                    {item.discount > 0 ? (
                      <>
                        <Text className="text-blue-600 font-bold text-sm">
                          {(
                            item.unitPrice *
                            (1 - item.discount)
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </Text>
                        <Text className="text-gray-400 line-through text-xs ml-2">
                          {item.unitPrice.toLocaleString("vi-VN")} đ
                        </Text>
                      </>
                    ) : (
                      <Text className="text-gray-600 text-sm">
                        {item.unitPrice.toLocaleString("vi-VN")} đ
                      </Text>
                    )}
                  </View>
                </View>

                {/* Giá và Số lượng */}
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <Text className="text-blue-600 font-bold text-base ml-1">
                      Tổng:{" "}
                      {(
                        item.unitPrice *
                        (1 - item.discount) *
                        item.quantity
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </Text>
                  </View>
                </View>
                <View className="flex-row self-end w-[85px] items-center bg-gray-50 rounded-lg border border-gray-200">
                  <Pressable
                    className="w-7 h-7 items-center justify-center"
                    onPress={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <MaterialIcons
                      name="remove"
                      size={18}
                      color={item.quantity <= 1 ? "#9CA3AF" : "#374151"}
                    />
                  </Pressable>
                  <Text className="mx-2 font-medium">{item.quantity}</Text>
                  <Pressable
                    className="w-7 h-7 items-center justify-center"
                    onPress={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <MaterialIcons name="add" size={18} color="#374151" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="p-3 border-t border-gray-100 bg-white">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-600 text-base">
              Đã chọn: {selectedItems.length} sản phẩm
            </Text>
            <Text className="text-gray-800 font-semibold text-base mt-2">
              Tổng tiền:{" "}
              <Text className="text-blue-600 font-bold text-xl">
                {total.toLocaleString("vi-VN")} ₫
              </Text>
            </Text>
          </View>
          <Pressable
            className={`px-5 py-4 rounded-2xl ${
              selectedItems.length > 0 ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={() => {
              if (selectedItems.length > 0) {
                const itemsQueryString = JSON.stringify(itemsToCheckout);
                router.push(
                  `/cart/checkout?itemsToCheckout=${encodeURIComponent(
                    itemsQueryString
                  )}`
                );
              }
            }}
            disabled={selectedItems.length === 0}
          >
            <Text
              className={`font-bold text-base ${
                selectedItems.length > 0 ? "text-white" : "text-gray-500"
              }`}
            >
              Thanh toán
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
