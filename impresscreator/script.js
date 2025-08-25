class ImpressCreator {
    constructor() {
        this.backgroundImage = null;
        this.previewCache = null;
        this.lastUpdateTime = 0;
        this.updateTimeout = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        this.isNordicTheme = false;
        this.slides = [
            {
                id: 0,
                content: '¿No estás **aburrido** de todas esas presentaciones basadas en diapositivas?',
                x: -1000,
                y: -1500,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                type: 'slide',
                effect: 'slide',
                autoplay: 10
            },
            {
                id: 1,
                content: '¿No crees que las presentaciones en **navegadores modernos** no deberían **copiar las limitaciones** de las diapositivas clásicas?',
                x: 0,
                y: -1500,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                type: 'slide',
                effect: 'slide',
                autoplay: 0
            },
            {
                id: 2,
                content: '¿Te gustaría **impresionar a tu audiencia** con **visualizaciones impactantes** de tu charla?',
                x: 1000,
                y: -1500,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                type: 'slide',
                effect: 'slide',
                autoplay: 0
            },
            {
                id: 3,
                content: 'entonces deberías probar\n\nimpress.js\n\n* sin rima intencionada',
                x: 0,
                y: 0,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 4,
                type: 'step',
                effect: 'zoom',
                autoplay: 0
            },
            {
                id: 4,
                content: 'Es una **herramienta de presentación** inspirada en la idea detrás de prezi.com y basada en el **poder de las transformaciones y transiciones CSS3** en navegadores modernos.',
                x: 850,
                y: 3000,
                z: 0,
                rotation: 90,
                rotateX: 0,
                rotateY: 0,
                scale: 5,
                type: 'step',
                effect: 'rotate',
                autoplay: 0
            },
            {
                id: 5,
                content: 'visualiza tus **grandes** pensamientos',
                x: 3500,
                y: 2100,
                z: 0,
                rotation: 180,
                rotateX: 0,
                rotateY: 0,
                scale: 6,
                type: 'step',
                effect: 'big',
                autoplay: 0
            },
            {
                id: 6,
                content: 'y **pequeñas** ideas',
                x: 2825,
                y: 2325,
                z: -3000,
                rotation: 300,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                type: 'step',
                effect: 'tiny',
                autoplay: 0
            },
            {
                id: 7,
                content: 'mediante **posicionamiento**, **rotación** y **escalado** en un lienzo infinito',
                x: 3500,
                y: -850,
                z: 0,
                rotation: 270,
                rotateX: 0,
                rotateY: 0,
                scale: 6,
                type: 'step',
                effect: 'big',
                autoplay: 0
            },
            {
                id: 8,
                content: 'el único **límite** es tu **imaginación**',
                x: 6700,
                y: -300,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 6,
                type: 'step',
                effect: 'big',
                autoplay: 0
            },
            {
                id: 9,
                content: '¿quieres saber más?\n\n¡usa el código fuente, Luke!',
                x: 6300,
                y: 2000,
                z: 0,
                rotation: 20,
                rotateX: 0,
                rotateY: 0,
                scale: 4,
                type: 'step',
                effect: 'zoom',
                autoplay: 0
            },
            {
                id: 10,
                content: 'una cosa más...',
                x: 6000,
                y: 4000,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 2,
                type: 'step',
                effect: 'zoom',
                autoplay: 0
            },
            {
                id: 11,
                content: '¿has notado que está en **3D**?\n\n* supera eso, prezi ;)',
                x: 6200,
                y: 4300,
                z: -100,
                rotation: 0,
                rotateX: -40,
                rotateY: 10,
                scale: 2,
                type: 'step',
                effect: '3d',
                autoplay: 0
            },
            {
                id: 12,
                content: '',
                x: 3000,
                y: 1500,
                z: 0,
                rotation: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 10,
                type: 'step',
                effect: 'zoom',
                autoplay: 0
            }
        ];
        this.currentSlide = 0;
        this.effectPresets = {
            slide: { classes: 'step slide', scale: 1 },
            zoom: { classes: 'step', scale: 4 },
            rotate: { classes: 'step', rotation: 90, scale: 5 },
            '3d': { classes: 'step', z: -3000, rotation: 300 },
            big: { classes: 'step', scale: 6, rotation: 180 },
            tiny: { classes: 'step', scale: 1, z: -3000 }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.saveState(); // Estado inicial
        this.updatePreview();
        this.updateSlideCounter();
        this.updateUndoRedoButtons();
        
        // Hacer accesible para el iframe
        window.impressCreator = this;
        
        // Escuchar mensajes del iframe
        window.addEventListener('message', (e) => {
            if (e.data.type === 'slideChange') {
                this.currentSlide = e.data.slide;
                this.updateSlideList();
                this.loadSlideData();
                this.updateSlideCounter();
            }
        });
    }

    bindEvents() {
        document.getElementById('add-slide').addEventListener('click', () => this.addSlide());
        document.getElementById('slide-content').addEventListener('input', (e) => this.updateSlideContent(e.target.value));
        document.getElementById('pos-x').addEventListener('input', (e) => this.updateSlideProperty('x', parseInt(e.target.value)));
        document.getElementById('pos-y').addEventListener('input', (e) => this.updateSlideProperty('y', parseInt(e.target.value)));
        document.getElementById('pos-z').addEventListener('input', (e) => this.updateSlideProperty('z', parseInt(e.target.value)));
        document.getElementById('rotation').addEventListener('input', (e) => this.updateSlideProperty('rotation', parseInt(e.target.value)));
        document.getElementById('rotate-x').addEventListener('input', (e) => this.updateSlideProperty('rotateX', parseInt(e.target.value)));
        document.getElementById('rotate-y').addEventListener('input', (e) => this.updateSlideProperty('rotateY', parseInt(e.target.value)));
        document.getElementById('scale').addEventListener('input', (e) => this.updateSlideProperty('scale', parseFloat(e.target.value)));
        document.getElementById('autoplay').addEventListener('input', (e) => this.updateSlideProperty('autoplay', parseInt(e.target.value)));
        document.getElementById('slide-type').addEventListener('change', (e) => this.updateSlideProperty('type', e.target.value));
        document.getElementById('prev-slide').addEventListener('click', () => this.prevSlide());
        document.getElementById('next-slide').addEventListener('click', () => this.nextSlide());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadPresentation());
        document.getElementById('load-demo').addEventListener('click', () => this.loadDemo());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());
        document.getElementById('background-image').addEventListener('change', (e) => this.handleBackgroundImage(e));
        document.getElementById('remove-background').addEventListener('click', () => this.removeBackground());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('slide-item')) {
                this.selectSlide(parseInt(e.target.dataset.slide));
            }
            if (e.target.classList.contains('delete-slide')) {
                e.stopPropagation();
                this.deleteSlide(parseInt(e.target.parentElement.dataset.slide));
            }
            if (e.target.classList.contains('effect-btn')) {
                this.applyEffect(e.target.dataset.effect);
            }
        });
    }

    addSlide() {
        const newSlide = {
            id: this.slides.length,
            content: `Diapositiva ${this.slides.length + 1}`,
            x: this.slides.length * 1000,
            y: 0,
            z: 0,
            rotation: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            type: 'slide',
            effect: 'slide',
            autoplay: 0
        };
        this.slides.push(newSlide);
        this.saveState();
        
        // Microanimación al agregar
        const addButton = document.getElementById('add-slide');
        addButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addButton.style.transform = 'scale(1)';
        }, 150);
        
        this.renderSlideList();
        this.selectSlide(newSlide.id);
    }

    deleteSlide(slideId) {
        if (this.slides.length <= 1) return;
        
        // Microanimación antes de eliminar
        const slideElement = document.querySelector(`[data-slide="${slideId}"]`);
        if (slideElement) {
            slideElement.style.transform = 'scale(0.8)';
            slideElement.style.opacity = '0.5';
            setTimeout(() => {
                this.slides.splice(slideId, 1);
                this.slides.forEach((slide, index) => slide.id = index);
                if (this.currentSlide >= this.slides.length) {
                    this.currentSlide = this.slides.length - 1;
                }
                this.saveState();
                this.renderSlideList();
                this.loadSlideData();
                this.updatePreview();
                this.updateSlideCounter();
            }, 200);
        } else {
            this.slides.splice(slideId, 1);
            this.slides.forEach((slide, index) => slide.id = index);
            if (this.currentSlide >= this.slides.length) {
                this.currentSlide = this.slides.length - 1;
            }
            this.saveState();
            this.renderSlideList();
            this.loadSlideData();
            this.updatePreview();
            this.updateSlideCounter();
        }
    }

    selectSlide(slideId) {
        this.currentSlide = slideId;
        this.loadSlideData();
        this.updateSlideList();
        this.updatePreview();
        this.updateSlideCounter();
    }

    loadSlideData() {
        const slide = this.slides[this.currentSlide];
        document.getElementById('slide-content').value = slide.content;
        document.getElementById('pos-x').value = slide.x;
        document.getElementById('pos-y').value = slide.y;
        document.getElementById('pos-z').value = slide.z;
        document.getElementById('rotation').value = slide.rotation;
        document.getElementById('rotate-x').value = slide.rotateX;
        document.getElementById('rotate-y').value = slide.rotateY;
        document.getElementById('scale').value = slide.scale;
        document.getElementById('autoplay').value = slide.autoplay;
        document.getElementById('slide-type').value = slide.type;
        this.updateEffectButtons(slide.effect);
    }

    updateSlideContent(content) {
        this.slides[this.currentSlide].content = content;
        this.saveStateDebounced();
        this.updatePreview();
        this.renderSlideList();
    }

    updateSlideProperty(property, value) {
        this.slides[this.currentSlide][property] = value;
        this.saveStateDebounced();
        this.updatePreview();
    }

    renderSlideList() {
        const container = document.getElementById('slides-container');
        container.innerHTML = this.slides.map((slide, index) => `
            <div class="slide-item fade-in ${index === this.currentSlide ? 'active' : ''}" data-slide="${index}" draggable="true">
                <span>Diapositiva ${index + 1}</span>
                <button class="delete-slide"><i data-feather="x"></i></button>
            </div>
        `).join('');
        
        // Reinicializar iconos de Feather
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Agregar eventos de drag & drop
        this.initDragAndDrop();
    }

    updateSlideList() {
        document.querySelectorAll('.slide-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSlide);
        });
    }

    prevSlide() {
        const iframe = document.getElementById('preview-frame');
        try {
            if (iframe.contentWindow && iframe.contentWindow.impressAPI) {
                iframe.contentWindow.impressAPI.prev();
            } else if (this.currentSlide > 0) {
                this.selectSlide(this.currentSlide - 1);
            }
        } catch (e) {
            if (this.currentSlide > 0) {
                this.selectSlide(this.currentSlide - 1);
            }
        }
    }

    nextSlide() {
        const iframe = document.getElementById('preview-frame');
        try {
            if (iframe.contentWindow && iframe.contentWindow.impressAPI) {
                iframe.contentWindow.impressAPI.next();
            } else if (this.currentSlide < this.slides.length - 1) {
                this.selectSlide(this.currentSlide + 1);
            }
        } catch (e) {
            if (this.currentSlide < this.slides.length - 1) {
                this.selectSlide(this.currentSlide + 1);
            }
        }
    }

    syncPreviewSlide() {
        const iframe = document.getElementById('preview-frame');
        try {
            if (iframe.contentWindow && iframe.contentWindow.impressAPI) {
                iframe.contentWindow.impressAPI.goto(this.currentSlide);
            }
        } catch (e) {
            console.log('Error sincronizando preview:', e);
        }
    }

    updateSlideCounter() {
        document.getElementById('slide-counter').textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
    }

    updatePreview() {
        // Optimización: evitar actualizaciones muy frecuentes
        const now = Date.now();
        if (now - this.lastUpdateTime < 100) {
            if (this.updateTimeout) clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => this.updatePreview(), 100);
            return;
        }
        this.lastUpdateTime = now;
        
        const html = this.generateHTML();
        
        // Cache simple para evitar regenerar HTML idéntico
        if (this.previewCache === html) return;
        this.previewCache = html;
        
        const iframe = document.getElementById('preview-frame');
        const previewContainer = document.querySelector('.preview-container');
        
        // Microanimación de carga
        previewContainer.classList.add('loading');
        
        iframe.srcdoc = html;
        
        // Inicializar impress.js cuando el iframe esté listo
        iframe.onload = () => {
            setTimeout(() => {
                try {
                    const iframeWindow = iframe.contentWindow;
                    if (iframeWindow && iframeWindow.impressAPI) {
                        // Ir a la diapositiva actual
                        iframeWindow.impressAPI.goto(this.currentSlide);
                    }
                } catch (e) {
                    console.log('Error sincronizando diapositiva inicial:', e);
                }
                previewContainer.classList.remove('loading');
            }, 800);
        };
    }
    
    initializeImpress(iframe, iframeDoc) {
        try {
            // Asegurar que el DOM esté listo
            if (iframeDoc.readyState !== 'complete') {
                iframe.contentWindow.addEventListener('load', () => {
                    this.initializeImpress(iframe, iframeDoc);
                });
                return;
            }
            
            if (iframe.contentWindow.impress) {
                // Remover clase de no soportado antes de inicializar
                iframeDoc.body.classList.remove('impress-not-supported');
                iframeDoc.body.classList.add('impress-supported');
                
                const api = iframe.contentWindow.impress();
                api.init();
                
                // Ir a la diapositiva actual
                setTimeout(() => {
                    if (iframe.contentWindow.impress) {
                        iframe.contentWindow.impress().goto(this.currentSlide);
                    }
                }, 200);
            }
        } catch (e) {
            console.log('Error inicializando impress:', e);
        }
    }

    applyEffect(effect) {
        const preset = this.effectPresets[effect];
        if (preset) {
            const slide = this.slides[this.currentSlide];
            slide.effect = effect;
            if (preset.scale !== undefined) slide.scale = preset.scale;
            if (preset.rotation !== undefined) slide.rotation = preset.rotation;
            if (preset.z !== undefined) slide.z = preset.z;
            this.saveState();
            this.loadSlideData();
            this.updatePreview();
        }
    }

    updateEffectButtons(activeEffect) {
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.effect === activeEffect);
        });
    }

    generateHTML() {
        const slidesHTML = this.slides.map((slide, index) => {
            const preset = this.effectPresets[slide.effect] || this.effectPresets.slide;
            const dataAttrs = [
                `data-x="${slide.x}"`,
                `data-y="${slide.y}"`,
                slide.z !== 0 ? `data-z="${slide.z}"` : '',
                slide.rotation !== 0 ? `data-rotate="${slide.rotation}"` : '',
                slide.rotateX !== 0 ? `data-rotate-x="${slide.rotateX}"` : '',
                slide.rotateY !== 0 ? `data-rotate-y="${slide.rotateY}"` : '',
                slide.scale !== 1 ? `data-scale="${slide.scale}"` : '',
                slide.autoplay > 0 ? `data-autoplay="${slide.autoplay}"` : ''
            ].filter(Boolean).join(' ');

            return `
                <div id="slide-${index}" class="${preset.classes}" ${dataAttrs}>
                    ${this.formatContent(slide.content)}
                </div>
            `;
        }).join('');

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1024">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Mi Presentación</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|PT+Sans:400,700,400italic,700italic|PT+Serif:400,700,400italic,700italic" rel="stylesheet">
    <style>
        html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video { margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; }
        body { font-family: 'PT Sans', sans-serif; min-height: 740px; background: radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190)); ${this.backgroundImage ? `background-image: url('${this.backgroundImage}'); background-size: cover; background-position: center; background-attachment: fixed;` : ''} }
        b, strong { font-weight: bold; }
        i, em { font-style: italic; }
        a { color: inherit; text-decoration: none; padding: 0 0.1em; background: rgba(255,255,255,0.5); text-shadow: -1px -1px 2px rgba(100,100,100,0.9); border-radius: 0.2em; transition: 0.5s; }
        a:hover, a:focus { background: rgba(255,255,255,1); text-shadow: -1px -1px 2px rgba(100,100,100,0.5); }
        .fallback-message { font-family: sans-serif; line-height: 1.3; width: 780px; padding: 10px 10px 0; margin: 20px auto; border: 1px solid #E4C652; border-radius: 10px; background: #EEDC94; }
        .fallback-message p { margin-bottom: 10px; }
        .impress-supported .fallback-message { display: none; }
        .impress-enabled .fallback-message { display: none; }
        .step { position: relative; width: 900px; padding: 40px; margin: 20px auto; box-sizing: border-box; font-family: 'PT Serif', georgia, serif; font-size: 48px; line-height: 1.5; }
        .impress-enabled .step { margin: 0; opacity: 0.3; transition: opacity 1s; }
        .impress-enabled .step.active { opacity: 1; }
        .slide { display: block; width: 900px; height: 700px; padding: 40px 60px; background-color: white; border: 1px solid rgba(0, 0, 0, .3); border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, .1); color: rgb(102, 102, 102); text-shadow: 0 2px 2px rgba(0, 0, 0, .1); font-family: 'Open Sans', Arial, sans-serif; font-size: 30px; line-height: 36px; letter-spacing: -1px; }
        .slide q { display: block; font-size: 50px; line-height: 72px; margin-top: 100px; }
        .slide q strong { white-space: nowrap; }
        h1, h2 { color: rgb(75, 75, 75); text-shadow: 0 2px 2px rgba(0, 0, 0, .1); }
        h1 { font-size: 190px; }
        h2 { font-size: 120px; }
        p { margin: 20px 0; color: rgb(75, 75, 75); }
        li { margin: 40px 0; }
        .try { font-weight: bold; color: rgb(75, 75, 75); text-shadow: 0 2px 2px rgba(0, 0, 0, .1); }
        .footnote { font-size: 32px; }
        .thoughts { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .positioning, .rotating, .scaling { transition: 0.5s; }
        .present .positioning { transform: translateY(-10px); }
        .present .rotating { transform: rotate(-10deg); transition-delay: 0.25s; }
        .present .scaling { transform: scale(1.2); transition-delay: 0.5s; }
        .imagination { color: rgb(78, 201, 176); }
        .imagination .rotating { color: rgb(255, 62, 0); }
        .have { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .you { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .noticed { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .its { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .in { color: rgb(255, 255, 255); background: rgb(75, 75, 75); padding: 2px 4px; border-radius: 2px; }
        .present .have { transition-delay: 1s; }
        .present .you { transition-delay: 1.5s; }
        .present .noticed { transition-delay: 2s; }
        .present .its { transition-delay: 2.5s; }
        .present .in { transition-delay: 3s; }
    </style>
</head>
<body class="impress-not-supported">
    <div class="fallback-message">
        <p>Tu navegador <b>no soporta las características requeridas</b> por impress.js.</p>
        <p>Para la mejor experiencia usa <b>Chrome</b>, <b>Safari</b> o <b>Firefox</b>.</p>
    </div>
    <div id="impress" data-transition-duration="1000" data-width="1024" data-height="768" data-max-scale="3" data-min-scale="0" data-perspective="1000">
        ${slidesHTML}
    </div>
    <script src="https://cdn.jsdelivr.net/gh/impress/impress.js@2.0.0/js/impress.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                if (typeof impress !== 'undefined') {
                    try {
                        window.impressAPI = impress();
                        window.impressAPI.init();
                        
                        document.body.classList.remove('impress-not-supported');
                        document.body.classList.add('impress-supported');
                        
                        // Navegación con teclado
                        document.addEventListener('keydown', function(e) {
                            if (e.keyCode === 37 || e.keyCode === 38) {
                                window.impressAPI.prev();
                                e.preventDefault();
                            } else if (e.keyCode === 39 || e.keyCode === 40) {
                                window.impressAPI.next();
                                e.preventDefault();
                            }
                        });
                        
                        // Comunicar cambios al padre
                        document.addEventListener('impress:stepenter', function(e) {
                            if (window.parent && window.parent.postMessage) {
                                const stepId = e.target.id.replace('slide-', '');
                                window.parent.postMessage({type: 'slideChange', slide: parseInt(stepId)}, '*');
                            }
                        });
                        
                        // Ir a la diapositiva inicial
                        setTimeout(function() {
                            if (window.parent && window.parent.impressCreator) {
                                window.impressAPI.goto(window.parent.impressCreator.currentSlide);
                            }
                        }, 100);
                        
                    } catch(e) {
                        console.log('Error inicializando impress:', e);
                    }
                }
            }, 100);
        });
    </script>
