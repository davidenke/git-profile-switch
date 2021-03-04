import md5 from 'md5';

// https://de.gravatar.com/site/implement/hash/
export const hashEmail = (email: string): string => {
  return md5(email.trim().toLowerCase());
};

export const prepareGravatarUrl = (email?: string, size = 28, fallback = ''): string => {
  if (email === undefined) {
    return fallback;
  }
  return `https://www.gravatar.com/avatar/${ hashEmail(email) }?s=${ size }`;
};
