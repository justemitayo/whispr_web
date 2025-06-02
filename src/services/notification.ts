import { toast, ToastOptions, TypeOptions } from 'react-toastify';

const toastTypes: Record<Exclude<TypeOptions, 'default'>, (msg: string, opts?: ToastOptions) => void> = {
  info: toast.info,
  success: toast.success,
  warning: toast.warning,
  error: toast.error,
};

export const showNotification = ({
  title,
  message,
  type = 'info',
  options = {},
}: {
  title: string;
  message: string;
  type?: TypeOptions;
  options?: ToastOptions;
}) => {
  const notifyFn = toastTypes[type as Exclude<TypeOptions, 'default'>] ?? toast.info;
  notifyFn(`${title}: ${message}`, {
    position: 'top-right',
    autoClose: 4000,
    ...options,
  });
};
