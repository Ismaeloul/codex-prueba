# Codex Prueba

Tienda de aplicaciones de Umbrel para probar **Ace Stream Neo V3** sin tocar la instalación original.

## Añadir la tienda a Umbrel

En Umbrel, abre **App Store → Add a community app store** y pega:

https://github.com/Ismaeloul/codex-prueba

Después instala **Ace Stream Neo V3 - Codex Prueba** desde esta tienda.

## Aislamiento de la instalación original

La app de prueba usa el ID codex-prueba-ace-stream-neo, su propio directorio de datos de Umbrel y nombres de contenedor exclusivos. Su acceso web usa el puerto 7793 y el motor AceStream publica el puerto P2P 8623; la app original conserva sus puertos. No incluye bases de datos, listas IPTV, credenciales Xtream ni datos locales del usuario.

**Estado de Pelis y Series:** la versión 0.8.5 carga las películas y series de una cuenta Xtream configurada en Ajustes → IPTV. Permite buscar por título, filtrar por películas o series, categoría e idioma, explorar episodios y reproducir películas y episodios mediante el servidor local. Las entradas AceStream anteriores siguen disponibles con el botón «Ver entradas AceStream». No requiere ninguna cuenta adicional para la app; el proveedor IPTV configurado es independiente. Los formatos MP4 y WebM se sirven con soporte de Range; MKV, AVI y TS se remuxean a MP4 con ffmpeg para el navegador. Los VOD HLS y los códecs no compatibles con el navegador pueden requerir trabajo posterior.

El código fuente de esta actualización se puede revisar en [patches/v0.8.5-vod.patch](patches/v0.8.5-vod.patch). Se aplica sobre `Ismaeloul/umbrel-app-store`, commit `28adf272bc32ed5eeb1626c618d31d110c35b5c6`, sin modificar la rama principal de la app original.
