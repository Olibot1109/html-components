// HTML Components Library - Fixed Version
// Create entire websites from JavaScript component definitions
// Supports dynamic image loading, component registries, and page building

(function() {
    'use strict';

    // ===== Notification System =====
    const notificationSystem = {
        container: null,
        notificationPool: [],
        maxPoolSize: 5,

        init: function() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'html-components-notifications';
                this.container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                `;
                document.body.appendChild(this.container);
            }
        },

        getNotification: function() {
            return this.notificationPool.length > 0 ? this.notificationPool.pop() : document.createElement('div');
        },

        releaseNotification: function(notification) {
            if (this.notificationPool.length < this.maxPoolSize) {
                notification.style.cssText = '';
                notification.innerHTML = '';
                notification.className = '';
                this.notificationPool.push(notification);
            }
        },

        checkContainerRemoval: function() {
            if (this.container && this.container.children.length === 0 && this.container.parentElement) {
                this.container.remove();
                this.container = null;
            }
        },

        show: function(type, title, message, details = null, suggestions = []) {
            this.init();
            const notification = this.getNotification();
            
            const colors = {
                error: { border: '#dc3545', bg: '#f8d7da', text: '#721c24' },
                warning: { border: '#ffc107', bg: '#fff3cd', text: '#856404' },
                info: { border: '#007bff', bg: '#d1ecf1', text: '#0c5460' }
            };
            const c = colors[type] || colors.info;

            notification.style.cssText = `
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-left: 4px solid ${c.border};
                margin-bottom: 10px;
                overflow: hidden;
                animation: slideIn 0.3s ease-out;
            `;

            notification.innerHTML = `
                <div style="background: ${c.bg}; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: ${c.text}; margin: 0; font-size: 14px;">${title}</strong>
                    <button onclick="this.parentElement.parentElement.remove(); window.HTMLComponents._checkNotificationContainer()" 
                            style="background: none; border: none; font-size: 18px; cursor: pointer; color: ${c.text}; padding: 0; line-height: 1;">×</button>
                </div>
                <div style="padding: 16px;">
                    <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">${message}</p>
                    ${details ? `<details style="margin-top: 10px;"><summary style="cursor: pointer; color: #666; font-size: 12px;">Technical Details</summary><pre style="background: #f8f9fa; padding: 8px; border-radius: 4px; font-size: 11px; margin-top: 5px; overflow-x: auto; color: #666;">${details}</pre></details>` : ''}
                    ${suggestions.length > 0 ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;"><strong style="font-size: 12px; color: #666;">Suggestions:</strong><ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px; color: #666;">${suggestions.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                </div>
            `;

            this.container.appendChild(notification);

            if (type !== 'error') {
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.style.animation = 'slideOut 0.3s ease-in';
                        setTimeout(() => {
                            notification.remove();
                            this.releaseNotification(notification);
                            this.checkContainerRemoval();
                        }, 300);
                    }
                }, 10000);
            }
        },

        error: function(message, error, suggestions = []) {
            const details = error ? `${error.name}: ${error.message}` : null;
            this.show('error', 'Component Error', message, details, suggestions);
        },

        warning: function(message, suggestions = []) {
            this.show('warning', 'Component Warning', message, null, suggestions);
        },

        info: function(message) {
            this.show('info', 'Component Info', message);
        }
    };

    // ===== Logger =====
    const logger = {
        LEVELS: { DEBUG: 0, INFO: 1, SUCCESS: 2, WARN: 3, ERROR: 4, NONE: 5 },
        currentLevel: 1,
        debugMode: false,
        timers: new Map(),
        logHistory: [],
        maxHistorySize: 50,

        enableDebug: function() {
            this.debugMode = true;
            this.currentLevel = 0;
        },

        disableDebug: function() {
            this.debugMode = false;
            this.currentLevel = 1;
        },

        setLevel: function(level) {
            if (typeof level === 'string' && this.LEVELS[level.toUpperCase()] !== undefined) {
                this.currentLevel = this.LEVELS[level.toUpperCase()];
            } else if (typeof level === 'number' && level >= 0 && level <= 5) {
                this.currentLevel = level;
            }
        },

        shouldLog: function(level) {
            return this.LEVELS[level.toUpperCase()] >= this.currentLevel;
        },

        formatMessage: function(level, message, data) {
            const log = {
                timestamp: new Date().toISOString(),
                level: level.toUpperCase(),
                message,
                data: data || null
            };
            
            this.logHistory.push(log);
            if (this.logHistory.length > this.maxHistorySize) {
                this.logHistory.shift();
            }
            
            return log;
        },

        log: function(message, data) {
            if (!this.shouldLog('DEBUG')) return;
            const log = this.formatMessage('DEBUG', message, data);
            console.debug(`[HTML Components] ${log.message}`, log.data || '');
        },

        info: function(message, data) {
            if (!this.shouldLog('INFO')) return;
            const log = this.formatMessage('INFO', message, data);
            console.info(`[HTML Components] ${log.message}`, log.data || '');
        },

        success: function(message, data) {
            if (!this.shouldLog('SUCCESS')) return;
            const log = this.formatMessage('SUCCESS', message, data);
            console.log(`[HTML Components] ✓ ${log.message}`, log.data || '');
        },

        warn: function(message, data) {
            if (!this.shouldLog('WARN')) return;
            const log = this.formatMessage('WARN', message, data);
            console.warn(`[HTML Components] ${log.message}`, log.data || '');
            notificationSystem.warning(message, ['Check the browser console for details']);
        },

        error: function(message, error) {
            if (!this.shouldLog('ERROR')) return;
            const log = this.formatMessage('ERROR', message, { error: error?.message });
            console.error(`[HTML Components] ${log.message}`, error || '');
            notificationSystem.error(message, error);
        },

        startTimer: function(label) {
            this.timers.set(label, performance.now());
        },

        endTimer: function(label) {
            const start = this.timers.get(label);
            if (start) {
                const duration = performance.now() - start;
                this.timers.delete(label);
                return duration;
            }
            return null;
        },

        getHistory: function(level) {
            return level ? this.logHistory.filter(log => log.level === level.toUpperCase()) : [...this.logHistory];
        },

        clearHistory: function() {
            this.logHistory = [];
        }
    };

    // ===== Caching System =====
    const pageCache = {
        enabled: true,
        cache: new Map(),

        set: function(key, content) {
            if (this.enabled) {
                this.cache.set(key, { content, timestamp: Date.now() });
            }
        },

        get: function(key) {
            return this.enabled && this.cache.has(key) ? this.cache.get(key).content : null;
        },

        clear: function() {
            this.cache.clear();
        },

        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; }
    };

    const fileCache = {
        enabled: true,
        cache: new Map(),

        set: function(key, content) {
            if (this.enabled) {
                this.cache.set(key, { content, timestamp: Date.now() });
            }
        },

        get: function(key) {
            return this.enabled && this.cache.has(key) ? this.cache.get(key).content : null;
        },

        clear: function() {
            this.cache.clear();
        },

        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; }
    };

    // ===== Image Loading =====
    const imageLoader = {
        cache: new Map(),

        load: function(src, options = {}) {
            return new Promise((resolve, reject) => {
                if (this.cache.has(src)) {
                    resolve(this.cache.get(src));
                    return;
                }

                const img = new Image();
                if (options.crossOrigin) img.crossOrigin = options.crossOrigin;

                img.onload = () => {
                    this.cache.set(src, img);
                    resolve(img);
                };

                img.onerror = () => {
                    reject(new Error(`Failed to load image: ${src}`));
                };

                img.src = src;
            });
        },

        preload: function(sources) {
            const promises = sources.map(src => 
                this.load(src).catch(() => null)
            );
            return Promise.allSettled(promises);
        }
    };

    // ===== Component Loader =====
    const loadingComponents = new Set();
    const executedScripts = new Map();

    function loadComponentIntoElement(element, componentPath, props = {}) {
        if (loadingComponents.has(componentPath)) {
            return Promise.resolve();
        }

        loadingComponents.add(componentPath);
        logger.startTimer(`load-${componentPath}`);

        const cachedContent = fileCache.get(componentPath);
        if (cachedContent) {
            element.innerHTML = processTemplate(cachedContent, props);
            bindEventHandlers(element);
            return loadNestedComponents(element).then(() => {
                executeScripts(element);
                loadingComponents.delete(componentPath);
                logger.endTimer(`load-${componentPath}`);
                return cachedContent;
            });
        }

        return fetch(componentPath)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                return response.text();
            })
            .then(html => {
                html = processTemplate(html, props);
                fileCache.set(componentPath, html);
                element.innerHTML = html;
                bindEventHandlers(element);
                
                return loadNestedComponents(element).then(() => {
                    executeScripts(element);
                    loadingComponents.delete(componentPath);
                    logger.endTimer(`load-${componentPath}`);
                    return html;
                });
            })
            .catch(error => {
                loadingComponents.delete(componentPath);
                logger.error(`Failed to load component "${componentPath}"`, error);
                element.innerHTML = `<div style="color: red; padding: 1rem; border: 1px solid red; background: #ffe6e6;">
                    <strong>Component Load Error:</strong> ${componentPath}<br>
                    <small>${error.message}</small>
                </div>`;
                throw error;
            });
    }

    function loadNestedComponents(container) {
        const nestedCSS = container.querySelectorAll('[data-css]');
        const cssPromises = Array.from(nestedCSS).map(el => {
            const cssPath = el.getAttribute('data-css');
            return cssPath ? loadCSS(cssPath).catch(() => null) : Promise.resolve();
        });

        const nestedComponents = container.querySelectorAll('[data-component]');
        const componentPromises = Array.from(nestedComponents).map(el => {
            const path = el.getAttribute('data-component');
            return path ? loadComponentIntoElement(el, path).catch(() => null) : Promise.resolve();
        });

        return Promise.allSettled([...cssPromises, ...componentPromises]);
    }

    // ===== Event Binding =====
    const supportedEvents = {
        'click': 'data-click',
        'dblclick': 'data-dblclick',
        'mouseenter': 'data-mouseenter',
        'mouseleave': 'data-mouseleave',
        'focus': 'data-focus',
        'blur': 'data-blur',
        'change': 'data-change',
        'input': 'data-input',
        'submit': 'data-submit',
        'keydown': 'data-keydown',
        'keyup': 'data-keyup'
    };

    function bindEventHandlers(container) {
        const selector = Object.values(supportedEvents).map(attr => `[${attr}]`).join(', ');
        const elements = container.querySelectorAll(selector);

        elements.forEach(element => {
            Object.entries(supportedEvents).forEach(([eventType, dataAttr]) => {
                const methodName = element.getAttribute(dataAttr);
                if (methodName && !element.dataset[`bound_${eventType}`]) {
                    element.addEventListener(eventType, function(event) {
                        if (typeof window[methodName] === 'function') {
                            try {
                                window[methodName](event, element);
                            } catch (error) {
                                logger.error(`Error executing ${methodName}`, error);
                                event.preventDefault();
                            }
                        } else {
                            logger.error(`Method ${methodName} not found`);
                        }
                    });
                    element.dataset[`bound_${eventType}`] = 'true';
                }
            });
        });
    }

    // ===== Template Processing =====
    function processTemplate(template, props) {
        if (!props || Object.keys(props).length === 0) return template;

        let result = template;
        Object.entries(props).forEach(([key, value]) => {
            const stringValue = value == null ? '' : 
                typeof value === 'object' ? JSON.stringify(value) : String(value);
            result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), stringValue);
        });
        return result;
    }

    // ===== JavaScript Execution =====
    let jsEnabled = true;

    function executeScripts(container) {
        if (!jsEnabled) return;

        const scripts = container.querySelectorAll('script');
        if (scripts.length === 0) return;

        scripts.forEach(script => {
            if (script.src) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = false;
                document.head.appendChild(newScript);
            } else if (script.textContent.trim()) {
                try {
                    (0, eval)(script.textContent);
                } catch (e) {
                    logger.error('Error executing inline script', e);
                }
            }
        });
    }

    // ===== CSS Loading =====
    function loadCSS(href, options = {}) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                resolve(existing);
                return;
            }

            const cachedCSS = fileCache.get(href);
            if (cachedCSS) {
                const style = document.createElement('style');
                style.setAttribute('data-cached-css', href);
                style.textContent = cachedCSS;
                document.head.appendChild(style);
                resolve(style);
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
            if (options.media) link.media = options.media;

            link.onload = () => {
                fetch(href)
                    .then(r => r.ok ? r.text() : null)
                    .then(css => { if (css) fileCache.set(href, css); })
                    .catch(() => {});
                resolve(link);
            };

            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            document.head.appendChild(link);
        });
    }

    // ===== Initialization =====
    document.addEventListener('DOMContentLoaded', function() {
        const jsElements = document.querySelectorAll('[data-js]');
        const jsPromises = Array.from(jsElements).map(el => {
            const path = el.getAttribute('data-js');
            return path ? HTMLComponents.loadJS(path).catch(() => null) : Promise.resolve();
        });

        const cssElements = document.querySelectorAll('[data-css]');
        const cssPromises = Array.from(cssElements).map(el => {
            const path = el.getAttribute('data-css');
            return path ? loadCSS(path).catch(() => null) : Promise.resolve();
        });

        const components = document.querySelectorAll('[data-component]');
        const componentPromises = Array.from(components).map(el => {
            const path = el.getAttribute('data-component');
            return path ? loadComponentIntoElement(el, path) : Promise.resolve();
        });

        Promise.allSettled([...jsPromises, ...cssPromises, ...componentPromises]).then(() => {
            bindEventHandlers(document.body);
        });
    });

    // ===== Page Building =====
    function buildPageFromComponents(pageDef, targetElement = 'body', clearTarget = false) {
        logger.startTimer('build-page');
        
        const target = document.querySelector(targetElement);
        if (!target) {
            return Promise.reject(new Error('Target element not found'));
        }

        let components = Array.isArray(pageDef) ? pageDef : pageDef.components || [];
        let meta = {};

        if (!Array.isArray(pageDef)) {
            meta = {
                title: pageDef.title,
                description: pageDef.description,
                styles: pageDef.styles || []
            };
        }

        const cacheKey = pageDef.cacheKey || JSON.stringify(components).substring(0, 50);
        const cachedContent = pageCache.get(cacheKey);
        
        if (cachedContent) {
            target.innerHTML = cachedContent;
            return Promise.resolve([{ status: 'fulfilled', value: 'loaded-from-cache' }]);
        }

        if (clearTarget || target.innerHTML.trim() === '') {
            target.innerHTML = '';
        }

        if (meta.styles) {
            meta.styles.forEach(url => loadCSS(url).catch(() => {}));
        }

        if (meta.title) document.title = meta.title;
        
        if (meta.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = meta.description;
        }

        const promises = components.map(comp => processComponentDefinition(comp, target));

        return Promise.allSettled(promises).then(results => {
            logger.endTimer('build-page');
            pageCache.set(cacheKey, target.innerHTML);
            return results;
        });
    }

    function processComponentDefinition(comp, target) {
        if (typeof comp === 'string') {
            return loadComponentIntoElement(target, comp);
        }

        if (typeof comp !== 'object') return Promise.resolve();

        if (comp.condition !== undefined) {
            const result = typeof comp.condition === 'function' ? comp.condition() : comp.condition;
            if (!result) return Promise.resolve();
        }

        const { name, selector, props = {}, layout, children, css, id } = comp;
        let element = target;

        if (layout) {
            const layoutClass = typeof layout === 'string' ? layout : layout.class || '';
            const layoutId = typeof layout === 'string' ? '' : layout.id || '';
            const layoutTag = typeof layout === 'object' ? layout.tag || 'section' : 'section';

            element = document.createElement(layoutTag);
            element.className = layoutClass;
            if (layoutId) element.id = layoutId;
            target.appendChild(element);
        } else if (selector) {
            element = document.querySelector(selector) || target;
        }

        if (css) {
            const classes = typeof css === 'string' ? css.split(' ') : css;
            element.classList.add(...classes);
        }

        if (id) element.id = id;

        const processedProps = {};
        Object.entries(props).forEach(([key, value]) => {
            processedProps[key] = typeof value === 'function' ? value() : value;
        });

        const promise = loadComponentIntoElement(element, name, processedProps);

        if (children?.length) {
            return promise.then(() => {
                const childPromises = children.map(child => processComponentDefinition(child, element));
                return Promise.allSettled(childPromises);
            });
        }

        return promise;
    }

    // ===== Global API =====
    window.HTMLComponents = {
        loadComponent: function(selector, path, props = {}) {
            const el = document.querySelector(selector);
            return el ? loadComponentIntoElement(el, path, props) : 
                Promise.reject(new Error('Element not found'));
        },

        toggleComponent: function(selector, show = null) {
            const el = document.querySelector(selector);
            if (!el) return false;
            const isVisible = el.style.display !== 'none';
            const shouldShow = show !== null ? show : !isVisible;
            el.style.display = shouldShow ? '' : 'none';
            return shouldShow;
        },

        showComponent: function(sel) { return this.toggleComponent(sel, true); },
        hideComponent: function(sel) { return this.toggleComponent(sel, false); },

        loadJS: function(src) {
            return new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[data-loaded-js="${src}"]`);
                if (existing) {
                    resolve(existing);
                    return;
                }

                fetch(src)
                    .then(r => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))
                    .then(code => {
                        (0, eval)(code);
                        const marker = document.createElement('script');
                        marker.setAttribute('data-loaded-js', src);
                        marker.style.display = 'none';
                        document.head.appendChild(marker);
                        resolve(marker);
                    })
                    .catch(reject);
            });
        },

        loadCSS: loadCSS,
        loadImage: (src, opts) => imageLoader.load(src, opts),
        preloadImages: sources => imageLoader.preload(sources),
        buildPage: buildPageFromComponents,

        enablePageCache: () => pageCache.enable(),
        disablePageCache: () => pageCache.disable(),
        clearPageCache: () => pageCache.clear(),

        enableFileCache: () => fileCache.enable(),
        disableFileCache: () => fileCache.disable(),
        clearFileCache: () => fileCache.clear(),

        enableDebug: () => logger.enableDebug(),
        disableDebug: () => logger.disableDebug(),
        setLogLevel: level => logger.setLevel(level),

        _checkNotificationContainer: () => notificationSystem.checkContainerRemoval(),

        replaceComponent: function(selector, path, props = {}) {
            const element = document.querySelector(selector);
            if (!element) {
                return Promise.reject(new Error(`Element not found: ${selector}`));
            }
            return loadComponentIntoElement(element, path, props);
        }
    };

})();
