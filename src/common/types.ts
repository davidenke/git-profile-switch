export type Theme = 'dark' | 'light';

export type Settings = {
  general: {
    // https://www.npmjs.com/package/@types/auto-launch
    // https://www.npmjs.com/package/auto-launch
    autoStart: boolean;
  };
  git: {
    editor?: string;
  };
  theme: {
    overrideSystem: boolean;
    prefer?: Theme;
  }
};

export type Config = {
  [group: string]: {
    [key: string]: string;
  };
}

export type Profile = {
  user: {
    name: string;
    email: string;
    signingKey?: string;
  };
  core?: {
    editor?: string;
    excludesfile?: string;
  };
  init?: {
    defaultBranch?: string;
  };
};

export type EventWithTarget<T extends Element, E = Event> = E & { target: T; };

export type RequestType = 'get' | 'set';

export type API = {
  get(subject: Subject.Ping): Promise<number>;

  subscribe(this, subject: Subject.AllProfiles, handler: (profiles: Profile[]) => void): () => void;
  get(subject: Subject.AllProfiles): Promise<Profile[]>;

  subscribe(this, subject: Subject.ProfileImage, handler: (image: string) => void): () => void;
  get(subject: Subject.ProfileImage, payload?: { email?: string; size?: number; }): Promise<string>;

  subscribe(this, subject: Subject.CurrentProfile, handler: (profile: Profile) => void): () => void;
  get(subject: Subject.CurrentProfile): Promise<Profile>;
  set(subject: Subject.CurrentProfile, payload: Profile): Promise<Profile>;

  subscribe(this, subject: Subject.Settings, handler: (settings: Settings) => void): () => void;
  get(subject: Subject.Settings): Promise<Settings>;
  set(subject: Subject.Settings, payload: Settings): Promise<Settings>;

  subscribe(this, subject: Subject.ShowSettings, handler: (visible: boolean) => void): () => void;
  get(subject: Subject.ShowSettings): Promise<boolean>;
  set(subject: Subject.ShowSettings, payload: boolean): Promise<boolean>;
}

export enum Subject {
  CurrentProfile = 'current-profile',
  ProfileImage = 'profile-image',
  AllProfiles = 'all-profiles',
  Settings = 'settings',
  ShowSettings = 'show-settings',
  Ping = 'ping',
}
