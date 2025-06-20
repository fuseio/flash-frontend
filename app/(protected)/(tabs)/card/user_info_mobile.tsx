import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Linking, Pressable, TextInput, View } from "react-native";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { path } from "@/constants/path";
import { KycStatus } from "@/lib/types";
import { useRouter } from "expo-router";
import { createKycLink } from "@/lib/api";

// Header Component
function UserInfoHeader() {
  return (
    <Text className="text-base text-white/70 text-center">
      We need some basic information to get started with your card activation
    </Text>
  );
}

// Form Component
interface UserInfoFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

function UserInfoForm({
  fullName,
  setFullName,
  email,
  setEmail,
}: UserInfoFormProps) {
  return (
    <View className="space-y-6 mb-8">
      <View>
        <Text className="text-sm font-medium text-white/80 mb-2">
          Full Name
        </Text>
        <TextInput
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          className="h-14 px-6 rounded-xl border border-border text-lg text-foreground font-semibold placeholder:text-muted-foreground bg-background"
          autoCapitalize="words"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-white/80 mb-2 mt-6">
          Email Address
        </Text>
        <TextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="h-14 px-6 rounded-xl border border-border text-lg text-foreground font-semibold placeholder:text-muted-foreground bg-background"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>
    </View>
  );
}

// Footer Component
interface UserInfoFooterProps {
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  onContinue: () => void;
  isFormValid: boolean;
  isLoading: boolean;
}

function UserInfoFooter({
  agreedToTerms,
  setAgreedToTerms,
  onContinue,
  isFormValid,
  isLoading,
}: UserInfoFooterProps) {
  return (
    <View className="space-y-6">
      <View className="flex-row items-start justify-center">
        <Pressable
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          className="mr-3 mt-0.5"
        >
          <View
            className={`w-6 h-6 rounded border-2 ${
              agreedToTerms
                ? "bg-[#94F27F] border-[#94F27F]"
                : "border-white/50"
            } items-center justify-center`}
          >
            {agreedToTerms && (
              <Text className="text-xs text-black font-bold">✓</Text>
            )}
          </View>
        </Pressable>

        <View className="flex-1">
          <View className="text-xs text-white/50 leading-4 flex-row flex-wrap">
            <Text className="text-xs text-white/50">
              This application uses Bridge to securely connect accounts and move
              funds. By clicking continue, you agree to Bridge{"'"}s{" "}
            </Text>
            <Pressable
              onPress={() => Linking.openURL("https://bridge.xyz/legal")}
            >
              <Text className="text-xs text-[#94F27F] underline">
                Terms of Service
              </Text>
            </Pressable>
            <Text className="text-xs text-white/50"> and </Text>
            <Pressable
              onPress={() => Linking.openURL("https://bridge.xyz/legal")}
            >
              <Text className="text-xs text-[#94F27F] underline">
                Privacy Policy
              </Text>
            </Pressable>
            <Text className="text-xs text-white/50">.</Text>
          </View>
        </View>
      </View>

      <Button
        className="h-14 rounded-xl mt-8"
        onPress={onContinue}
        disabled={!isFormValid || isLoading}
      >
        <Text className="text-lg font-bold text-black">
          {isLoading ? "Please wait..." : "Continue"}
        </Text>
      </Button>
    </View>
  );
}

// Main Component
export default function UserInfoMobile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();

  const emailSchema = z.string().email();

  const validateEmail = (email: string) => {
    return emailSchema.safeParse(email).success;
  };

  const isFormValid = () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    return (
      !!trimmedFullName &&
      !!trimmedEmail &&
      validateEmail(trimmedEmail) &&
      agreedToTerms
    );
  };

  const getRedirectUrl = () => {
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
    return `${baseUrl}${path.CARD_ACTIVATE_MOBILE}?kycStatus=${KycStatus.UNDER_REVIEW}`;
  };

  const handleContinue = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    const redirectUrl = getRedirectUrl();

    console.log("redirectUrl", redirectUrl);

    const kycLink = await createKycLink(
      fullName.trim(),
      email.trim(),
      redirectUrl
    );

    setIsLoading(false);

    // const kycLink =
    //   "https://bridge.withpersona.com/verify?fields%5Bdeveloper_id%5D=b1ea9873-da91-4d8a-a0e5-dc89bda66e70&fields%5Bemail_address%5D=jasonmendex%40gmail.com&fields%5Biqt_token%5D=46f7565fe2ba42843b957cec6d783e48f85dff6d6ea56cf5753634b09a3214e83bpmDX&inquiry-template-id=itmpl_NtHYpb9AbEYCPxGo5iRbc9d2&reference-id=e2822ef6-ef0e-45b4-9ca9-56be84770b27";

    console.log("kycLink", kycLink);

    WebBrowser.openBrowserAsync(kycLink.link, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: "#94F27F",
      toolbarColor: "#94F27F",
      showTitle: true,
      enableBarCollapsing: true,
    });
  };

  return (
    <View className="flex-1 bg-background px-6 pt-4">
      <View className="flex-1 justify-evenly">
        <UserInfoHeader />

        <UserInfoForm
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
        />

        <UserInfoFooter
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          onContinue={handleContinue}
          isFormValid={isFormValid()}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
