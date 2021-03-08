import { Config, Profile } from '../../common/types';

export const serializeConfig = (config: Config): string => {
  const groups = Object.keys(config);
  return groups
    .reduce((prepared, group) => {
      const keys = Object.keys(config[group]);
      return [
        ...prepared,
        `[${ group }]`,
        ...keys.map(key => `\t${ key } = ${ config[group][key] }`)
      ];
    }, [])
    .join('\n');
};

export const parseConfig = (buffer: Buffer): Config => {
  let group: string;
  return buffer
    .toString()
    .split(/\n|\r/)
    .filter(line => line.trim().length > 0)
    .reduce((config, line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('[')) {
        group = trimmed
          .substr(1, trimmed.length - 2)
          .trim();
        config[group] = {};
      } else {
        const [key, value] = trimmed.split('=');
        config[group][key.trim()] = value.trim();
      }
      return config;
    }, {} as Config);
};

export const updateConfig = (profile: Profile, buffer: Buffer): Config => {
  const config = parseConfig(buffer);
  Object
    .keys(profile)
    .forEach(group => {
      // add group if missing
      if (!(group in config)) {
        config[group] = {};
      }
      // update group
      config[group] = { ...config[group], ...profile[group]};
    });
  return config;
}
