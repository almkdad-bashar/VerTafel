import { Alert, Platform } from "react-native";

interface Option {
  text: string;
  style: "cancel" | "default" | "destructive";
  onPress: () => void;
}

const options: Option[] = [
  {
    text: "Cancel",
    style: "cancel",
    onPress: () => console.log("Cancel Pressed"),
  },
  {
    text: "OK",
    style: "default",
    onPress: () => console.log("OK Pressed"),
  }
];

const alertPolyfill = (
  title: string,
  description: string,
) => {
  const result = window.confirm(
    [title, description].filter(Boolean).join("\n")
  );

  if (result) {
    const confirmOption = options.find(({ style }) => style === "default");
    confirmOption && confirmOption.onPress();
  } else {
    const cancelOption = options.find(({ style }) => style === "cancel");
    cancelOption && cancelOption.onPress();
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
