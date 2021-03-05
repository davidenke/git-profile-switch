import { Component, ComponentInterface, h, State } from '@stencil/core';
import { Profile, Subject } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-app',
  styleUrl: 'menu-bar-app.scss',
  shadow: true,
})
export class MenuBarApp implements ComponentInterface {

  private readonly _avatarSize = 28;

  @State()
  private _profiles: Profile[] = [];

  @State()
  private _currentProfile?: Profile;

  @State()
  private _currentImage?: string;

  async componentWillLoad() {
    // subscribe to subjects
    window.api.subscribe(Subject.AllProfiles, profiles => this._profiles = profiles);
    window.api.subscribe(Subject.CurrentProfile, async profile => {
      this._currentProfile = profile;
      this._currentImage = await window.api.get(Subject.ProfileImage, {
        email: profile?.user?.email,
        size: this._avatarSize * window.devicePixelRatio || 1,
      });
    });

    // request once
    this._profiles = await window.api.get(Subject.AllProfiles);
    this._currentProfile = await window.api.get(Subject.CurrentProfile);
  }

  onProfileSelected(email: string) {
    const profile = this._profiles.find(profile => profile?.user?.email === email);
    if (profile !== undefined) {
      window.api.set(Subject.CurrentProfile, profile);
    }
  }

  render() {
    return [
      <gps-menu-bar-info avatarSize={this._avatarSize}
                         profile={this._currentProfile}
                         image={this._currentImage}
      />,
      <gps-menu-bar-switch current={this._currentProfile?.user?.email}
                           items={this._profiles.map(({ user }) => user.email)}
                           onSwitch={({ detail }) => this.onProfileSelected(detail)}
      />,
    ];
  }

}
