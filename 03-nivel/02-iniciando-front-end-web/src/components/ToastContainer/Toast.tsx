import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { useToast, ToastMessage } from '../../hooks/toast';
import { ToastContainer } from './styles';

interface ToastContainerProps {
  toast: ToastMessage;
  style: Record<string, unknown>;
}

const Toast: React.FC<ToastContainerProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, toast.id]);

  const icons = {
    info: <FiInfo size={24} />,
    error: <FiAlertCircle size={24} />,
    success: <FiCheckCircle size={24} />,
  };

  return (
    <ToastContainer
      type={toast.type}
      hasdescription={Number(!!toast.description)}
      style={style}
    >
      {icons[toast.type || 'info']}

      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>

      <button
        type="button"
        onClick={() => {
          removeToast(toast.id);
        }}
      >
        <FiXCircle size={18} />
      </button>
    </ToastContainer>
  );
};

export default Toast;
