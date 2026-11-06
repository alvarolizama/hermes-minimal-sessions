# hermes-minimal-sessions

Plugin de escritorio para **Hermes Desktop**: deja la barra lateral con sesiones y nada más.

Quita las filas de navegación que no usas a diario — `new-session`, `messaging`,
`artifacts`, `cron`, `command-center` y `capabilities` — para que el sidebar sea
la lista de sesiones, limpia.

| | |
|---|---|
| id del plugin | `minimal-sessions` (debe coincidir con el nombre de la carpeta) |
| área | `sidebarNav.prefs` + una regla de estilo para `capabilities` |
| build | ninguno — ESM plano, el app lo carga sin compilar |

## Instalación

Copia o enlaza la carpeta `minimal-sessions/` dentro de tu `$HERMES_HOME/desktop-plugins/`
(por defecto `~/.hermes/desktop-plugins/`). El nombre de la carpeta **tiene** que
ser `minimal-sessions`: el id del plugin y el directorio deben coincidir.

```sh
# copia
cp -R minimal-sessions ~/.hermes/desktop-plugins/

# o symlink, si quieres que este repo sea la fuente de verdad
ln -sfn "$PWD/minimal-sessions" ~/.hermes/desktop-plugins/minimal-sessions
```

El app vigila `desktop-plugins/` y lo carga en segundos, con hot-reload en cada
guardado. Si no aparece, ⌘K → **Reload desktop plugins**. Se prende y se apaga en
vivo desde **Capabilities → Plugins**.

## Cómo funciona

Dos piezas, porque core trata distinto las filas:

1. **`sidebarNav.prefs`** es la API soportada: esconde o reordena las filas de
   navegación *sin* mutar la lista por defecto, así que al desactivar o borrar el
   plugin regresan solas — no hay nada que restaurar a mano.
2. **`capabilities` no se puede pedir por esa vía**: core tiene
   `NEVER_HIDDEN = {'capabilities'}` porque ahí vive la pestaña de Plugins, que
   era la única forma de apagar un plugin. Como Capabilities también se alcanza
   desde ⌘K (`nav.capabilities`, con atajo) y por su keybind, la fila se oculta
   con una regla de estilo sobre su propio `data-tour="sidebar-nav-capabilities"`
   — el mismo handle que usa el tour. Esconde también el grupo vacío, que si no
   deja ~42 px de hueco arriba.

Todo es plugin-side: no toca archivos de core y no se pierde en `hermes update`.

## Lo que se cae y sigue accesible por otro lado

| Fila oculta | Cómo llegar |
|---|---|
| `capabilities` | ⌘K → "Capabilities" (o su atajo) |
| `new-session` | ⌘N, o el "+" del encabezado de sesiones |
| `cron` | `hermes cron list` / la pestaña Routines con Bots activo |
| `messaging` | ⌘K → "Messaging" |
| `artifacts` | ⌘K → "Artifacts" |

## Desinstalar

Borra la carpeta `~/.hermes/desktop-plugins/minimal-sessions/` y recarga plugins
(⌘K → **Reload desktop plugins**). Al desaparecer el plugin desaparece también la
regla de estilo, y `sidebarNav.prefs` vuelve a su lista por defecto.

## Licencia

MIT — ver [LICENSE](LICENSE).