</body>
</html>
        `;
    }

    formatContent(content) {
        if (content.includes('\n\n')) {
            const parts = content.split('\n\n');
            return `<h1>${parts[0]}</h1><p>${parts.slice(1).join('</p><p>')}</p>`;
        }
        if (content.startsWith('#')) {
            return `<h1>${content.substring(1).trim()}</h1>`;
        }
        if (content.includes('**')) {
            return `<p>${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
        }
        return `<q>${content}</q>`;
    }

    loadDemo() {
        this.slides = [
            {
                id: 0,
                content: '¿No estás **aburrido** de todas esas presentaciones basadas en diapositivas?',
                x: -1000, y: -1500, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 1,
                type: 'slide', effect: 'slide', autoplay: 10
            },
            {
                id: 1,
                content: '¿No crees que las presentaciones en **navegadores modernos** no deberían **copiar las limitaciones** de las diapositivas clásicas?',
                x: 0, y: -1500, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 1,
                type: 'slide', effect: 'slide', autoplay: 0
            },
            {
                id: 2,
                content: '¿Te gustaría **impresionar a tu audiencia** con **visualizaciones impactantes** de tu charla?',
                x: 1000, y: -1500, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 1,
                type: 'slide', effect: 'slide', autoplay: 0
            },
            {
                id: 3,
                content: 'entonces deberías probar\n\nimpress.js\n\n* sin rima intencionada',
                x: 0, y: 0, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 4,
                type: 'step', effect: 'zoom', autoplay: 0
            },
            {
                id: 4,
                content: 'Es una **herramienta de presentación** inspirada en la idea detrás de prezi.com y basada en el **poder de las transformaciones y transiciones CSS3** en navegadores modernos.',
                x: 850, y: 3000, z: 0, rotation: 90, rotateX: 0, rotateY: 0, scale: 5,
                type: 'step', effect: 'rotate', autoplay: 0
            },
            {
                id: 5,
                content: 'visualiza tus **grandes** pensamientos',
                x: 3500, y: 2100, z: 0, rotation: 180, rotateX: 0, rotateY: 0, scale: 6,
                type: 'step', effect: 'big', autoplay: 0
            },
            {
                id: 6,
                content: 'y **pequeñas** ideas',
                x: 2825, y: 2325, z: -3000, rotation: 300, rotateX: 0, rotateY: 0, scale: 1,
                type: 'step', effect: 'tiny', autoplay: 0
            },
            {
                id: 7,
                content: 'mediante **posicionamiento**, **rotación** y **escalado** en un lienzo infinito',
                x: 3500, y: -850, z: 0, rotation: 270, rotateX: 0, rotateY: 0, scale: 6,
                type: 'step', effect: 'big', autoplay: 0
            },
            {
                id: 8,
                content: 'el único **límite** es tu **imaginación**',
                x: 6700, y: -300, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 6,
                type: 'step', effect: 'big', autoplay: 0
            },
            {
                id: 9,
                content: '¿quieres saber más?\n\n¡usa el código fuente, Luke!',
                x: 6300, y: 2000, z: 0, rotation: 20, rotateX: 0, rotateY: 0, scale: 4,
                type: 'step', effect: 'zoom', autoplay: 0
            },
            {
                id: 10,
                content: 'una cosa más...',
                x: 6000, y: 4000, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 2,
                type: 'step', effect: 'zoom', autoplay: 0
            },
            {
                id: 11,
                content: '¿has notado que está en **3D**?\n\n* supera eso, prezi ;)',
                x: 6200, y: 4300, z: -100, rotation: 0, rotateX: -40, rotateY: 10, scale: 2,
                type: 'step', effect: '3d', autoplay: 0
            },
            {
                id: 12,
                content: 'Vista General',
                x: 3000, y: 1500, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 10,
                type: 'step', effect: 'zoom', autoplay: 0
            }
        ];
        this.currentSlide = 0;
        this.saveState();
        this.renderSlideList();
        this.loadSlideData();
        this.updatePreview();
        this.updateSlideCounter();
    }

    saveState() {
        const state = {
            slides: JSON.parse(JSON.stringify(this.slides)),
            currentSlide: this.currentSlide,
            backgroundImage: this.backgroundImage
        };
        
        // Remover estados futuros si estamos en el medio del historial
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limitar el tamaño del historial
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateUndoRedoButtons();
    }
    
    saveStateDebounced() {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.saveState(), 500);
    }
    
    undo() {
        if (this.historyIndex > 0) {
            // Microanimación de undo
            const undoBtn = document.getElementById('undo-btn');
            undoBtn.style.transform = 'scale(0.9) rotate(-15deg)';
            setTimeout(() => {
                undoBtn.style.transform = 'scale(1) rotate(0deg)';
            }, 150);
            
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            // Microanimación de redo
            const redoBtn = document.getElementById('redo-btn');
            redoBtn.style.transform = 'scale(0.9) rotate(15deg)';
            setTimeout(() => {
                redoBtn.style.transform = 'scale(1) rotate(0deg)';
            }, 150);
            
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }
    
    restoreState(state) {
        this.slides = JSON.parse(JSON.stringify(state.slides));
        this.currentSlide = state.currentSlide;
        this.backgroundImage = state.backgroundImage;
        
        this.renderSlideList();
        this.loadSlideData();
        this.updatePreview();
        this.updateSlideCounter();
        this.updateUndoRedoButtons();
        
        // Actualizar input de background
        if (!this.backgroundImage) {
            document.getElementById('background-image').value = '';
        }
    }
    
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        undoBtn.disabled = this.historyIndex <= 0;
        redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    handleBackgroundImage(event) {
        const file = event.target.files[0];
        if (file) {
            // Optimización: usar URL.createObjectURL para archivos grandes
            if (file.size > 1024 * 1024) { // > 1MB
                this.backgroundImage = URL.createObjectURL(file);
                this.saveState();
                this.updatePreview();
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.backgroundImage = e.target.result;
                    this.saveState();
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    removeBackground() {
        this.backgroundImage = null;
        document.getElementById('background-image').value = '';
        this.saveState();
        this.updatePreview();
    }

    clearAll() {
        this.slides = [{
            id: 0,
            content: 'Mi primera diapositiva',
            x: 0, y: 0, z: 0, rotation: 0, rotateX: 0, rotateY: 0, scale: 1,
            type: 'slide', effect: 'slide', autoplay: 0
        }];
        this.backgroundImage = null;
        document.getElementById('background-image').value = '';
        this.currentSlide = 0;
        this.saveState();
        this.renderSlideList();
        this.loadSlideData();
        this.updatePreview();
        this.updateSlideCounter();
    }

    initDragAndDrop() {
        const slideItems = document.querySelectorAll('.slide-item');
        
        slideItems.forEach((item, index) => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            });
            
            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                
                const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const targetIndex = index;
                
                if (draggedIndex !== targetIndex) {
                    this.reorderSlides(draggedIndex, targetIndex);
                }
            });
        });
    }
    
    reorderSlides(fromIndex, toIndex) {
        const slide = this.slides.splice(fromIndex, 1)[0];
        this.slides.splice(toIndex, 0, slide);
        
        // Actualizar IDs
        this.slides.forEach((slide, index) => slide.id = index);
        
        // Ajustar currentSlide si es necesario
        if (this.currentSlide === fromIndex) {
            this.currentSlide = toIndex;
        } else if (fromIndex < this.currentSlide && toIndex >= this.currentSlide) {
            this.currentSlide--;
        } else if (fromIndex > this.currentSlide && toIndex <= this.currentSlide) {
            this.currentSlide++;
        }
        
        this.saveState();
        this.renderSlideList();
        this.updatePreview();
        this.updateSlideCounter();
    }
    
    toggleTheme() {
        this.isNordicTheme = !this.isNordicTheme;
        const body = document.body;
        const themeBtn = document.getElementById('theme-toggle');
        
        if (this.isNordicTheme) {
            body.classList.add('nordic-theme');
            themeBtn.innerHTML = '<i data-feather="moon"></i>Tema Actual';
        } else {
            body.classList.remove('nordic-theme');
            themeBtn.innerHTML = '<i data-feather="sun"></i>Diseño Nórdico';
        }
        
        // Actualizar iconos
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    downloadPresentation() {
        const downloadBtn = document.getElementById('download-btn');
        
        // Microanimación de éxito
        downloadBtn.classList.add('success-animation');
        setTimeout(() => {
            downloadBtn.classList.remove('success-animation');
        }, 600);
        
        let html = this.generateHTML();
        // Agregar script de inicialización al final del body
        html = html.replace('</body>', `    <script src="https://cdn.jsdelivr.net/gh/impress/impress.js@2.0.0/js/impress.js"></script>
    <script>impress().init();</script>
</body>`);
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi-presentacion.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}

new ImpressCreator();