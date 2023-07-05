export function generatePlist(name: string, title: string, uid: string, version: string, agent = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleDisplayName</key>
    <string>${title}</string>
    <key>CFBundleExecutable</key>
    <string>launch</string>
    <key>CFBundleGetInfoString</key>
    <string>${name}</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>${uid}</string>
    <key>CFBundleName</key>
    <string>${title}</string>
    <key>CFBundleShortVersionString</key>
    <string>${version}</string>
    <key>CFBundleVersion</key>
    <string>${version}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13.0</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.developer-tools</string>${agent ? `
    <key>LSUIElement</key>
    <true />` : ''}
    <key>NSPrincipalClass</key>
    <string>AtomApplication</string>
    <key>NSQuitAlwaysKeepsWindows</key>
    <false/>
    <key>NSRequiresAquaSystemAppearance</key>
    <false/>
    <key>NSSupportsAutomaticGraphicsSwitching</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
      <key>NSAllowsArbitraryLoads</key>
      <true />
    </dict>
    <key>NSHighResolutionCapable</key>
    <true />
  </dict>
</plist>
`;
}