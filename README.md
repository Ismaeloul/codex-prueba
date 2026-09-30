# Codex Prueba

Tienda de aplicaciones de Umbrel para probar **Ace Stream Neo V3** sin tocar la instalación original.

## Añadir la tienda a Umbrel

En Umbrel, abre **App Store → Add a community app store** y pega:

https://github.com/Ismaeloul/codex-prueba

Después instala **Ace Stream Neo V3 - Codex Prueba** desde esta tienda.

## Aislamiento de la instalación original

La app de prueba usa el ID codex-prueba-ace-stream-neo, su propio directorio de datos de Umbrel y nombres de contenedor exclusivos. Su acceso web usa el puerto 7793 y el motor AceStream publica el puerto P2P 8623; la app original conserva sus puertos. No incluye bases de datos, listas IPTV, credenciales Xtream ni datos locales del usuario.

**Estado de Pelis y Series:** la versión 0.8.4 muestra la sección con su nombre completo y permite buscar y filtrar entradas AceStream clasificadas como películas o series. El catálogo VOD de Xtream Codes (películas, series y episodios) todavía no se importa en esa sección; el soporte Xtream actual cubre los canales en directo.
