# Codex Prueba

Tienda de aplicaciones de Umbrel para probar **Ace Stream Neo V3** sin tocar la instalación original.

## Añadir la tienda a Umbrel

En Umbrel, abre **App Store → Add a community app store** y pega:

https://github.com/Ismaeloul/codex-prueba

Después instala **Ace Stream Neo V3 - Codex Prueba** desde esta tienda.

## Aislamiento de la instalación original

La app de prueba usa el ID codex-prueba-ace-stream-neo, su propio directorio de datos de Umbrel y nombres de contenedor exclusivos. Su acceso web usa el puerto 7793 y el motor AceStream publica el puerto P2P 8623; la app original conserva sus puertos. No incluye bases de datos, listas IPTV, credenciales Xtream ni datos locales del usuario.

**Estado de Pelis y Series:** la versión 0.8.14 carga películas y series de una cuenta Xtream configurada en Ajustes → IPTV. Antes de pedir títulos, enseña las categorías y permite elegir idiomas; distingue **Español (España)** de **Español latinoamericano**, recuerda la selección en ese navegador y deja editarla. Después consulta solo las categorías asignadas a esos idiomas. Permite buscar, filtrar por tipo/categoría/idioma y explorar episodios. Las carátulas, los logos y los metadatos Xtream (año, valoración, género, sinopsis, dirección y reparto) aparecen cuando el proveedor los publica; si falta una imagen, se ve el cartel genérico. Las imágenes las sirve el backend local y no se envían URL del proveedor al navegador. MP4 y WebM se sirven con Range; otros contenedores habituales se remuxean a MP4 y, si el códec sigue sin ser compatible, el reproductor ofrece conversión H.264. La entrada de FFmpeg usa un proxy local privado con Range para los MP4 cuyo índice está al final. Los VOD HLS continúan sin soporte en esta versión.

El código fuente base de esta actualización se puede revisar en [patches/v0.8.9-vod-playback-compat.patch](patches/v0.8.9-vod-playback-compat.patch). El arreglo incremental de Range de la 0.8.11 está en [patches/v0.8.11-vod-range.patch](patches/v0.8.11-vod-range.patch), el diagnóstico seguro de la 0.8.12 en [patches/v0.8.12-vod-diagnostic.patch](patches/v0.8.12-vod-diagnostic.patch), el detalle upstream de la 0.8.13 en [patches/v0.8.13-vod-upstream-diagnostic.patch](patches/v0.8.13-vod-upstream-diagnostic.patch) y la compatibilidad HTTP 500 de la 0.8.14 en [patches/v0.8.14-vod-range-fallback.patch](patches/v0.8.14-vod-range-fallback.patch). Se aplican sobre el árbol ya preparado por la 0.8.9, que parte de `Ismaeloul/umbrel-app-store`, commit `28adf272bc32ed5eeb1626c618d31d110c35b5c6`, sin modificar la rama principal de la app original.

## Actualización 0.8.14

- **Compatible con este Xtream:** si el proveedor responde HTTP 500 a la petición inicial `Range: bytes=0-` de FFmpeg, el proxy repite esa lectura sin Range.
- **Fallback limitado:** solo se activa para esa combinación exacta; el resto de peticiones conserva Range y sus errores reales.

## Actualización 0.8.13

- **Causa upstream visible:** el diagnóstico indica el código HTTP interno, el método y el rango que el proveedor rechazó, sin registrar la URL Xtream ni sus credenciales.
- **Prueba real en Umbrel:** esta versión permite aplicar el arreglo exacto según la respuesta del proveedor real.

## Actualización 0.8.12

- **Diagnóstico VOD seguro:** si FFmpeg termina antes de producir vídeo, registra el modo, la extensión, el código de salida y un mensaje redactado sin URL ni credenciales.
- **Prueba dirigida:** esta versión se usa para capturar el fallo que todavía presenta el proveedor real después de corregir las lecturas Range.

## Actualización 0.8.11

- **Conversión MP4 corregida:** FFmpeg ya no recibe el archivo por una tubería que le impedía buscar el índice `moov`; usa un proxy de bucle local que conserva las peticiones Range.
- **Credenciales protegidas:** la URL Xtream continúa dentro del backend; FFmpeg solo ve una URL efímera `127.0.0.1`.
- **Regresión cubierta:** una prueba automática verifica varias lecturas Range sobre el mismo VOD y que la URL local no contiene usuario ni contraseña.

## Actualización 0.8.10

- **Preparación en Umbrel:** corrige el YAML de Compose; en 0.8.9, los dos puntos del aviso de FFmpeg rompían la sintaxis del comando.
- Incluye las correcciones de reproducción Xtream y diseño descritas abajo.

## Actualización 0.8.9 (no instalar)

- Esta versión contiene un error de sintaxis YAML en docker-compose.yml y Umbrel no puede prepararla. Usa 0.8.10.

