# ImpressCreator

Una herramienta web minimalista para crear presentaciones impresionantes con impress.js de forma visual e intuitiva.

## 🎯 Objetivo

Desarrollar un frontend que permita a los usuarios crear presentaciones con impress.js sin necesidad de escribir código, proporcionando una interfaz visual con previsualización en tiempo real y descarga del archivo HTML final.

## ✨ Características

### Editor Visual
- **Gestión de diapositivas**: Agregar, eliminar y navegar entre diapositivas
- **Editor de contenido**: Área de texto para escribir el contenido de cada diapositiva
- **Controles de posicionamiento**: Ajuste preciso de posición X, Y, Z
- **Controles de transformación**: Rotación en los tres ejes y escalado
- **Efectos predefinidos**: Botones para aplicar efectos comunes

### Vista Previa en Tiempo Real
- **Renderizado idéntico**: Usa el mismo CSS y comportamiento que impress.js original
- **Navegación sincronizada**: Los controles del editor sincronizan con la presentación
- **Transiciones completas**: Todas las animaciones y efectos funcionan correctamente

### Efectos Disponibles
- **◢ Slide**: Diapositiva normal con clase "step slide"
- **⊕ Zoom**: Efecto de zoom con escala aumentada
- **↻ Rotar**: Rotación automática con escala
- **◊ 3D**: Efecto tridimensional con posición Z
- **◯ Grande**: Escala grande para elementos destacados
- **• Pequeño**: Escala pequeña con profundidad

### Contenido Precargado
- **Demo completo**: 13 diapositivas basadas en el demo original de impress.js
- **Textos traducidos**: Contenido en español como guía para el usuario
- **Configuraciones ejemplo**: Cada diapositiva muestra diferentes capacidades

## 🎨 Diseño

### Paleta de Colores
- **Fondo principal**: Gradiente arena a café (#d4b896 → #8b6f47)
- **Paneles**: Arena claro (#f5f1eb) con bordes suaves
- **Texto**: Café oscuro (#3c2e26, #5d4e37) para legibilidad
- **Botones**: Café medio (#8b6f47) con efectos hover
- **Inputs**: Crema (#fefcf8) con bordes arena

### Iconografía Minimalista
- Símbolos geométricos simples y universales
- Sin dependencias de librerías de iconos externas
- Diseño coherente y limpio

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsive con Grid y Flexbox
- **JavaScript ES6**: Programación orientada a objetos
- **Impress.js**: Motor de presentaciones 3D
- **Google Fonts**: Tipografía Inter para interfaz

## 📁 Estructura del Proyecto

```
impresscreator/
├── index.html          # Interfaz principal
├── styles.css          # Estilos con paleta arena/café
├── script.js           # Lógica de la aplicación
└── README.md           # Documentación
```

## 🚀 Funcionalidades

### Gestión de Diapositivas
- Agregar nuevas diapositivas
- Eliminar diapositivas existentes
- Navegar entre diapositivas
- Contador de diapositivas

### Editor de Contenido
- Área de texto con formato
- Soporte para markdown básico (**negrita**)
- Tipos de diapositiva (slide, step, title, overview)
- Autoguardado de cambios

### Controles de Transformación
- **Posición**: X, Y, Z en píxeles
- **Rotación**: X, Y, Z en grados
- **Escala**: 0.1 a 10x
- **Autoplay**: Tiempo personalizado por diapositiva

### Vista Previa
- Renderizado en iframe con impress.js completo
- Navegación con botones anterior/siguiente
- Sincronización con diapositiva actual
- CSS idéntico al demo original

### Exportación
- Generación de HTML completo
- Inclusión de CDN de impress.js
- Estilos CSS integrados
- Descarga automática del archivo

## 🎮 Uso

1. **Abrir la aplicación**: Cargar `index.html` en el navegador
2. **Explorar el demo**: Usar "Cargar Demo Original" para ver ejemplos
3. **Editar contenido**: Seleccionar diapositivas y modificar texto
4. **Aplicar efectos**: Usar botones de efectos predefinidos
5. **Ajustar posición**: Modificar controles de transformación
6. **Previsualizar**: Ver resultado en tiempo real
7. **Descargar**: Generar archivo HTML final

## 🔧 Controles Disponibles

### Botones de Efectos
- Aplicación rápida de configuraciones predefinidas
- Basados en el demo original de impress.js
- Combinan posición, rotación y escala

### Controles Manuales
- Ajuste fino de cada parámetro
- Valores numéricos precisos
- Actualización en tiempo real

### Navegación
- Botones anterior/siguiente
- Contador de posición
- Sincronización con preview

### Gestión de Proyecto
- Cargar demo completo
- Limpiar todo el contenido
- Descargar presentación final

## 🎯 Casos de Uso

- **Educativo**: Aprender impress.js de forma visual
- **Prototipado**: Crear presentaciones rápidamente
- **Profesional**: Generar presentaciones sin código
- **Experimental**: Probar efectos y transiciones

## 🔄 Proceso de Desarrollo

### Fase 1: Estructura Base
- Interfaz HTML con paneles editor/preview
- CSS con diseño minimalista
- JavaScript básico para gestión de diapositivas

### Fase 2: Funcionalidades Core
- Sistema de efectos predefinidos
- Controles de transformación completos
- Integración con impress.js

### Fase 3: Contenido y UX
- Precarga del demo original traducido
- Paleta de colores arena/café
- Iconografía minimalista

### Fase 4: Optimización
- Preview con renderizado idéntico
- Sincronización de navegación
- Corrección de bugs de compatibilidad

## 🌟 Características Destacadas

- **Sin dependencias**: Solo requiere un navegador moderno
- **Responsive**: Funciona en diferentes tamaños de pantalla
- **Intuitivo**: Interfaz fácil de usar sin curva de aprendizaje
- **Completo**: Incluye todas las funcionalidades de impress.js
- **Educativo**: Sirve como tutorial interactivo

## 📝 Notas Técnicas

- Compatible con Chrome, Firefox, Safari
- Requiere JavaScript habilitado
- Genera HTML estándar sin dependencias locales
- Usa CDN para impress.js en archivos exportados
- CSS optimizado para rendimiento

---

**ImpressCreator** - Creando presentaciones impresionantes de forma visual y sencilla.