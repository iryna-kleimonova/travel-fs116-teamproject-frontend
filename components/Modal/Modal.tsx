'use client';

import { useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  message?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen?: boolean;
}

export default function Modal({
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isOpen = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={handleCancel}
          aria-label="Закрити"
          type="button"
        >
          <Icon name="icon-close" className={styles.closeIcon} />
        </button>

        <h2 className={styles.title}>{title}</h2>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.buttons}>
          <button
            className={styles.cancelButton}
            onClick={handleCancel}
            type="button"
          >
            {cancelButtonText}
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            type="button"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

