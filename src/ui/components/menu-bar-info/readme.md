# gps-menu-bar-info



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type                                                                                                                                                        | Default     |
| ------------ | ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `avatarSize` | `avatar-size` |             | `number`                                                                                                                                                    | `28`        |
| `image`      | `image`       |             | `string`                                                                                                                                                    | `undefined` |
| `profile`    | --            |             | `{ user: { email: string; name?: string; signingKey?: string; }; core?: { editor?: string; excludesfile?: string; }; init?: { defaultBranch?: string; }; }` | `undefined` |


## CSS Custom Properties

| Name                | Description            |
| ------------------- | ---------------------- |
| `--gps-avatar-size` | the size of the avatar |


## Dependencies

### Used by

 - [gps-menu-bar-app](../menu-bar-app)

### Graph
```mermaid
graph TD;
  gps-menu-bar-app --> gps-menu-bar-info
  style gps-menu-bar-info fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
