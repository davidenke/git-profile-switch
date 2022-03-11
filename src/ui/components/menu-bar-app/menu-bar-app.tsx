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
  private _editingProfileId?: string;

  @State()
  private _settings: Settings;

  @State()
  private _currentProfileId?: string;

  @State()
  private _currentImage?: string;

  @State()
  private _profileAlreadyExisting = false;

  private get _isEditing(): boolean {
    return this._editingProfileId !== undefined;
  }

  private get _isNewProfile(): boolean {
    return !(this._editingProfileId in this._settings.profiles);
  }

  private async _updateSettings(settings: Settings) {
    this._isIdle = true;
    this._settings = await window.api.set(Subject.Settings, settings);
    this._isIdle = false;
  }

  readonly updateSettings = throttle(this._updateSettings, 500);

  async componentWillLoad() {
    // subscribe to subjects
    this._subscriptions.add(window.api.subscribe(Subject.ShowSettings, profileId => (this._editingProfileId = profileId)));
    this._subscriptions.add(window.api.subscribe(Subject.HideSettings, () => (this._editingProfileId = undefined)));
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

  async selectProfile(profileId: string) {
    const profile = Object.values(this._settings.profiles).find(profile => profile?.user?.email === profileId);
    if (profile !== undefined) {
      this._isIdle = true;
      await window.api.set(Subject.CurrentProfile, profile);
      this._isIdle = false;
    }
  }

  async toggleSettings() {
    if (this._isEditing) {
      this._editingProfileId = undefined;
      await window.api.set(Subject.HideSettings);
    } else {
      this._editingProfileId = this._currentProfileId;
      await window.api.set(Subject.ShowSettings, this._editingProfileId);
    }
  }

  setTheme(theme: Theme) {
    document.body.setAttribute('theme', theme);
  }

  async removeProfile(profile: Profile) {
    // remove the profile
    delete this._settings.profiles[profile.user.email];
    // check if we removed the selected one
    if (!(this._currentProfileId in this._settings.profiles)) {
      // so already select the new "first" one
      const [firstOrNone] = Object.keys(this._settings.profiles);
      if (firstOrNone !== undefined) {
        await this.selectProfile(firstOrNone);
      }
    }
    // store the altered settings
    this.updateSettings(this._settings);
    // close settings dialog
    await window.api.set(Subject.HideSettings);
  }

  // TODO: better split update and create
  async updateProfile(profile: Profile) {
    // do not alter existing profiles
    if (profile.user.email in this._settings.profiles && profile.user.email !== this._editingProfileId) {
      this._profileAlreadyExisting = true;
      return;
    }
    this._profileAlreadyExisting = false;
    // remove existing first
    delete this._settings.profiles[this._editingProfileId];
    // add updated contents "as new"
    this._editingProfileId = profile.user.email;
    this._settings.profiles[this._editingProfileId] = profile;
    // persist changes
    await this.updateSettings(this._settings);
    await this.selectProfile(profile.user.email);
    // close settings dialog
    window.api.set(Subject.HideSettings);
  }

  openSettings() {
    window.api.get(Subject.OpenSettings);
  }

  // prettier-ignore
  render() {
    return (
      <Host>
        <gps-menu-bar-info
          avatarSize={this._avatarSize}
          profile={this._settings.profiles[this._currentProfileId]} image={this._currentImage}
        >
          <gps-menu-bar-icon-settings onClick={() => this.toggleSettings()} />
        </gps-menu-bar-info>
        <gps-menu-bar-switch
          selectedProfileId={this._isEditing ? this._editingProfileId : this._currentProfileId}
          disabled={false || this._isEditing}
          items={Object.keys(this._settings.profiles)}
          onSwitch={({ detail }) => this.selectProfile(detail)}
        />
        {this._isEditing && [
          <gps-menu-bar-profile
            alreadyExisting={this._profileAlreadyExisting}
            isNew={this._isNewProfile}
            profile={this._settings.profiles[this._editingProfileId] || { user: { email: '' } }}
            onChanged={() => this._profileAlreadyExisting = false}
            onUpdate={({ detail }) => this.updateProfile(detail)}
            onRemove={({ detail }) => this.removeProfile(detail)}
          />,
          <gps-menu-bar-settings
            disabled={this._isIdle}
            settings={this._settings}
            onThemeSelected={({ detail }) => this.setTheme(detail)}
            onChanged={({ detail }) => this.updateSettings(detail)}
            onOpen={() => this.openSettings()}
          />,
        ]}
      </Host>
    );
  }
}
