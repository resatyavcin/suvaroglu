'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

interface FormSuccessProps {
  message?: string;
}

const FormError = ({ message }: FormSuccessProps) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      // Cleanup timer when component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;
  return (
    <div
      className="bg-emerald-500/15 p-3 rounded-md
                flex items-center gap-x-2 text-sm text-emerald-500"
    >
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