- **Reproducción Xtream:** admite más extensiones y deduce la extensión del nombre del episodio cuando el panel omite `container_extension`. MOV ahora pasa por ffmpeg; MKV y otros contenedores se remuxean a MP4. Si el navegador no acepta el códec, el usuario puede reintentar con conversión H.264.
- **Errores más claros:** el servidor espera a que ffmpeg produzca datos antes de empezar la respuesta, y registra de forma acotada el motivo si termina antes.
- **Diseño de episodios:** las miniaturas usan un marco 16:9 y conservan la proporción de la imagen; los títulos envuelven texto largo y los botones quedan dentro de sus tarjetas, también en móvil.
- **Prueba real:** en Umbrel 0.8.8 se reprodujo el fallo con episodios MOV, MPEG y MKV de Mr. Robot. La versión 0.8.10 preparó las primeras correcciones y la 0.8.11 corrige además la entrada no desplazable de FFmpeg.

## Actualización 0.8.8

- **Controles más ágiles:** mientras se reproduce, los controles se ocultan tras 1,2 s sin movimiento del ratón y a los 250 ms al salir del reproductor. La transición visual dura 150 ms. Al pausar, siguen visibles; el teclado y los menús abiertos conservan el foco y la visibilidad.
- **Sin cambiar el stream:** este ajuste solo afecta a la interfaz. No modifica la calidad, el buffer ni el protocolo de los streams Ace Stream por hash o de IPTV.

## Actualización 0.8.7

- **Carga por idioma y categoría:** la primera visita solicita las categorías ligeras de películas y series, no el listado completo. La selección se guarda en el navegador y «Cambiar idiomas» permite revisarla. Cada categoría se asigna a un idioma detectado o manualmente; Español genérico se trata como Español (España), y etiquetas con Latinoamérica, LATAM, México y otros países de la región como Español latinoamericano. El nombre de la carpeta no garantiza el idioma de audio de sus archivos.
- **Arte y metadatos Xtream:** usa `stream_icon`/`cover` y datos que estén en los listados; al abrir una ficha, consulta `get_vod_info` o `get_series_info` para pedir sinopsis, año, valoración, género, dirección, reparto, fondos e imágenes de episodio. Todo es opcional; si el proveedor no lo entrega, se mantiene una ficha genérica.
- **Logos en televisión:** usa `stream_icon` de Xtream y `tvg-logo` de M3U. Los logos se guardan con el catálogo cifrado; la web recibe un id opaco y la imagen se descarga por el proxy local protegido contra URLs privadas, respuestas grandes y tipos que no sean imagen raster.
- **Límite de catálogo:** elimina la petición inicial sin filtrar que podía terminar en `iptv_too_large`; el trabajo se reparte por las categorías elegidas. Una categoría individual que exceda el tope de seguridad sigue mostrando un error específico.

La API Xtream no define de forma consistente un idioma de audio en cada título; por eso el filtro de idioma se basa en nombres de categoría detectados o asignados por el usuario, y se puede corregir en «Cambiar idiomas».


## Actualización 0.8.6

- **Corrección del paquete:** el nginx publicado en 0.8.5 apuntaba a los contenedores de la app original. La interfaz nueva consultaba por tanto un servidor sin las rutas VOD. Ahora todos los destinos de nginx coinciden con los contenedores `codex-prueba-ace-stream-neo_*` de Compose, incluidos el motor y el vídeo.
- **Datos independientes:** al actualizar puede ser necesario volver a configurar Xtream en Ajustes → IPTV de la app de prueba. No se migran ni se borran los datos de la app original.
- **Carga progresiva:** la consulta web devuelve el estado actual sin esperar a descargar todo el catálogo. Películas y series cargan por separado, muestran títulos a medida que llegan y se actualizan en pantalla cada 1,5 segundos mientras hay una carga pendiente.
- **Compatibilidad Xtream:** categorías mediante `get_vod_categories`/`get_series_categories`; títulos mediante `get_vod_streams`/`get_series`; episodios mediante `get_series_info`. Si una lista completa falla o llega vacía teniendo categorías, se consulta cada `category_id`, dando prioridad a la categoría seleccionada.
- **Recuperación:** un fallo conserva los títulos recibidos y muestra que el catálogo está incompleto. Actualizar catálogo vuelve a pedirlo. Cambiar de cuenta, pausar o eliminar la IPTV cancela las cargas anteriores.
- **Diagnóstico:** los errores distinguen autenticación, espera agotada, respuestas inválidas y límites del proveedor. Se muestran códigos sin URLs ni credenciales.

Referencias consultadas: [cliente Xtream de netv](https://github.com/jvdillon/netv/blob/main/xtream.py) y [proyecto IPTVnator](https://github.com/4gray/iptvnator). No se ha incorporado código de esos proyectos.

La compilación web/backend, las comprobaciones de tipos y las pruebas VOD de extensiones se ejecutan al preparar cada release. El empaquetado comprueba que los destinos nginx pertenecen a esta app y verifica los hashes. La reproducción completa de la versión nueva depende de instalarla en Umbrel y probarla con la cuenta IPTV del usuario.

Para reconstruir, preparar el código base con el parche acumulativo de esta versión y sus dependencias; después ejecutar `node scripts/build-release.mjs <ruta-del-codigo>`. El script no sobrescribe versiones existentes y rechaza un nginx que apunte fuera de la app de prueba.
