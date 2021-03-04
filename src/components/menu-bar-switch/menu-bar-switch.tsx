import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from '@stencil/core';
import { EventWithTarget } from '../../types';

@Component({
  tag: 'gps-menu-bar-switch',
  styleUrl: 'menu-bar-switch.scss',
  shadow: true
})
export class MenuBarSwitch implements ComponentInterface {

  @Event()
  readonly switch: EventEmitter<string>;

  @Prop({ mutable: true })
  current?: string;

  @Prop()
  items: string[] = [];

  handleSelect({ target }: EventWithTarget<HTMLSelectElement, InputEvent>) {
    this.switch.emit(target.value);
  }

  render() {
    return (
      <select onInput={ this.handleSelect.bind(this) }>
        { this.items.map(item => (
          <option value={ item }
                  selected={ item === this.current }
          >
            { item }
          </option>
        )) }
      </select>
    );
  }

}
