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

export type API = {
  get(subject: Subject.Ping): Promise<number>;

  subscribe(this, subject: Subject.AllProfiles, handler: (profiles: Profile[]) => void): () => void;
  get(subject: Subject.AllProfiles): Promise<Profile[]>;

  subscribe(this, subject: Subject.ProfileImage, handler: (image: string) => void): () => void;
  get(subject: Subject.ProfileImage, payload?: { email?: string; size?: number; }): Promise<string>;

  subscribe(this, subject: Subject.CurrentProfile, handler: (profile: Profile) => void): () => void;
  get(subject: Subject.CurrentProfile): Promise<Profile>;
  set(subject: Subject.CurrentProfile, payload: Profile): Promise<void>;
}

export enum Subject {
  CurrentProfile = 'current-profile',
  ProfileImage = 'profile-image',
  AllProfiles = 'all-profiles',
  Ping = 'ping',
}
