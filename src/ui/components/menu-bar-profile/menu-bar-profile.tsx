import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { EventWithTarget, Profile } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-profile',
  styleUrl: 'menu-bar-profile.scss',
  shadow: true,
})
export class MenuBarProfile implements ComponentInterface {
  @State()
  private _betterAskTwice = false;
  
  @Event()
  readonly remove: EventEmitter<Profile>;

  @Event()
  readonly changed: EventEmitter<Profile>;

  @Event()
  readonly update: EventEmitter<Profile>;

  @Prop()
  isNew = false;

  @Prop()
  alreadyExisting = false;

  @Prop({ mutable: true })
  profile!: Profile;

  handleRemove() {
    if (this._betterAskTwice) {
      this._betterAskTwice = false;
      return this.remove.emit(this.profile);
    }
    this._betterAskTwice = true;
  }

  handleInput<G extends keyof Profile, K extends keyof Profile[G]>({ target: { value } }: EventWithTarget<HTMLInputElement>, group: G, key: K) {
    this.profile[group] = {
      ...this.profile[group],
      [key]: value as unknown as Profile[G][K],
    };
    this.changed.emit(this.profile);
  }

  render() {
    return (
      <Host>
        <section>
          <input type="text" placeholder="name" value={this.profile.user.name} onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'user', 'name')} />
          <input
            type="email"
            placeholder="email"
            class={{ error: this.alreadyExisting }}
            value={this.profile.user.email}
            onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'user', 'email')}
          />
        </section>
        <section>
          <input
            type="text"
            placeholder="vim"
            value={this.profile.core?.editor}
            onInput={(event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'core', 'editor')}
          />
        </section>
        <section>
          <button onClick={() => this.handleRemove()}>{ this._betterAskTwice ? 'sure?' : 'remove'}</button>
          <button onClick={() => this.update.emit(this.profile)}>{ this.isNew ? 'create' : 'update' }</button>
        </section>
      </Host>
    );
  }
}
