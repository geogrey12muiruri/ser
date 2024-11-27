import { View, Text, Pressable, Image, Platform } from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { fontSizes, windowHeight, windowWidth } from "@/theme/app.constant";

export default function AuthModal(): JSX.Element {
  return (
    <BlurView
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Pressable
      style={{
        width: windowWidth(420),
        height: windowHeight(250),
        marginHorizontal: windowWidth(50),
        backgroundColor: "#fff",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: fontSizes.FONT35,
          fontFamily: "Poppins_700Bold",
        }}
      >
        Join Medplus Today
      </Text>
      <Text
        style={{
          fontSize: fontSizes.FONT17,
          paddingTop: windowHeight(5),
          fontFamily: "Poppins_300Light",
        }}
      >
        simply get started
      </Text>
      <View
        style={{
          paddingVertical: windowHeight(10),
          flexDirection: "row",
          gap: windowWidth(20),
        }}
      >
        <Pressable>
          <Image
            source={require("@/assets/images/onboarding/google.png")}
            style={{
              width: windowWidth(40),
              height: windowHeight(40),
              resizeMode: "contain",
            }}
          />
        </Pressable>
        <Pressable >
          <Image
            source={require("@/assets/images/onboarding/github.png")}
            style={{
              width: windowWidth(40),
              height: windowHeight(40),
              resizeMode: "contain",
            }}
          />
        </Pressable>
        <Pressable>
          <Image
            source={require("@/assets/images/onboarding/apple.png")}
            style={{
              width: windowWidth(40),
              height: windowHeight(40),
              resizeMode: "contain",
            }}
          />
        </Pressable>
      </View>
    </Pressable>
  </BlurView>
  )
}