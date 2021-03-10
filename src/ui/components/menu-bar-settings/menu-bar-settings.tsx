import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from '@stencil/core';
import { EventWithTarget, Settings } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-settings',
  styleUrl: 'menu-bar-settings.scss',
  shadow: true
})
export class MenuBarSettings implements ComponentInterface {

  @Event()
  readonly updated: EventEmitter<Settings>;

  @Prop()
  settings?: Settings;

  @Prop({ reflect: true })
  disabled = false;

  @Prop({ reflect: true })
  visible = false;

  private _handleAutoStart({ target: { checked: autoStart } }: EventWithTarget<HTMLInputElement>) {
    this.updated.emit({ ...this.settings, general: { ...this.settings.general, autoStart } });
  }

  private _handleEditor({ target: { value: editor } }: EventWithTarget<HTMLInputElement>) {
    this.updated.emit({ ...this.settings, git: { ...this.settings.git, editor } });
  }

  private _handleOverrideSystem({ target: { checked: overrideSystem } }: EventWithTarget<HTMLInputElement>) {
    this.updated.emit({ ...this.settings, theme: { ...this.settings.theme, overrideSystem } });
  }

  private _handlePrefer({ target: { value } }: EventWithTarget<HTMLSelectElement>) {
    this.updated.emit({ ...this.settings, theme: { ...this.settings.theme, prefer: value as 'dark' | 'light' } });
  }

  render() {
    return [
      <label>
        <input type="checkbox"
               checked={ this.settings?.general?.autoStart }
               disabled={ this.disabled }
               onInput={ (event: EventWithTarget<HTMLInputElement>) => this._handleAutoStart(event) }
        />
        <span class="label">enable auto start at login</span>
      </label>,
      <input type="text"
             placeholder="default editor"
             disabled={ this.disabled }
             value={ this.settings?.git?.editor }
             onChange={ (event: EventWithTarget<HTMLInputElement>) => this._handleEditor(event) }
      />,
      <label>
        <input type="checkbox"
               disabled={ this.disabled }
               checked={ this.settings?.theme?.overrideSystem }
               onInput={ (event: EventWithTarget<HTMLInputElement>) => this._handleOverrideSystem(event) }
        />
        <span class="label">override system theme</span>
      </label>,
      this.settings?.theme?.overrideSystem && (
        <select disabled={ this.disabled }
                onChange={ (event: EventWithTarget<HTMLSelectElement>) => this._handlePrefer(event) }
        >
          <option value="dark"
                  selected={ this.settings?.theme?.prefer === 'dark' }
          >
            dark
          </option>
          <option value="light"
                  selected={ this.settings?.theme?.prefer === 'light' }
          >
            light
          </option>
        </select>
      )
    ];
  }

}
