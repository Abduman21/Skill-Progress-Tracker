import { isAxiosError } from 'axios';

export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string') return message;
    if (!error.response) return 'Unable to reach the server. Check your connection and try again.';
  }
  return 'The request failed. Please try again.';
}
