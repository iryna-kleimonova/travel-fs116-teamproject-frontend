'use client';

import styles from './Loader.module.css';

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return <span className={`${styles.loader} ${className || ''}`}></span>;
}
