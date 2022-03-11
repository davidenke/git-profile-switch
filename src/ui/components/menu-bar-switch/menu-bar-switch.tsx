import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from '@stencil/core';
import { EventWithTarget } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-switch',
  styleUrl: 'menu-bar-switch.scss',
  shadow: true,
})
export class MenuBarSwitch implements ComponentInterface {
  @Event()
  readonly switch: EventEmitter<string>;

  @Prop({ mutable: true })
  selectedProfileId: string;

  @Prop()
  items: string[] = [];

  @Prop()
  disabled = false;

  handleSelect({ target }: EventWithTarget<HTMLSelectElement, InputEvent>) {
    this.switch.emit(target.value);
  }

  render() {
    return (
      <select disabled={this.disabled} onInput={this.handleSelect.bind(this)}>
        {this.selectedProfileId.trim() === '' ? (
          <option disabled selected>
            new profile
          </option>
        ) : (
          this.items.map(item => (
            <option value={item} selected={item === this.selectedProfileId}>
              {item}
            </option>
          ))
        )}
      </select>
    );
  }
}
