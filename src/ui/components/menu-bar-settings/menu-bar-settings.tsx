import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { EventWithTarget, Settings, Theme } from '../../../common/types';
import { addThemeListener, getTheme } from '../../utils/theme.utils';

@Component({
  tag: 'gps-menu-bar-settings',
  styleUrl: 'menu-bar-settings.scss',
  shadow: true,
})
export class MenuBarSettings implements ComponentInterface {
  private readonly _unsubscribe = new Set<() => void>();

  @Event()
  readonly updated: EventEmitter<Settings>;

  @Event()
  readonly themeSelected: EventEmitter<Theme>;

  @Event()
  readonly open: EventEmitter<void>;

  @State()
  private _systemTheme = getTheme();

  @Prop()
  settings!: Settings;

  @Prop({ reflect: true })
  disabled = false;

  private _handleAutoStart({ target: { checked: autoStart } }: EventWithTarget<HTMLInputElement>) {
    this.settings = { ...this.settings, general: { ...this.settings.general, autoStart } };
    this.updated.emit(this.settings);
  }

  private _handleOverrideSystem({ target: { checked: overrideSystem } }: EventWithTarget<HTMLInputElement>) {
    this.settings = { ...this.settings, general: { ...this.settings.general, theme: { ...this.settings.general.theme, overrideSystem } } };
    this.updated.emit(this.settings);
    this.themeSelected.emit(this._selectedTheme());
  }

  private _handlePrefer({ target: { value } }: EventWithTarget<HTMLSelectElement>) {
    this.settings = { ...this.settings, general: { ...this.settings.general, theme: { ...this.settings.general.theme, prefer: value as Theme } } };
    this.updated.emit(this.settings);
    this.themeSelected.emit(this._selectedTheme());
  }

  private _handleEditJson(): void {
    this.open.emit();
  }

  private _selectedTheme(): Theme {
    const { overrideSystem = false, prefer } = this.settings.general.theme;
    return overrideSystem ? prefer : this._systemTheme;
  }

  connectedCallback() {
    // start listening to theme settings
    this._unsubscribe.add(addThemeListener(theme => (this._systemTheme = theme)));
    // broadcast initial theme
    this.themeSelected.emit(this._selectedTheme());
  }

  disconnectedCallback() {
    this._unsubscribe.forEach(unsubscribe => unsubscribe());
  }

  render() {
    return (
      <Host>
        <section>
          <label>
            <input
              type="checkbox"
              checked={this.settings.general.autoStart}
              disabled={this.disabled}
              onInput={(event: EventWithTarget<HTMLInputElement>) => this._handleAutoStart(event)}
            />
            <span class="label">enable auto start at login</span>
          </label>
          <label>
            <input
              type="checkbox"
              disabled={this.disabled}
              checked={this.settings.general.theme.overrideSystem}
              onInput={(event: EventWithTarget<HTMLInputElement>) => this._handleOverrideSystem(event)}
            />
            <span class="label">override system theme</span>
          </label>
          <label>
            <select disabled={this.disabled || !this.settings.general.theme.overrideSystem} onChange={(event: EventWithTarget<HTMLSelectElement>) => this._handlePrefer(event)}>
              <option value="dark" selected={this.settings.general.theme.prefer === 'dark'}>
                dark
              </option>
              <option value="light" selected={this.settings.general.theme.prefer === 'light'}>
                light
              </option>
            </select>
            <span class="label">theme</span>
          </label>
        </section>

        <section>
          <button disabled={this.disabled} onClick={() => this._handleEditJson()}>
            edit settings.json
          </button>
        </section>
      </Host>
    );
  }
}
