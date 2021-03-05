import { Component, ComponentInterface, h, State } from '@stencil/core';
import { Action, Profile } from '../../../common/types';

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
    // listen for current config changes
    window.api.receive(Action.ReceiveAllProfiles, profiles => this._profiles = profiles);
    window.api.receive(Action.ReceiveCurrentProfile, profile => {
      window.api.send(Action.GetProfileImage, {
        email: profile?.user?.email,
        size: this._avatarSize * window.devicePixelRatio || 1,
      });
      this._currentProfile = profile;
    });
    window.api.receive(Action.ReceiveProfileImage, image => {
      this._currentImage = image;
    });

    // request current config
    window.api.send(Action.GetAllProfiles);
    window.api.send(Action.GetCurrentProfile);
  }

  onProfileSelected(email: string) {
    const profile = this._profiles.find(profile => profile?.user?.email === email);
    if (profile !== undefined) {
      window.api.send(Action.SetCurrentProfile, profile);
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
