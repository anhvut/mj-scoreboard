/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import {loadFonts} from './webfontloader'
import vuetify from './vuetify'
import i18n from './i18n'
import store from './store'

// Types
import type {App} from 'vue'

export function registerPlugins(app: App) {
  loadFonts().then()
  app.use(vuetify)
  app.use(i18n)
  app.use(store)
}
