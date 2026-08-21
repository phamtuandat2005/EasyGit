import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'secondary', size = 'md', icon, fullWidth, className = '', ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      fullWidth ? styles.fullWidth : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} {...props}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
