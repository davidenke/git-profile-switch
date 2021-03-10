import { Component, ComponentInterface, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { EventWithTarget, Settings, Theme } from '../../../common/types';
import { addThemeListener, getTheme } from '../../utils/theme.utils';

@Component({
  tag: 'gps-menu-bar-settings',
  styleUrl: 'menu-bar-settings.scss',
  shadow: true
})
export class MenuBarSettings implements ComponentInterface {

  private readonly _unsubscribe = new Set<() => void>();

  @Event()
  readonly updated: EventEmitter<Settings>;

  @Event()
  readonly themeSelected: EventEmitter<Theme>;

  @State()
  private _systemTheme = getTheme();

  @Prop()
  settings?: Settings;

  @Prop({ reflect: true })
  disabled = false;

  @Prop({ reflect: true })
  visible = false;

  private _handleAutoStart({ target: { checked: autoStart } }: EventWithTarget<HTMLInputElement>) {
    this.settings = { ...this.settings, general: { ...this.settings.general, autoStart } };
    this.updated.emit(this.settings);
  }

  private _handleEditor({ target: { value: editor } }: EventWithTarget<HTMLInputElement>) {
    this.settings = { ...this.settings, git: { ...this.settings.git, editor } };
    this.updated.emit(this.settings);
  }

  private _handleOverrideSystem({ target: { checked: overrideSystem } }: EventWithTarget<HTMLInputElement>) {
    this.settings = { ...this.settings, theme: { ...this.settings.theme, overrideSystem } };
    this.updated.emit(this.settings);
    this.themeSelected.emit(this._selectedTheme());
  }

  private _handlePrefer({ target: { value } }: EventWithTarget<HTMLSelectElement>) {
    this.settings = { ...this.settings, theme: { ...this.settings.theme, prefer: value as 'dark' | 'light' } };
    this.updated.emit(this.settings);
    this.themeSelected.emit(this._selectedTheme());
  }

  private _selectedTheme(): Theme {
    const { overrideSystem = false, prefer } = this.settings?.theme;
    return overrideSystem ? prefer : this._systemTheme;
  }

  connectedCallback() {
    // start listening to theme settings
    this._unsubscribe.add(addThemeListener(theme => this._systemTheme = theme));
    // broadcast initial theme
    this.themeSelected.emit(this._selectedTheme());
  }

  disconnectedCallback() {
    this._unsubscribe.forEach(unsubscribe => unsubscribe());
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
        <span class="label">theme</span>
      </label>
    ];
  }

}
