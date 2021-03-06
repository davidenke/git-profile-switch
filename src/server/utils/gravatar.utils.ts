import md5 from 'md5';
import fetch from 'node-fetch';
import { cropCircle } from './image.utils';

// https://de.gravatar.com/site/implement/hash/
export const hashEmail = (email: string): string => {
  return md5(email.trim().toLowerCase());
};

export const prepareGravatarUrl = (email?: string, size = 28, fallback = ''): string => {
  if (email === undefined) {
    return fallback;
  }
  return `https://www.gravatar.com/avatar/${ hashEmail(email) }?s=${ size }&d=404`;
};

// https://github.com/node-fetch/node-fetch/issues/375#issuecomment-385751664
export const downloadGravatarImage = async (email: string, size: number): Promise<Buffer> => {
    // download
    const url = prepareGravatarUrl(email, size);
    const response = await fetch(url);
    const buffer = await response.buffer();
    if (response.status >= 400) {
      return Promise.reject();
    }

    // crop
    return cropCircle(buffer, response.headers.get('content-type'));
};
