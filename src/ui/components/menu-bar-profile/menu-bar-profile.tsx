import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from '@stencil/core';
import { EventWithTarget, Profile } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-profile',
  styleUrl: 'menu-bar-profile.scss',
  shadow: true
})
export class MenuBarProfile implements ComponentInterface {

  @Event()
  readonly updated: EventEmitter<Profile['user']>;

  @Prop({ mutable: true })
  email = '';

  @Prop({ mutable: true })
  name = '';

  @Prop({ reflect: true })
  visible = false;

  handleInput({ target: { value } }: EventWithTarget<HTMLInputElement>, name: 'email' | 'name') {
    this[name] = value;
    this.updated.emit({ email: this.email, name: this.name });
  }

  render() {
    return [
      <input type="text"
             placeholder="name"
             value={ this.name }
             onInput={ (event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'name') }
      />,
      <input type="email"
             placeholder="email"
             value={ this.email }
             onInput={ (event: EventWithTarget<HTMLInputElement>) => this.handleInput(event, 'email') }
      />
    ];
  }

}
