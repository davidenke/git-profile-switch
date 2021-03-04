/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Profile } from "./types";
export namespace Components {
    interface GpsMenuBarApp {
    }
    interface GpsMenuBarInfo {
        "avatarSize": number;
        "profile"?: Profile;
    }
    interface GpsMenuBarSwitch {
        "current"?: string;
        "items": string[];
    }
}
declare global {
    interface HTMLGpsMenuBarAppElement extends Components.GpsMenuBarApp, HTMLStencilElement {
    }
    var HTMLGpsMenuBarAppElement: {
        prototype: HTMLGpsMenuBarAppElement;
        new (): HTMLGpsMenuBarAppElement;
    };
    interface HTMLGpsMenuBarInfoElement extends Components.GpsMenuBarInfo, HTMLStencilElement {
    }
    var HTMLGpsMenuBarInfoElement: {
        prototype: HTMLGpsMenuBarInfoElement;
        new (): HTMLGpsMenuBarInfoElement;
    };
    interface HTMLGpsMenuBarSwitchElement extends Components.GpsMenuBarSwitch, HTMLStencilElement {
    }
    var HTMLGpsMenuBarSwitchElement: {
        prototype: HTMLGpsMenuBarSwitchElement;
        new (): HTMLGpsMenuBarSwitchElement;
    };
    interface HTMLElementTagNameMap {
        "gps-menu-bar-app": HTMLGpsMenuBarAppElement;
        "gps-menu-bar-info": HTMLGpsMenuBarInfoElement;
        "gps-menu-bar-switch": HTMLGpsMenuBarSwitchElement;
    }
}
declare namespace LocalJSX {
    interface GpsMenuBarApp {
    }
    interface GpsMenuBarInfo {
        "avatarSize"?: number;
        "profile"?: Profile;
    }
    interface GpsMenuBarSwitch {
        "current"?: string;
        "items"?: string[];
        "onSwitch"?: (event: CustomEvent<string>) => void;
    }
    interface IntrinsicElements {
        "gps-menu-bar-app": GpsMenuBarApp;
        "gps-menu-bar-info": GpsMenuBarInfo;
        "gps-menu-bar-switch": GpsMenuBarSwitch;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "gps-menu-bar-app": LocalJSX.GpsMenuBarApp & JSXBase.HTMLAttributes<HTMLGpsMenuBarAppElement>;
            "gps-menu-bar-info": LocalJSX.GpsMenuBarInfo & JSXBase.HTMLAttributes<HTMLGpsMenuBarInfoElement>;
            "gps-menu-bar-switch": LocalJSX.GpsMenuBarSwitch & JSXBase.HTMLAttributes<HTMLGpsMenuBarSwitchElement>;
        }
    }
}
