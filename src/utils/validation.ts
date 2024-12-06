export const required = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
};

export const email = (value: string): string | undefined => {
  if (!value) return;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Invalid email address';
  }
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return;
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
};

export const url = (value: string): string | undefined => {
  if (!value) return;
  try {
    new URL(value);
  } catch {
    return 'Invalid URL';
  }
};

export const number = (value: string): string | undefined => {
  if (!value) return;
  if (isNaN(Number(value))) {
    return 'Must be a number';
  }
};

export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => 
  (value: any): string | undefined => 
    validators.reduce(
      (error: string | undefined, validator) => error || validator(value),
      undefined
    );
