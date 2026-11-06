// Minimal sessions — the sidebar shows sessions and nothing else.
//
// Two pieces, because core treats the rows differently:
//
// 1. `sidebarNav.prefs` (supported API): hides or reorders the navigation rows
//    without mutating the default list, so disabling or deleting this plugin
//    brings them back on its own (nothing to restore by hand). This takes out
//    new-session, messaging, artifacts, cron and command-center.
//
// 2. `capabilities` CANNOT be requested through that door: core keeps
//    NEVER_HIDDEN = {'capabilities'} because the Plugins tab lives there, and
//    that tab used to be the only way to turn a plugin off. Since Capabilities
//    is also reachable from ⌘K (command "nav.capabilities", keybind included)
//    and from the nav.capabilities keybind, the row is hidden here with a
//    style rule keyed on its own `data-tour="sidebar-nav-capabilities"` — the
//    same handle the tour uses. Still plugin-side: it touches no core files
//    and is not lost on `hermes update`, and it leaves with the plugin.
//
// What goes away and stays reachable elsewhere:
//   capabilities -> ⌘K → "Capabilities" (or its keybind)
//   new-session  -> ⌘N, or the "+" in the sessions header
//   cron         -> "hermes cron list" / the Routines tab with Bots enabled
//   messaging    -> ⌘K → "Messaging"
//   artifacts    -> ⌘K → "Artifacts"

import { SIDEBAR_NAV_PREFS_AREA } from '@hermes/plugin-sdk'

const STYLE_ID = 'minimal-sessions-hide-capabilities'

// The `data-tour` attribute lives on the label <span>, inside the <button>,
// inside the row's <li>. Both the row and its whole group are hidden: with the
// rows alone hidden the group stays empty but still measures ~42px from its
// `pt-[calc(var(--titlebar-height)+0.375rem)]`, which left a gap at the top.
// Measured against the real DOM (CDP): hiding the group lifts the rest and
// nothing lands under the titlebar drag zone.
const CSS = `
li:has([data-tour="sidebar-nav-capabilities"]) { display: none !important; }
button:has(> [data-tour="sidebar-nav-capabilities"]) { display: none !important; }
[data-sidebar="group"]:has([data-tour="sidebar-nav-capabilities"]) { display: none !important; }
`

export default {
  id: 'minimal-sessions',
  name: 'Minimal sessions',

  register(ctx) {
    ctx.register({
      id: 'hide-nav-rows',
      area: SIDEBAR_NAV_PREFS_AREA,
      data: { hide: ['new-session', 'messaging', 'artifacts', 'cron', 'command-center'] }
    })

    if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)

      if (typeof ctx.onDispose === 'function') {
        ctx.onDispose(() => {
          document.getElementById(STYLE_ID)?.remove()
        })
      }
    }
  }
}