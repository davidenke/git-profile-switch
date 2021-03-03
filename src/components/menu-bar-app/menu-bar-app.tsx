import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'gps-menu-bar-app',
  styleUrl: 'menu-bar-app.scss',
  shadow: true
})
export class MenuBarApp implements ComponentInterface {

  render() {
    return (
      <div>Menu Bar App</div>
    );
  }

}
