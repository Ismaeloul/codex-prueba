# Codex Prueba

Tienda de aplicaciones de Umbrel para probar **Ace Stream Neo V3** sin tocar la instalación original.

## Añadir la tienda a Umbrel

En Umbrel, abre **App Store → Add a community app store** y pega:

https://github.com/Ismaeloul/codex-prueba

Después instala **Ace Stream Neo V3 - Codex Prueba** desde esta tienda.

## Aislamiento de la instalación original

La app de prueba usa el ID codex-prueba-ace-stream-neo, su propio directorio de datos de Umbrel y nombres de contenedor exclusivos. Su acceso web usa el puerto 7793 y el motor AceStream publica el puerto P2P 8623; la app original conserva sus puertos. No incluye bases de datos, listas IPTV, credenciales Xtream ni datos locales del usuario.

**Estado de Pelis y Series:** la versión 0.8.6 carga las películas y series de una cuenta Xtream configurada en Ajustes → IPTV. Permite buscar por título, filtrar por películas o series, categoría e idioma, explorar episodios y reproducir películas y episodios mediante el servidor local. Las entradas AceStream anteriores siguen disponibles con el botón «Ver entradas AceStream». No requiere ninguna cuenta adicional para la app; el proveedor IPTV configurado es independiente. Los formatos MP4 y WebM se sirven con soporte de Range; MKV, AVI y TS se remuxean a MP4 con ffmpeg para el navegador. Los VOD HLS y los códecs no compatibles con el navegador pueden requerir trabajo posterior.

El código fuente de esta actualización se puede revisar en [patches/v0.8.6-vod.patch](patches/v0.8.6-vod.patch). Se aplica sobre `Ismaeloul/umbrel-app-store`, commit `28adf272bc32ed5eeb1626c618d31d110c35b5c6`, sin modificar la rama principal de la app original.


## Actualización 0.8.6

- **Corrección del paquete:** el nginx publicado en 0.8.5 apuntaba a los contenedores de la app original. La interfaz nueva consultaba por tanto un servidor sin las rutas VOD. Ahora todos los destinos de nginx coinciden con los contenedores `codex-prueba-ace-stream-neo_*` de Compose, incluidos el motor y el vídeo.
- **Datos independientes:** al actualizar puede ser necesario volver a configurar Xtream en Ajustes → IPTV de la app de prueba. No se migran ni se borran los datos de la app original.
- **Carga progresiva:** la consulta web devuelve el estado actual sin esperar a descargar todo el catálogo. Películas y series cargan por separado, muestran títulos a medida que llegan y se actualizan en pantalla cada 1,5 segundos mientras hay una carga pendiente.
- **Compatibilidad Xtream:** categorías mediante `get_vod_categories`/`get_series_categories`; títulos mediante `get_vod_streams`/`get_series`; episodios mediante `get_series_info`. Si una lista completa falla o llega vacía teniendo categorías, se consulta cada `category_id`, dando prioridad a la categoría seleccionada.
- **Recuperación:** un fallo conserva los títulos recibidos y muestra que el catálogo está incompleto. Actualizar catálogo vuelve a pedirlo. Cambiar de cuenta, pausar o eliminar la IPTV cancela las cargas anteriores.
- **Diagnóstico:** los errores distinguen autenticación, espera agotada, respuestas inválidas y límites del proveedor. Se muestran códigos sin URLs ni credenciales.

Referencias consultadas: [cliente Xtream de netv](https://github.com/jvdillon/netv/blob/main/xtream.py) y [proyecto IPTVnator](https://github.com/4gray/iptvnator). No se ha incorporado código de esos proyectos.

La compilación de web/backend y las comprobaciones de tipos se completaron. El empaquetado comprueba que los destinos nginx pertenecen a esta app y verifica los hashes. La carga y reproducción con una cuenta real en Umbrel quedan pendientes de validación; el acceso remoto disponible exige iniciar sesión en Umbrel.

Para reconstruir, preparar el código base con el parche acumulativo `patches/v0.8.6-vod.patch` y sus dependencias; después ejecutar `node scripts/build-release.mjs <ruta-del-codigo>`. El script no sobrescribe versiones existentes y rechaza un nginx que apunte fuera de la app de prueba.
