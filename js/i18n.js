/**
 * i18n: detección de idioma, redirect desde raíz y selector de idioma en nav.
 * Rutas: /en/* (inglés), /es/* (español). Raíz redirige según preferencia o navegador.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'monnet_locale';

  function getPreferredLocale() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch (e) {}
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (lang.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function setStoredLocale(locale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {}
  }

  /**
   * Redirige desde la raíz (index.html o /) a /es/ o /en/ según preferencia.
   * Llamar solo en la página raíz.
   */
  function redirectRootToLocale() {
    var pathname = window.location.pathname || '';
    // Solo considerar raíz cuando NO estamos ya en /en/... o /es/...
    var isLangPath = pathname.indexOf('/en/') === 0 || pathname.indexOf('/es/') === 0;
    var isRoot = !isLangPath && (pathname === '/' || pathname === '' || pathname === '/index.html' || pathname.slice(-11) === '/index.html');
    if (!isRoot) return;
    var locale = getPreferredLocale();
    var base = pathname.replace(/\/index\.html$/, '').replace(/\/?$/, '') || '/';
    var dir = base === '/' ? '' : base.slice(0, base.lastIndexOf('/') + 1);
    var newPath = (dir ? dir : '/') + locale + '/';
    if (pathname.indexOf('/' + locale + '/') === 0) return;
    window.location.replace(window.location.origin + newPath);
  }

  /**
   * Inicializa el selector de idioma: establece href de los enlaces ES/EN
   * y marca el actual como activo. Intenta mantener la misma página
   * cambiando solo el prefijo /es/ o /en/. Si la URL no lleva prefijo,
   * asume que la versión ES/EN vive bajo /es y /en respectivamente.
   */
  function initLangSwitcher() {
    var pathname = window.location.pathname || '';
    var isEn = pathname.indexOf('/en/') === 0;
    var isEs = pathname.indexOf('/es/') === 0;

    // Idioma actual: primero por prefijo en la URL, luego por atributo lang,
    // y por último por preferencia almacenada / navegador.
    var current;
    if (isEn) current = 'en';
    else if (isEs) current = 'es';
    else {
      var docLang = (document.documentElement && document.documentElement.lang || '').toLowerCase();
      if (docLang === 'es' || docLang === 'en') current = docLang;
      else current = getPreferredLocale();
    }

    var other = current === 'en' ? 'es' : 'en';

    var linkEs = document.querySelector('.lang-link-es');
    var linkEn = document.querySelector('.lang-link-en');
    if (linkEs) {
      // Siempre apunta a la versión ES de la misma página
      var esPath;
      if (pathname.match(/\/(en|es)\//)) {
        esPath = pathname.replace(/\/(en|es)\//, '/es/');
      } else {
        esPath = '/es' + (pathname.charAt(0) === '/' ? pathname : '/' + pathname);
      }
      linkEs.href = esPath;
      linkEs.classList.toggle('is-active', current === 'es');
      linkEs.addEventListener('click', function () {
        setStoredLocale('es');
      });
    }
    if (linkEn) {
      // Siempre apunta a la versión EN de la misma página
      var enPath;
      if (pathname.match(/\/(en|es)\//)) {
        enPath = pathname.replace(/\/(en|es)\//, '/en/');
      } else {
        enPath = '/en' + (pathname.charAt(0) === '/' ? pathname : '/' + pathname);
      }
      linkEn.href = enPath;
      linkEn.classList.toggle('is-active', current === 'en');
      linkEn.addEventListener('click', function () {
        setStoredLocale('en');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      redirectRootToLocale();
      initLangSwitcher();
    });
  } else {
    redirectRootToLocale();
    initLangSwitcher();
  }
})();
