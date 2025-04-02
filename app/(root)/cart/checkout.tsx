import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { CartType } from "@/model/cart";
import { useAppStore } from "@/components/app-provider";
import {
  useCreateShippingInfos,
  useDeleteShippingInfos,
  useShippingInfos,
} from "@/queries/useShippingInfos";
import {
  RadioButton,
  Button,
  Modal,
  Portal,
  IconButton,
  TextInput,
} from "react-native-paper";
import { AShippingAddressType } from "@/model/shipping-address";
import { useCreateOrder } from "@/queries/useOrder";
import { z } from "zod";

//thiếu api checkout
export default function CheckoutScreen() {
  const router = useRouter();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";
  const [isProduct, setIsProduct] = useState(false);
  const payment = useCreateOrder();

  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<string>("BANKING");
  const shippingInfos = useAppStore((state) => state.shippingInfos);
  const [deliveryPace, setDeliveryPace] = useState("STANDARD");

  const { itemsToCheckout } = useLocalSearchParams();

  const {
    data: shippingData,
    isLoading: isLoadingShipping,
    isError: isErrorShipping,
    refetch: refetchShipping,
  } = useShippingInfos({ token: token ? token : "", enabled: true });

  // Kiểm tra và giải mã
  let cartDetails: CartType["cartDetails"] = [];

  //giải json data và gán vào cartDetail
  if (typeof itemsToCheckout === "string") {
    try {
      // Nếu itemsToCheckout là chuỗi, parse nó thành một mảng
      cartDetails = JSON.parse(itemsToCheckout);
    } catch (error) {
      console.error("Lỗi giải mã itemsToCheckout:", error);
    }
  } else if (Array.isArray(itemsToCheckout)) {
    try {
      // Nếu là mảng chuỗi, chúng ta cần parse từng item
      cartDetails = itemsToCheckout.map((item) => JSON.parse(item));
    } catch (error) {
      console.error("Lỗi giải mã itemsToCheckout:", error);
    }
  }

  // Kiểm tra xem có ít nhất một phần tử có productId khác null không
  useEffect(() => {
    const hasProduct = cartDetails.some((item) => item.productId !== null);

    setIsProduct(hasProduct);
    if (!hasProduct) {
      setDeliveryPace("NONESHIP");
    }
  }, [cartDetails]); // Chạy khi cartDetails thay đổi

  const total = cartDetails.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity * (1 - item.discount),
    0
  );

  const [totalToPay, setTotalToPay] = useState(total);
  const createShippingInfos = useCreateShippingInfos();
  const deleteAddress = useDeleteShippingInfos();
  const [modalVisible, setModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [chosenShippingAddress, setChosenShippingAddress] = useState(
    shippingInfos && shippingInfos.data.length > 0
      ? shippingInfos.data[0]
      : null
  );

  useEffect(() => {
    let extraFee = 0;
    if (deliveryPace === "STANDARD") {
      extraFee = 26000;
    } else if (deliveryPace === "EXPEDITED") {
      extraFee = chosenShippingAddress?.deliAmount || 0;
    } else {
      extraFee = 0;
    }
    console.log("fee ", extraFee);
    setTotalToPay(total + extraFee);
  }, [deliveryPace, total, chosenShippingAddress]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    tag: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    tag: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm kiểm tra regex
  const validateFields = () => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^0\d{9}$/;
    const tagRegex = /^[A-Z]+$/;

    const newErrors = {
      name: !newAddress.name.match(nameRegex)
        ? "Tên chỉ chứa ký tự chữ cái và không được để trống"
        : "",
      phone: !newAddress.phone.match(phoneRegex)
        ? "Số điện thoại không hợp lệ"
        : "",
      address:
        newAddress.address.trim() === "" ? "Địa chỉ không được để trống" : "",
      tag: !newAddress.tag.match(tagRegex)
        ? "Tag chỉ được chứa các ký tự in hoa"
        : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleAddNewAddress = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);
    try {
      const result = await createShippingInfos.mutateAsync({
        body: newAddress,
        token,
      });
      if (result) {
        // xóa bớt 1 đoạn r cần thì cop lại bên mobile
        setAddAddressModalVisible(false);
        setNewAddress({ name: "", phone: "", address: "", tag: "" }); // Reset form
        refetchShipping();
      }
    } catch (error) {
      console.error("Error creating address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSelect = (address: AShippingAddressType) => {
    setChosenShippingAddress(address);
    setModalVisible(false);
  };

  const handlePayment = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      const arrayCartDetailIds = cartDetails.map((item) => item.id);
      const bodySchema = z.object({
        arrayCartDetailIds: z.array(z.string()),
        deliveryInfoId: z.string(),
        //thêm 1 cái delivery method đây nữa
        deliMethod: z.string(),
        payMethod: z.string(),
      });

      const body = {
        arrayCartDetailIds: arrayCartDetailIds, // Mảng ID từ cartDetails
        deliveryInfoId: chosenShippingAddress?.id, // ID của địa chỉ giao hàng
        //thêm cái delivery method đây nữa
        deliMethod: deliveryPace,
        payMethod: paymentMethod,
      };

      // Validate body với schema
      const parsedBody = bodySchema.parse(body);

      const res = await payment.mutateAsync({ body: parsedBody, token });
      if (res) {
        //đây trả về 1 url để qua payment nó mở webview
        if (res.data.paymentLink != null && res.data.paymentLink.length > 0) {
          const encodedUrl = encodeURIComponent(res.data.paymentLink);
          router.push(`/(root)/cart/payment-screen?paymentUrl=${encodedUrl}`);
        } else {
          router.push(`/(root)/orders/orders?message=true`);
        }
      }
      setTimeout(() => setIsProcessing(false), 1000);
    } catch (error) {
      console.log("Lỗi ở khi tạo đơn hàng ", error);
    }
  };

  const removeSelectedAddress = async (address: AShippingAddressType) => {
    console.log(token);
    try {
      console.log(address.id);
      console.log(address.isDeleted);
      if (isProcessing) return;
      setIsProcessing(true);
      const res = deleteAddress.mutateAsync({ addressId: address.id, token });
      refetchShipping();
    } catch (error) {
      Alert.alert("Lỗi", `Lỗi khi xóa địa chỉ ${error}`);
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 400);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Thanh toán"
        showMoreOptions={false}
        returnTab={"/(root)/cart/cart"}
      />
      <ScrollView>
        {/* Order Summary */}
        <View className="p-4 border-b border-gray-100">
          <Text className="font-bold text-lg mb-3">Thông tin đơn hàng</Text>
          {cartDetails.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center p-4 mt-1 rounded-lg border-b border-gray-100 ${
                index % 2 === 0 ? "bg-pink-200" : "bg-gray-200"
              }`}
            >
              <Image
                source={{ uri: item.objectImageUrl }}
                className="w-16 h-16 rounded-lg"
              />
              <View className="flex-1 ml-3">
                <Text className="font-bold" numberOfLines={1}>
                  {item.objectName}
                </Text>

                {/* mô tả */}
                <View className="flex-row items-center mt-1">
                  <MaterialIcons
                    name="info-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text className="text-gray-600 ml-1" numberOfLines={1}>
                    {item.objectDescription}
                  </Text>
                </View>

                {/* đơn giá */}
                <View className="flex-row items-center mt-1">
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1" numberOfLines={2}>
                    {item.unitPrice.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>

                {/* giảm giá */}
                <View className="flex-row items-center mt-1">
                  <Foundation name="burst-sale" size={21} color="#6B7280" />
                  <Text className="text-gray-600 ml-1" numberOfLines={2}>
                    {item.discount * 100}%
                  </Text>
                </View>

                {/* tổng tiền 1 item */}
                <View>
                  {item.discount == 0 ? (
                    <Text className="text-blue-500 font-bold mt-2">
                      Tổng:{" "}
                      {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}{" "}
                      ₫
                    </Text>
                  ) : (
                    <View className="flex-row items-center space-x-2 mt-2">
                      <Text className="text-gray-500 font-bold mt-2 line-through">
                        {(item.unitPrice * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                      </Text>
                      <Text className="text-blue-500 font-bold mt-2">
                        {" "}
                        Tổng:{" "}
                        {(
                          item.unitPrice *
                          item.quantity *
                          (1 - item.discount)
                        ).toLocaleString("vi-VN")}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Infos */}
        {/* mới chỉ có thêm thôi chứ chưa có xóa address */}
        {isProduct ? (
          <View className="p-4">
            <Text className="font-bold text-lg mb-3">Địa chỉ giao hàng</Text>
            <Pressable
              className="border border-gray-400 rounded-xl p-4 flex-row items-center"
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome6 name="address-card" size={24} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-600 font-bold">
                  Địa chỉ: {chosenShippingAddress?.address}
                </Text>
                <Text className="text-gray-600">
                  Số điện thoại: {chosenShippingAddress?.phone}
                </Text>
                <Text className="text-gray-600">
                  Người nhận: {chosenShippingAddress?.name}
                </Text>
                <View className="self-start bg-cyan-100 p-1 mt-1 rounded">
                  <Text className="text-blue-600 font-semibold">
                    {chosenShippingAddress?.tag}
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </Pressable>
          </View>
        ) : (
          <></>
        )}

        {isProduct ? (
          <View className="p-4">
            <Text className="font-bold text-lg mb-3">Tốc độ giao hàng</Text>
            <RadioButton.Group
              onValueChange={(value) => setDeliveryPace(value)}
              value={deliveryPace}
            >
              <View className="border rounded-xl border-gray-400">
                <View className="flex-row items-center ml-2 mt-3">
                  <RadioButton value="STANDARD" />
                  <MaterialCommunityIcons
                    name="truck-outline"
                    size={24}
                    color="#6B7280"
                  />
                  <Text> Tiêu chuẩn: 26.000 ₫</Text>
                </View>
                <View className="flex-row items-center ml-2 mb-3">
                  <RadioButton value="EXPEDITED" />
                  <MaterialCommunityIcons
                    name="truck-fast-outline"
                    size={24}
                    color="#6B7280"
                  />
                  <Text>
                    {" "}
                    Hỏa tốc:{" "}
                    {chosenShippingAddress?.deliAmount?.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        ) : (
          <></>
        )}

        {/* Payment Method */}
        {/* tắt bật để COD hoặc QR */}
        <View className="p-4">
          <Text className="font-bold text-lg mb-3">Phương thức thanh toán</Text>
          <Pressable
            className={`border ${
              paymentMethod == "BANKING" ? "bg-blue-100" : "border-white"
            } border-gray-400 rounded-xl p-4 flex-row items-center`}
            onPress={() => {
              setPaymentMethod("BANKING");
            }}
          >
            <MaterialIcons name="qr-code" size={24} color="#374151" />
            <View className="ml-3 flex-1">
              <Text className="font-medium">Chuyển khoản qua QR</Text>
              <Text className="text-gray-500">Quét mã QR để thanh toán</Text>
            </View>
          </Pressable>
          {isProduct ? (
            <View>
              <Pressable
                className={`border ${
                  paymentMethod == "COD" ? "bg-blue-100" : "border-white"
                } border-gray-400 rounded-xl p-4 flex-row items-center mt-2`}
                onPress={() => {
                  setPaymentMethod("COD");
                }}
              >
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={24}
                  color="#374151"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-medium">COD</Text>
                  <Text className="text-gray-500">
                    Thanh toán khi nhận hàng
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Address Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View className="mx-3">
            <View className="bg-white p-5 rounded-lg">
              <ScrollView
                className="max-h-72"
                showsVerticalScrollIndicator={false}
              >
                {shippingInfos?.data.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    className={`p-2 border-2 ${
                      chosenShippingAddress?.id == address.id
                        ? "bg-gray-200"
                        : "bg-white"
                    } border-gray-300 rounded-lg my-1`}
                    onPress={() => handleAddressSelect(address)}
                  >
                    <Text className="text-gray-600 font-bold p-1">
                      {address.address}
                    </Text>
                    <Text className="text-gray-600 p-1">
                      Số điện thoại: {address.phone}
                    </Text>
                    <Text className="text-gray-600 p-1">
                      Người nhận: {address.name}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <View className="p-1 flex-row items-center">
                        <Text className="text-gray-600">Tag địa chỉ: </Text>
                        <View className="self-start bg-cyan-200 p-1 rounded-lg">
                          <Text className="text-gray-600">{address.tag}</Text>
                        </View>
                      </View>
                      {shippingInfos.data.length >= 2 ? (
                        <Pressable
                          onPress={() => removeSelectedAddress(address)}
                          hitSlop={8}
                        >
                          <MaterialIcons
                            name={"remove-circle-outline"}
                            size={24}
                            color={"gray"}
                          />
                        </Pressable>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                className="p-2 items-center mt-2"
                onPress={() => setAddAddressModalVisible(true)}
              >
                <Text>Thêm địa chỉ mới</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Add Address Modal */}
      <Portal>
        <Modal
          visible={addAddressModalVisible}
          onDismiss={() => setAddAddressModalVisible(false)}
        >
          <View className="bg-slate-100 p-5 rounded-lg mx-4">
            <IconButton
              icon="close"
              className="self-end"
              onPress={() => {
                setAddAddressModalVisible(false);
                setErrors({ name: "", phone: "", address: "", tag: "" });
              }}
            />
            <Text className="text-xl font-bold mb-2">Thêm địa chỉ mới</Text>
            <TextInput
              className="border-1 border-gray-300 rounded-md p-2 mb-2"
              placeholder="Tên người nhận"
              value={newAddress.name}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, name: text }))
              }
            />
            <Text className="text-red-600 text-xs mb-2">{errors.name}</Text>
            <TextInput
              className="border-1 border-gray-300 rounded-md p-2 mb-2"
              placeholder="Số điện thoại: 0xxx-xxx-xxx"
              keyboardType="phone-pad"
              value={newAddress.phone}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, phone: text }))
              }
            />
            <Text className="text-red-600 text-xs mb-2">{errors.phone}</Text>
            <TextInput
              className="border-1 border-gray-300 rounded-md p-2 mb-2"
              placeholder="Địa chỉ"
              value={newAddress.address}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, address: text }))
              }
            />
            <Text className="text-red-600 text-xs mb-2">{errors.address}</Text>
            <TextInput
              className="border-1 border-gray-300 rounded-md p-2 mb-2"
              placeholder="Địa chỉ viết tắt"
              value={newAddress.tag}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, tag: text }))
              }
            />
            <Text className="text-red-600 text-xs mb-2">{errors.tag}</Text>
            <Button
              mode="contained"
              onPress={handleAddNewAddress}
              disabled={isSubmitting}
              className="self-end"
            >
              Tạo
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Bottom Bar */}
      <View className="p-4 border-t border-gray-100">
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-600">
            Tổng <Text className="italic">(đơn và vận chuyển)</Text>
          </Text>
          <Text className="font-bold text-lg">
            {totalToPay.toLocaleString("vi-VN")} ₫
          </Text>
        </View>
        <Pressable
          className={`${
            isProcessing ? "bg-gray-500" : "bg-blue-500"
          } p-4 rounded-xl items-center`}
          onPress={handlePayment}
          // chỗ này giờ redirect sao đây này
        >
          <Text className="text-white font-bold">Xác nhận thanh toán</Text>
        </Pressable>
      </View>
    </View>
  );
}
