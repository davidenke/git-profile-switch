import { Component, ComponentInterface, h, Host, State } from '@stencil/core';
import throttle from 'lodash-es/throttle';
import { Profile, Settings, Subject, Theme } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-app',
  styleUrl: 'menu-bar-app.scss',
  shadow: true,
})
export class MenuBarApp implements ComponentInterface {
  private readonly _subscriptions = new Set<() => void>();

  private readonly _avatarSize = 28;

  @State()
  private _isIdle = false;

  @State()
  private _isEditing = false;

  @State()
  private _settings: Settings;

  @State()
  private _currentProfileId?: string;

  @State()
  private _currentImage?: string;

  private get _currentProfile(): Profile {
    return this._settings.profiles[this._currentProfileId];
  }

  private async _updateSettings(settings: Settings) {
    this._isIdle = true;
    this._settings = await window.api.set(Subject.Settings, settings);
    this._isIdle = false;
  }

  readonly updateSettings = throttle(this._updateSettings, 500);

  async componentWillLoad() {
    // subscribe to subjects
    this._subscriptions.add(window.api.subscribe(Subject.ShowSettings, visible => (this._isEditing = visible)));
    this._subscriptions.add(window.api.subscribe(Subject.Settings, settings => (this._settings = settings)));
    this._subscriptions.add(
      window.api.subscribe(Subject.CurrentProfile, async profile => {
        this._currentProfileId = profile?.user?.email;
        this._currentImage = await window.api.get(Subject.ProfileImage, {
          email: profile?.user?.email,
          size: this._avatarSize * window.devicePixelRatio || 1,
        });
      }),
    );

    // request once
    const currentProfile = await window.api.get(Subject.CurrentProfile);
    this._currentProfileId = currentProfile.user.email;
    this._settings = await window.api.get(Subject.Settings);
  }

  disconnectedCallback() {
    this._subscriptions.forEach(unsubscribe => unsubscribe());
  }

  async selectProfile(email: string) {
    const profile = Object.values(this._settings.profiles).find(profile => profile?.user?.email === email);
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

  updateCurrentProfile(profile: Profile) {
    // remove existing
    delete this._settings.profiles[this._currentProfileId];
    // add modified
    this._currentProfileId = profile.user.email;
    this._settings.profiles[this._currentProfileId] = profile;
    // submit changes
    this.updateSettings(this._settings);
  }

  openSettings() {
    window.api.get(Subject.OpenSettings);
  }

  render() {
    return (
      <Host>
        <gps-menu-bar-info avatarSize={this._avatarSize} profile={this._currentProfile} image={this._currentImage}>
          <gps-menu-bar-icon-settings onClick={() => this.toggleSettings()} />
        </gps-menu-bar-info>
        <gps-menu-bar-switch
          currentProfileId={this._currentProfileId}
          disabled={false /*|| this._isEditing*/}
          items={Object.keys(this._settings.profiles)}
          onSwitch={({ detail }) => this.selectProfile(detail)}
        />
        <gps-menu-bar-profile profile={this._currentProfile} onUpdated={({ detail }) => this.updateCurrentProfile(detail)} />
        <gps-menu-bar-settings
          disabled={this._isIdle}
          settings={this._settings}
          onThemeSelected={({ detail }) => this.setTheme(detail)}
          onUpdated={({ detail }) => this.updateSettings(detail)}
          onOpen={() => this.openSettings()}
        />
      </Host>
    );
  }
}
