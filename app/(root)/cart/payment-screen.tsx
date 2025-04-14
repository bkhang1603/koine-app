import React, { useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview"; // Thêm kiểu WebViewNavigation
import { useRouter, useLocalSearchParams } from "expo-router";

const PaymentScreen = () => {
  const { paymentUrl } = useLocalSearchParams(); // Nhận URL thanh toán từ trang checkout
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Kiểm tra paymentUrl có phải là string không, tránh lỗi type
  const validUrl = typeof paymentUrl === "string" ? paymentUrl : "";
  // Xử lý điều hướng khi URL thay đổi
  const handleNavigation = (event: WebViewNavigation) => {
    if (event.url.includes("payment-success")) {
      router.replace("/(root)/orders/orders");
    } else if (event.url.includes("payment-failed")) {
      router.replace("/(root)/orders/orders");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <WebView
        source={{ uri: validUrl }}
        onLoadEnd={() => setLoading(false)} // Ẩn loading khi trang đã tải xong
        onNavigationStateChange={handleNavigation} // Bắt sự kiện URL thay đổi
      />
    </View>
  );
};

export default PaymentScreen;
