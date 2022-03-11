import { Component, ComponentInterface, h, State } from '@stencil/core';
import { Profile, Settings, Subject, Theme } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-app',
  styleUrl: 'menu-bar-app.scss',
  shadow: true
})
export class MenuBarApp implements ComponentInterface {

  private readonly _subscriptions = new Set<() => void>();

  private readonly _avatarSize = 28;

  @State()
  private _isIdle = false;

  @State()
  private _isEditing = false;

  @State()
  private _profiles: Profile[] = [];

  @State()
  private _settings: Settings;

  @State()
  private _currentProfile?: Profile;

  @State()
  private _currentImage?: string;

  async componentWillLoad() {
    // subscribe to subjects
    this._subscriptions.add(window.api.subscribe(Subject.AllProfiles, profiles => this._profiles = profiles));
    this._subscriptions.add(window.api.subscribe(Subject.ShowSettings, visible => this._isEditing = visible));
    this._subscriptions.add(window.api.subscribe(Subject.Settings, settings => this._settings = settings));
    this._subscriptions.add(window.api.subscribe(Subject.CurrentProfile, async profile => {
      this._currentProfile = profile;
      this._currentImage = await window.api.get(Subject.ProfileImage, {
        email: profile?.user?.email,
        size: this._avatarSize * window.devicePixelRatio || 1
      });
    }));

    // request once
    this._profiles = await window.api.get(Subject.AllProfiles);
    this._currentProfile = await window.api.get(Subject.CurrentProfile);
    this._settings = await window.api.get(Subject.Settings);
  }

  disconnectedCallback() {
    this._subscriptions.forEach(unsubscribe => unsubscribe());
  }

  async selectProfile(email: string) {
    const profile = this._profiles.find(profile => profile?.user?.email === email);
    if (profile !== undefined) {
      this._isIdle = true;
      await window.api.set(Subject.CurrentProfile, profile);
      this._isIdle = false;
    }
  }

  async toggleSettings() {
    this._isEditing = !this._isEditing;
    await window.api.set(Subject.ShowSettings, this._isEditing);
  }

  setTheme(theme: Theme) {
    document.body.setAttribute('theme', theme);
  }

  updateProfile({ email, name }: Profile['user']) {
    console.log(email, name)
  }

  async updateSettings(settings: Settings) {
    this._isIdle = true;
    this._settings = await window.api.set(Subject.Settings, settings);
    this._isIdle = false;
  }

  openSettings() {
    window.api.get(Subject.OpenSettings);
  }

  render() {
    return [
      <gps-menu-bar-info avatarSize={ this._avatarSize }
                         profile={ this._currentProfile }
                         image={ this._currentImage }
      >
        <gps-menu-bar-icon-settings onClick={ () => this.toggleSettings() }/>
      </gps-menu-bar-info>,
      <gps-menu-bar-switch current={ this._currentProfile?.user?.email }
                           disabled={ false /*this._isEditing*/ }
                           items={ this._profiles.map(({ user }) => user.email) }
                           onSwitch={ ({ detail }) => this.selectProfile(detail) }
      />,
      <gps-menu-bar-profile email={ this._currentProfile?.user?.email }
                            name={ this._currentProfile?.user?.name }
                            visible={ this._isEditing }
                            onUpdated={({ detail }) => this.updateProfile(detail)}
      />,
      <gps-menu-bar-settings disabled={ this._isIdle }
                             settings={ this._settings }
                             visible={ this._isEditing }
                             onThemeSelected={ ({ detail }) => this.setTheme(detail) }
                             onUpdated={ ({ detail }) => this.updateSettings(detail) }
                             onOpen={ () => this.openSettings() }
      />,
    ];
  }

}
