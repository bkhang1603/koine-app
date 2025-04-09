import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import {
  useChapterQuestion,
  useUpdateChapterScoreMutation,
} from "@/queries/useCourse";
import { router, useLocalSearchParams } from "expo-router";
import {
  GetChapterQuestionResType,
  getChapterQuestionResType,
} from "@/schema/course-schema";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function QuestionScreen() {
  const { chapterId, courseId } = useLocalSearchParams<{
    chapterId: string;
    courseId: string;
  }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [isSubmit, setSubmit] = useState(false);
  const [hasResult, setHasResult] = useState<number | null>(null);

  const { data, isError, error, isLoading } = useChapterQuestion({
    chapterId,
    token,
  }) as {
    data?: GetChapterQuestionResType;
    isError: boolean;
    error: any;
    isLoading: boolean;
  };

  const updateScore = useUpdateChapterScoreMutation(courseId, chapterId);

  if (isError) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title={"Bài kiểm tra chương"}
          returnTab={`/(root)/learn/chapter/${chapterId}`}
          showMoreOptions={false}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={64} color="#9CA3AF" />
          <Text className="text-red-500 text-lg mt-4 text-center">
            Lỗi khi tải câu hỏi {error}
          </Text>
        </View>
      </View>
    );
  }

  let questionData: GetChapterQuestionResType["data"]["questions"] = [];
  if (data && data.data.questions) {
    if (data.data.questions.length == 0) {
      console.log("No courses found in coursesData");
    } else {
      const parsedResult = getChapterQuestionResType.safeParse(data);
      if (parsedResult.success) {
        questionData = parsedResult.data.data.questions;
      } else {
        console.error("Course validation errors:", parsedResult.error.errors);
      }
    }
  }
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [timer, setTimer] = useState<number>(10 * 60);

  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string[];
  }>({});
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data?.questions) {
      const correctOptions =
        data.data.questions.flatMap((question) =>
          question.questionOptions
            .filter((option) => option.isCorrect)
            .map((option) => option.id)
        ) || [];
      setCorrectAnswers(correctOptions);
    }
  }, [data]); // Chạy lại mỗi khi data thay đổi

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (timer == 0) {
      calculateScore();
    }

    return () => clearInterval(timerRef.current!);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleAnswerSelect = (questionIndex: number, optionId: string) => {
    setSelectedAnswers((prev) => {
      const currentAnswers = prev[questionIndex] || [];
      const numCorrect = questionData[questionIndex].numCorrect;

      if (currentAnswers.includes(optionId)) {
        return {
          ...prev,
          [questionIndex]: currentAnswers.filter((id) => id !== optionId),
        };
      }

      if (currentAnswers.length < numCorrect) {
        return {
          ...prev,
          [questionIndex]: [...currentAnswers, optionId],
        };
      }

      return {
        ...prev,
        [questionIndex]: [...currentAnswers.slice(1), optionId],
      };
    });
  };

  const calculateScore = async () => {
    if (isSubmit) return;
    setSubmit(true);
    clearInterval(timerRef.current!);

    let totalCorrectAns = 0;
    let totalCorrect = 0;

    questionData.forEach((question, index) => {
      const selectedOptions = selectedAnswers[index] || [];
      const correctOptions = correctAnswers.filter((id) =>
        question.questionOptions.some(
          (option) => option.id === id && option.isCorrect
        )
      );

      totalCorrect += correctOptions.length;

      selectedOptions.forEach((optionId) => {
        if (correctOptions.includes(optionId)) {
          totalCorrectAns++;
        }
      });
    });

    const finalScore =
      totalCorrect > 0
        ? Math.max(
            0,
            parseFloat(((totalCorrectAns / totalCorrect) * 100).toFixed(2))
          )
        : 0;
    console.log("final score ", finalScore);
    await handleSubmit(finalScore);
  };

  const handleSubmit = async (finalScore: number) => {
    try {
      if (isSubmit) return;
      setSubmit(true);

      await updateScore.mutateAsync({
        body: { chapterId, score: finalScore },
        token,
      });
      setHasResult(finalScore);
      setSubmit(false);
      Alert.alert(
        `Kết quả lần thi thứ ${data?.data.attempt}`,
        `Điểm số của bạn: ${finalScore} điểm\n${
          finalScore >= 70
            ? "Bạn đã vượt qua bài kiểm tra"
            : "Bạn đã trượt bài kiểm tra"
        }`,
        [
          {
            text: "Tiếp theo",
            onPress: () => {
              router.push({
                pathname: "/(root)/learn/chapter/[chapterId]",
                params: {
                  chapterId: chapterId,
                  courseId: courseId,
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.log("Error when submit quiz ", error);
    }
  };

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        {isLoading ? (
          <ActivityIndicatorScreen />
        ) : (
          <View>
            <View>
              <View className="flex-row justify-between items-end mr-2 mt-2">
                <Text className="text-black text-lg italic text-center ml-2">
                  Bạn cần 70 điểm để vượt qua
                </Text>
                <Text
                  className={`${
                    timer <= 2 * 60 ? "text-red-500" : "text-black"
                  } text-xl font-bold text-center border-2 w-24 rounded-md`}
                >
                  {formatTime(timer)}
                </Text>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
            >
              {questionData.map((item, index) => (
                <View key={index} className="p-2 my-2 w-full">
                  <Text className="text-lg font-bold">
                    Câu {index + 1}: {item.content}
                  </Text>
                  <Text className="text-md italic">
                    ({item.numCorrect} đáp án đúng)
                  </Text>
                  <View className="flex-row flex-wrap mt-2 justify-center">
                    {item.questionOptions.map((option, optionIndex) => (
                      <TouchableOpacity
                        key={option.id}
                        className={`m-1 px-4 py-2 rounded ${
                          selectedAnswers[index]?.includes(option.id)
                            ? "bg-cyan-500"
                            : "bg-gray-200"
                        } ${
                          item.questionOptions.length % 2 !== 0 &&
                          optionIndex === item.questionOptions.length - 1
                            ? "w-[94%]"
                            : "w-[46%]"
                        }`}
                        onPress={() => handleAnswerSelect(index, option.id)}
                      >
                        <Text>{option.optionData}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              <View className="flex items-center mt-4 pb-4">
                <Pressable
                  className={`p-2 w-[96%] mb-2 ${
                    hasResult != null || isSubmit
                      ? "bg-gray-400"
                      : "bg-cyan-400"
                  }  rounded-lg`}
                  onPress={() => calculateScore()}
                  disabled={hasResult != null ? true : false}
                >
                  <Text className="text-center font-bold text-lg">
                    {isSubmit ? "Đã nộp" : "Nộp bài"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
