import type { WriteStream } from 'fs';
import fetch from 'node-fetch';
import md5 from 'md5';

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
export const downloadGravatarImage = async (email: string, size: number, stream: WriteStream): Promise<void> => {
  const url = prepareGravatarUrl(email, size);
  const res = await fetch(url);
  await new Promise((resolve, reject) => {
    if (res.status >= 400) {
      reject();
    }
    res.body.pipe(stream);
    res.body.on('error', reject);
    stream.on('finish', resolve);
  });
};
