# Navidad Mágica 🎄

Web interactiva navideña, estática y lista para publicar en GitHub Pages.

## Incluye
- **Villancicos:** trece villancicos con letras y seis grabaciones tradicionales reales de la colección de la Fundación Joaquín Díaz, servidas desde Wikimedia Commons. Las grabaciones se identifican en el reproductor; requieren conexión a Internet.
- **Carta a los Reyes Magos:** formulario que genera y descarga una carta `.txt`. Los datos no se envían a ningún servidor.
- **Juego audiovisual:** mueve a Papá Noel para recoger estrellas durante 30 segundos. Incluye sonido, puntuación, récord guardado localmente y controles táctiles.
- Diseño adaptable a móviles, tabletas y ordenadores. Efecto de nieve y navegación por secciones.

## Publicar en GitHub Pages
1. Descomprime el ZIP.
2. Crea un repositorio en GitHub y sube `index.html`, `styles.css`, `script.js` y `README.md` a la raíz.
3. En el repositorio, abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
6. Espera a que GitHub Pages publique la web. La dirección tendrá el formato `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

No necesita backend, base de datos, claves API ni proceso de compilación. Puedes probarla abriendo `index.html` en el navegador.

## Notas
- Las grabaciones musicales se reproducen desde Wikimedia Commons. Las grabaciones de la Fundación Joaquín Díaz están publicadas bajo licencia Creative Commons Atribución-CompartirIgual 3.0 (CC BY-SA 3.0); se conservan los enlaces a las fichas originales como atribución. No se incluyen archivos de audio dentro del ZIP.
- La carta se genera localmente en el dispositivo y no se transmite.
- El récord del juego se almacena en el navegador mediante `localStorage`.
- La tipografía usa Google Fonts si hay conexión; el sitio mantiene tipografías alternativas si no la hay.
