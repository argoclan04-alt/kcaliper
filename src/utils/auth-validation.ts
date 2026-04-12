/**
 * Shared authentication validation utilities for Kcaliper.ai
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'none';

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'none';
  if (password.length < 6) return 'weak';
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak': return 'bg-red-500';
    case 'fair': return 'bg-yellow-500';
    case 'good': return 'bg-blue-500';
    case 'strong': return 'bg-emerald-500';
    default: return 'bg-white/10';
  }
}

export function getStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak': return 'Débil';
    case 'fair': return 'Media';
    case 'good': return 'Buena';
    case 'strong': return 'Excelente';
    default: return '';
  }
}
