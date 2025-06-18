import { TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";

interface SendAddressCardProps {
  toAddress: string;
  onChange: (value: string) => void;
}

const SendAddressCard = ({ toAddress, onChange }: SendAddressCardProps) => {
  return (
    <View className="flex flex-col gap-4 bg-card rounded-xl md:rounded-twice p-6 md:p-10">
      <Text className="text-lg font-medium">
        To
      </Text>
      <TextInput
        className="w-full text-primary font-semibold placeholder:text-muted-foreground web:focus:outline-none"
        value={toAddress}
        placeholder="Enter or select and address..."
        onChangeText={onChange}
      />
    </View>
  );
};

export default SendAddressCard;
