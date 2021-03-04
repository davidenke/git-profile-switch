import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';
import { Profile } from '../../types';
import { prepareGravatarUrl } from '../../utils/gravatar.utils';

@Component({
  tag: 'gps-menu-bar-info',
  styleUrl: 'menu-bar-info.scss',
  shadow: true
})
export class MenuBarInfo implements ComponentInterface {

  @Prop()
  avatarSize = 28;

  @Prop()
  profile?: Profile;

  render() {
    return (
      <Host style={ { '--gps-avatar-size': `${ this.avatarSize }px` } }>
        <figure class="avatar">
          <img src={ prepareGravatarUrl(this.profile?.user?.email, 28, 'assets/icon/icon.png') }
               alt={ this.profile?.user?.name }
          />
        </figure>
        <div class="user">
          <span class="name">{ this.profile?.user?.name }</span>
          <span class="email">{ this.profile?.user?.email }</span>
        </div>
      </Host>
    );
  }

}
