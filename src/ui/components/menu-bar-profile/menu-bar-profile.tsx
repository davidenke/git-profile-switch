import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EventWithTarget, Profile } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-profile',
  styleUrl: 'menu-bar-profile.scss',
  shadow: true,
})
export class MenuBarProfile implements ComponentInterface {
  @Event()
  readonly updated: EventEmitter<Profile>;

  @Prop({ mutable: true })
  profile!: Profile;

  handleInput<G extends keyof Profile, K extends keyof Profile[G]>({ target: { value } }: EventWithTarget<HTMLInputElement>, group: G, key: K) {
    this.profile[group][key] = value as unknown as Profile[G][K];
    this.updated.emit(this.profile);
  }

  render() {
    return (
      <Host>
        <section>
          <input type="text" placeholder="name" value={this.profile.user.name} onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'user', 'name')} />
          <input
            type="email"
            placeholder="email"
            value={this.profile.user.email}
            onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'user', 'email')}
          />
        </section>
        <section>
          <input type="text" placeholder="vim" value={this.profile.core.editor} onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'core', 'editor')} />
        </section>
      </Host>
    );
  }
}
