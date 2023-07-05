import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// in order to provide the LSUIElement key in the plist file, we have to remove the explicit call to setActivationPolicy,
// as even setting it to NSApplicationActivationPolicyAccessory will cause the app to show up in the dock
export async function patch(root: string) {
  const webviewPath = join(root, 'lib', 'webview', 'webview.h');
  let webviewContent = await readFile(webviewPath, 'utf-8');
  webviewContent = webviewContent.replace('((void (*)(id, SEL, long))objc_msgSend)(', '');
  webviewContent = webviewContent.replace('app, "setActivationPolicy:"_sel, NSApplicationActivationPolicyRegular);', '');
  await writeFile(webviewPath, webviewContent, 'utf-8');
}
