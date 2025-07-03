import { zodResolver } from "@hookform/resolvers/zod"
import { Image } from 'expo-image'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, Platform, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from "zod"

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { validateInviteCode } from '@/lib/api'
import { InviteCodeStatus, Status } from '@/lib/types'
import { cn } from "@/lib/utils"
import { clearValidatedInvite, getValidatedInvite, storeValidatedInvite } from '@/store/useInviteStore'
import { useUserStore } from '@/store/useUserStore'

import InfoError from "@/assets/images/info-error"

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only use letters, numbers, underscores_, or hyphens-.")
    .refine(value => !value.includes(" "), "Username cannot contain spaces")
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { handleSignup, handleLogin, handleDummyLogin, user } = useUser()
  const { signupInfo, loginInfo, users } = useUserStore()
  const { code } = useLocalSearchParams<{ code: string }>()
  const router = useRouter()
  const [inviteCodeStatus, setInviteCodeStatus] = useState<InviteCodeStatus>(InviteCodeStatus.NONE)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = watch("username");

  // Check if user is already authenticated - if so, redirect to main app
  useEffect(() => {
    if (user) {
      router.replace('/');
      return;
    }

    // If user has existing accounts but none selected, show welcome screen
    if (users.length > 0 && !user) {
      router.replace('/welcome');
      return;
    }
  }, [user, users, router]);

  // Check invite code on component mount (only for unauthenticated users)
  useEffect(() => {
    // Skip invite validation if user is already authenticated
    if (user || users.length > 0) return;

    const checkInviteCode = async () => {
      // First check if we have a previously validated invite code
      const storedValidCode = getValidatedInvite();
      if (storedValidCode) {
        console.log('Found previously validated invite code');
        setInviteCodeStatus(InviteCodeStatus.VALID);
        return;
      }

      // If there's a code in URL, validate it
      if (code) {
        setInviteCodeStatus(InviteCodeStatus.CHECKING);
        try {
          const response = await validateInviteCode(code);
          console.log('Invite validation response:', response);
          // Check if the response has the expected structure (handle both wrapped and direct response)
          const result = response.data || response;

          if (result.valid) {
            setInviteCodeStatus(InviteCodeStatus.VALID);
            // Store the validated invite code for future use
            storeValidatedInvite(code);
          } else {
            setInviteCodeStatus(InviteCodeStatus.INVALID);
            setInviteError(result.message || 'Invalid or expired invite code');
          }
        } catch (error: any) {
          console.error('Invite code validation failed:', error);
          setInviteCodeStatus(InviteCodeStatus.INVALID);
          setInviteError('Invalid or expired invite code');
        }
      } else {
        setInviteCodeStatus(InviteCodeStatus.NONE);
      }
    };

    checkInviteCode();
  }, [code, user, users]);

  // Reset form after successful signup
  useEffect(() => {
    if (signupInfo.status === Status.SUCCESS) {
      reset();
      // Clear the stored invite code since user has successfully registered
      clearValidatedInvite();
    }
  }, [signupInfo.status, reset]);

  const handleSignupForm = (data: RegisterFormData) => {
    handleSignup(data.username)
  }

  const getSignupButtonText = () => {
    if (signupInfo.status === Status.PENDING) return 'Creating';
    if (!isValid || !watchedUsername) return 'Enter a username';
    return 'Create Account';
  };

  const getSignupErrorText = useMemo(() => {
    if (errors.username) return errors.username.message;
    if (signupInfo.status === Status.ERROR) return signupInfo.message || 'Error creating account';
    return '';
  }, [errors.username, signupInfo.status]);

  const isSignupDisabled = () => {
    return (
      signupInfo.status === Status.PENDING ||
      !isValid ||
      !watchedUsername
    );
  };

  // Show loading while checking invite code
  if (inviteCodeStatus === InviteCodeStatus.CHECKING) {
    return (
      <SafeAreaView className="bg-background text-foreground flex-1">
        <View className='flex-1 justify-center gap-10 px-4 py-8 w-full max-w-lg mx-auto'>
          <View className="flex-row items-center gap-5">
            <Image
              source={require("@/assets/images/solid-logo-4x.png")}
              alt="Solid logo"
              style={{ width: 37, height: 40 }}
              contentFit="contain"
            />
          </View>
          <View className="gap-8">
            <View className='flex-col gap-4 items-center'>
              <ActivityIndicator size="large" />
              <Text className='text-xl font-semibold'>Validating invitation...</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show invite-only message if no valid code
  if (inviteCodeStatus === InviteCodeStatus.NONE || inviteCodeStatus === InviteCodeStatus.INVALID) {
    return (
      <SafeAreaView className="bg-background text-foreground flex-1">
        <View className='flex-1 justify-center gap-10 px-4 py-8 w-full max-w-lg mx-auto'>
          <View className="flex-row items-center gap-5">
            <Image
              source={require("@/assets/images/solid-logo-4x.png")}
              alt="Solid logo"
              style={{ width: 37, height: 40 }}
              contentFit="contain"
            />
          </View>
          <View className="gap-8">
            <View className='flex-col gap-4'>
              <Text className='text-3xl font-semibold'>Registration by invitation only</Text>
              <Text className='text-muted-foreground max-w-[23rem]'>
                Solid is currently in private beta. To get an invite, please join our waitlist and we'll notify you when a spot becomes available.
              </Text>
              {inviteError && (
                <View className="flex-row items-center gap-2">
                  <InfoError />
                  <Text className="text-sm text-red-400">
                    {inviteError}
                  </Text>
                </View>
              )}
            </View>

            <View className='w-full flex-col gap-4'>
              <Link href="https://solid.xyz" asChild>
                <Button
                  variant="brand"
                  className="rounded-xl h-14"
                >
                  <Text className="text-lg font-semibold">
                    Join Waitlist
                  </Text>
                </Button>
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show nothing while checking authentication state
  if (user || users.length > 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <SafeAreaView className="bg-background text-foreground flex-1">
      <View className='flex-1 justify-center gap-10 px-4 py-8 w-full max-w-lg mx-auto'>
        <View className="flex-row items-center gap-5">
          <Image
            source={require("@/assets/images/solid-logo-4x.png")}
            alt="Solid logo"
            style={{ width: 37, height: 40 }}
            contentFit="contain"
          />
        </View>
        <View className="gap-8">
          <View className='flex-col gap-2'>
            <Text className='text-3xl font-semibold'>Welcome!</Text>
            <Text className='text-muted-foreground max-w-[23rem]'>
              Sign up with your email or connect a Web3 wallet to get started.
            </Text>
            {inviteCodeStatus === InviteCodeStatus.VALID && !code && (
              <View className="flex-row items-center gap-2 mt-2">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-sm text-green-600">
                  Invitation verified ✓
                </Text>
              </View>
            )}
          </View>

          <View className='w-full flex-col gap-8'>
            <View className={cn('flex-col gap-5', getSignupErrorText && 'gap-2')}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    id="username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Choose a username'
                    className={cn('h-14 px-6 rounded-xl border text-lg font-semibold placeholder:text-muted-foreground', errors.username ? 'border-red-500' : 'border-border')}
                  />
                )}
              />
              {getSignupErrorText ? (
                <View className="flex-row items-center gap-2">
                  <InfoError />
                  <Text className="text-sm text-red-400">
                    {getSignupErrorText}
                  </Text>
                </View>
              ) : null}
              <Button
                variant="brand"
                onPress={handleSubmit(handleSignupForm)}
                disabled={isSignupDisabled()}
                className="rounded-xl h-14"
              >
                <Text className="text-lg font-semibold">
                  {getSignupButtonText()}
                </Text>
                {signupInfo.status === Status.PENDING && (
                  <ActivityIndicator color="gray" />
                )}
              </Button>
            </View>

            <View className='flex-row items-center gap-4'>
              <View className='flex-1 h-px bg-border' />
              <Text className="text-center text-muted-foreground">OR</Text>
              <View className='flex-1 h-px bg-border' />
            </View>

            <Button
              onPress={handleLogin}
              disabled={loginInfo.status === Status.PENDING}
              variant="secondary"
              className="rounded-xl h-14"
            >
              <Text className="text-lg font-semibold">
                {loginInfo.status === Status.ERROR ?
                  loginInfo.message || 'Error logging in' :
                  loginInfo.status === Status.PENDING ?
                    'Logging in' :
                    'Login'
                }
              </Text>
              {loginInfo.status === Status.PENDING && (
                <ActivityIndicator color="gray" />
              )}
            </Button>

            {/* TODO: Remove when passkey works */}
            {Platform.OS !== 'web' && (
              <Button
                onPress={handleDummyLogin}
                variant="outline"
                className="rounded-xl h-14"
              >
                <Text className="text-lg font-semibold">
                  Dummy Login
                </Text>
              </Button>
            )}
          </View>
          <Text className="text-sm text-muted-foreground">
            Your Solid Account is secured with a passkey - a safer replacement for passwords.{' '}
            <Link href="https://solid-3.gitbook.io/solid.xyz-docs" target="_blank" className='underline hover:opacity-70'>Learn more</Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
