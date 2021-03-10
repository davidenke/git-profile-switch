import { Component, ComponentInterface, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { EventWithTarget, Settings, Theme } from '../../../common/types';

@Component({
  tag: 'gps-menu-bar-settings',
  styleUrl: 'menu-bar-settings.scss',
  shadow: true
})
export class MenuBarSettings implements ComponentInterface {

  private readonly _colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  @Event()
  readonly updated: EventEmitter<Settings>;

  @State()
  private _systemTheme: Theme = this._colorScheme.matches ? 'dark' : 'light';

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

  private _isThemeSelected(theme: Theme): boolean {
    const { overrideSystem = false, prefer } = this.settings?.theme;
    return (overrideSystem && prefer === theme) || (!overrideSystem && this._systemTheme === theme);
  }

  connectedCallback() {
    this._colorScheme.addEventListener('change', ({ matches }) => {
      this._systemTheme = matches ? 'dark' : 'light';
    })
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
      <label>
        <input type="text"
               placeholder="vim"
               disabled={ this.disabled }
               value={ this.settings?.git?.editor }
               onChange={ (event: EventWithTarget<HTMLInputElement>) => this._handleEditor(event) }
        />
        <span class="label">editor</span>
      </label>,
      <label>
        <input type="checkbox"
               disabled={ this.disabled }
               checked={ this.settings?.theme?.overrideSystem }
               onInput={ (event: EventWithTarget<HTMLInputElement>) => this._handleOverrideSystem(event) }
        />
        <span class="label">override system theme</span>
      </label>,
      <label>
        <select disabled={ this.disabled || !this.settings?.theme?.overrideSystem }
                onChange={ (event: EventWithTarget<HTMLSelectElement>) => this._handlePrefer(event) }
        >
          <option value="dark"
                  selected={ this._isThemeSelected('dark') }
          >
            dark
          </option>
          <option value="light"
                  selected={ this._isThemeSelected('light') }
          >
            light
          </option>
        </select>
        <span class="label">theme</span>
      </label>
    ];
  }

}
