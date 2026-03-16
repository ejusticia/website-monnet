# Cómo desplegar y compartir el sitio

## Paso 0 — Antes del primer despliegue (solo una vez)

### 0.1 Sustituir la URL base

El sitio usa la URL base **https://www.monnet.com** en meta tags y sitemap. **Cuando tengas tu URL definitiva** (por ejemplo `https://monnet-demo.netlify.app`), haz un **buscar y reemplazar** en todo el proyecto:

- **Buscar:** `https://www.monnet.com`  
- **Reemplazar por:** tu URL **sin** barra final (ej. `https://monnet-demo.netlify.app`).  
  En los canonical de la home usa barra final: `https://monnet-demo.netlify.app/`.

**Archivos donde aparece** (reemplazar en todos):

| Archivo | Dónde |
|--------|--------|
| `index.html` | canonical, og:url, og:image, twitter:image, JSON-LD (2 bloques) |
| `about.html` | canonical, og:url, og:image, twitter:image |
| `coverage.html` | canonical, og:url, og:image, twitter:image |
| `solutions/payins.html` | canonical, og:url, og:image, twitter:image |
| `solutions/payouts.html` | canonical, og:url, og:image, twitter:image |
| `solutions/platform.html` | canonical, og:url, og:image, twitter:image |
| `robots.txt` | línea Sitemap: |
| `sitemap.xml` | todas las etiquetas `<loc>` (6 URLs) |

### 0.2 Imagen para redes sociales

- En la carpeta **`assets/`** ya está **`og-image.png`** (1200×630 px) para Open Graph y Twitter Card.
- Si quieres otra imagen (logo + claim distinto), sustituye ese archivo manteniendo el nombre `og-image.png` y tamaño 1200×630 px.

---

# Despliegue

El proyecto es **estático** (HTML, CSS, JS). Puedes subirlo a cualquiera de estos servicios (gratis) y obtener una URL para compartir.

---

## Opción 1: Netlify (recomendada, muy rápida)

1. Entra en **[netlify.com](https://www.netlify.com)** y crea cuenta (o inicia sesión con GitHub).
2. En el panel: **Add new site** → **Deploy manually**.
3. Arrastra **toda la carpeta del proyecto** (la que contiene `index.html`, `css/`, `solutions/`, `assets/`, etc.) a la zona de drag & drop.
4. En unos segundos tendrás una URL tipo:  
   `https://nombre-aleatorio.netlify.app`
5. Para una URL más clara: **Site settings** → **Domain management** → **Options** en el dominio → **Edit site name** y pon algo como `monnet-demo`.

**Ventaja:** No necesitas Git. Solo arrastrar la carpeta y compartir el enlace.

---

## Opción 2: GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `website-monnet`).
2. Sube todo el contenido del proyecto (que la raíz del repo sea donde está `index.html`).
3. En el repo: **Settings** → **Pages**.
4. En **Source** elige **Deploy from a branch**.
5. Branch: `main` (o `master`), carpeta **/ (root)** → Save.
6. La URL será:  
   `https://tu-usuario.github.io/website-monnet/`

Si usas una **organization** o un **Project site** en GitHub, la URL puede ser distinta; en ese caso, si algo no carga (CSS, enlaces), se puede añadir un `<base href="...">` en el HTML.

---

## Opción 3: Vercel

1. Entra en **[vercel.com](https://vercel.com)** y conecta tu cuenta (p. ej. GitHub).
2. **Add New** → **Project** → importa el repo donde hayas subido el sitio (o usa **CLI** y ejecuta `vercel` dentro de la carpeta del proyecto).
3. Vercel detecta que es estático y te da una URL tipo:  
   `https://website-monnet-xxx.vercel.app`

---

## Después del despliegue

- Usa la URL que te den (Netlify, GitHub Pages o Vercel) para compartir el sitio.
- Todas las rutas del proyecto son relativas (`css/styles.css`, `solutions/payins.html`, etc.), así que funcionan bien en la raíz del dominio.
- Si cambias algo, en **Netlify** o **Vercel** vuelve a arrastrar la carpeta o haz push al repo; en **GitHub Pages** se actualiza solo con cada push.

---

## Recomendaciones ya incorporadas (SEO de calidad)

Todo lo siguiente está implementado en el proyecto:

- **Título único** por página, con palabra clave y marca (ej. "Payins — Accept payments in LATAM | Monnet").
- **Meta description** única por página (150–160 caracteres), con beneficio y términos relevantes.
- **Canonical** en todas las páginas (URL absoluta) para evitar contenido duplicado.
- **Open Graph** (og:type, og:url, og:title, og:description, og:image, og:locale) para compartir en redes.
- **Twitter Card** (summary_large_image) con título, descripción e imagen.
- **robots.txt** con `Allow: /` y `Sitemap` apuntando al sitemap.
- **sitemap.xml** con las 6 URLs, lastmod, changefreq y priority.
- **JSON-LD** en la home: Organization y WebSite para buscadores.
- **Alt** descriptivos en todas las imágenes (logo Monnet, logo Luma Store / merchant, fotos del equipo).
- **Imagen social** `assets/og-image.png` (1200×630) para previsualización al compartir.

Solo falta que, cuando tengas tu URL final, hagas el **Paso 0.1** (buscar y reemplazar la URL base) y desplegar.
