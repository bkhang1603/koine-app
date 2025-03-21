import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";

export default function CreateEventScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("");

  const isValidTitle = title.length >= 10;
  const isValidDescription = description.length >= 30;
  const isValidDuration = !isNaN(parseFloat(duration)) && parseFloat(duration) > 0;
  const isValidStartAt = startAt.trim() !== "";
  const isFormValid = isValidTitle && isValidDescription && isValidDuration && isValidStartAt;

  const handleCreateEvent = () => {
    if (!isFormValid) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ và đúng định dạng dữ liệu!");
      return;
    }

    const eventData = {
      title,
      description,
      startAt,
      imageUrl,
      duration: parseFloat(duration) * 3600, // Đổi giờ thành giây
    };

    console.log("Dữ liệu gửi:", eventData);

    // Gọi API tạo sự kiện ở đây (fetch / axios)
    Alert.alert("Thành công", "Sự kiện đã được tạo!");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <HeaderWithBack
        title="Create Event"
        showMoreOptions={false}
        returnTab="/(expert)/(tabs)/event-list"
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Tạo sự kiện mới
      </Text>

      <Text>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề..."
        value={title}
        onChangeText={setTitle}
      />
      {!isValidTitle && title.length > 0 && <Text style={styles.error}>Title phải ít nhất 10 ký tự</Text>}

      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mô tả..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {!isValidDescription && description.length > 0 && (
        <Text style={styles.error}>Description phải ít nhất 30 ký tự</Text>
      )}

      <Text>Start At (ISO format):</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DDTHH:MM:SSZ"
        value={startAt}
        onChangeText={setStartAt}
      />
      {!isValidStartAt && startAt.length > 0 && <Text style={styles.error}>Vui lòng nhập ngày giờ hợp lệ</Text>}

      <Text>Image URL:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập URL hình ảnh..."
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Text>Duration (giờ, số thập phân):</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số giờ..."
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      {!isValidDuration && duration.length > 0 && <Text style={styles.error}>Vui lòng nhập số giờ hợp lệ</Text>}

      <Button title="Tạo sự kiện" onPress={handleCreateEvent} disabled={!isFormValid} />
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
