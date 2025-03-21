import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="cart/cart"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications/notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="courses/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="search/search"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="orders/orders" options={{ headerShown: false }} />

        <Stack.Screen name="product/product" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />

        <Stack.Screen
          name="certificates/certificates"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="achievements/achievements"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="blog/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="learn/course/[courseId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="learn/chapter/[chapterId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="learn/lesson/[lessonId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cart/checkout" options={{ headerShown: false }} />
        <Stack.Screen
          name="cart/payment-screen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sub-accounts/sub-accounts"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sub-accounts/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sub-accounts/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="event/create-event"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="event/event-list"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="event/meeting" options={{ headerShown: false }} />
        <Stack.Screen
          name="custom-course/custom-course"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="purchased-courses/purchased-courses"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="learning-management/course-progress/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sub-accounts/edit/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile/edit-profile"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
