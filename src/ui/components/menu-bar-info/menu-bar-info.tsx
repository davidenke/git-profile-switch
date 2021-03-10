import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';
import { Profile } from '../../../common/types';

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

  @Prop()
  image?: string;

  render() {
    return (
      <Host style={ { '--gps-avatar-size': `${ this.avatarSize }px` } }>
        <figure class="avatar">
          <img src={ this.image }
               alt={ this.profile?.user?.name }
          />
        </figure>
        <div class="user">
          <span class="name">{ this.profile?.user?.name }</span>
          <span class="email">{ this.profile?.user?.email }</span>
        </div>
        <nav class="actions">
          <slot/>
        </nav>
      </Host>
    );
  }

}
