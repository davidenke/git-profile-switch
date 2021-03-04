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

export type API = {
  send(action: Action.GetAllProfiles): void;
  send(action: Action.GetCurrentProfile): void;
  send(action: Action.SetCurrentProfile, profile: Profile): void;
  send(action: Action, data?: any): void;

  receive(action: Action.ReceiveAllProfiles, func: (profiles: Profile[]) => void): void;
  receive(action: Action.ReceiveCurrentProfile, func: (profile: Profile) => void): void;
  receive(action: Action, func: (...args: any[]) => void): void;
}

export type EventWithTarget<T extends Element, E = Event> = E & { target: T; };

export enum Action {
  GetCurrentProfile = 'get-current-profile',
  ReceiveCurrentProfile = 'receive-current-profile',
  SetCurrentProfile = 'set-current-profile',

  GetAllProfiles = 'get-all-profiles',
  ReceiveAllProfiles = 'receive-all-profiles',
}
