# Simple Desk Dashboard

Un dashboard minimalista construido con [Astro](https://astro.build) para tener la hora, y el clima en alguna pantalla de un escritorio. Por ejemplo un celular o un monitor pequeño.

## Estructura del proyecto

```text
/
├── public/
│   ├── dashboard.js
│   └── styles.css
├── src/
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

Astro busca archivos `.astro` o `.md` en el directorio `src/pages/`. Cada página se expone como una ruta basada en su nombre de archivo.

Los estilos y scripts del cliente se encuentran en la carpeta `public/`.

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build`           | Construye el sitio de producción en `./dist/`    |
| `npm run preview`         | Vista previa de la compilación antes de desplegar |
