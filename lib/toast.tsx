import { SuccessToast, ErrorToast, ToastProps } from 'react-native-toast-message';

const base = {
  style: { borderRadius: 14 },
  contentContainerStyle: { backgroundColor: '#131313', borderRadius: 10 },
  text1Style: { color: 'white' },
}

const toastConfig = {
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: 'lightgreen', ...base.style }}
      contentContainerStyle={{ ...base.contentContainerStyle }}
      text1Style={{ ...base.text1Style }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', ...base.style }}
      contentContainerStyle={{ ...base.contentContainerStyle }}
      text1Style={{ ...base.text1Style }}
    />
  ),
};

export const toastProps: ToastProps = {
  position: 'bottom',
  config: toastConfig,
}
