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
    var isRoot = pathname === '/' || pathname === '' || pathname === '/index.html' || pathname.slice(-11) === '/index.html';
    if (!isRoot) return;
    var locale = getPreferredLocale();
    var base = pathname.replace(/\/index\.html$/, '').replace(/\/?$/, '') || '/';
    var dir = base === '/' ? '' : base.slice(0, base.lastIndexOf('/') + 1);
    var newPath = (dir ? dir : '/') + locale + '/';
    if (pathname.indexOf('/' + locale + '/') === 0) return;
    window.location.replace(window.location.origin + newPath);
  }

  /**
   * Inicializa el selector de idioma: establece href del enlace al otro idioma
   * y marca el actual como activo. Usa pathname para mantener la misma página.
   */
  function initLangSwitcher() {
    var pathname = window.location.pathname || '';
    var isEn = pathname.indexOf('/en/') !== -1;
    var isEs = pathname.indexOf('/es/') !== -1;
    if (!isEn && !isEs) return;

    var current = isEn ? 'en' : 'es';
    var other = current === 'en' ? 'es' : 'en';
    var otherPath = pathname.replace(/\/(en|es)\//, '/' + other + '/');
    if (otherPath === pathname) {
      otherPath = '/' + other + '/';
    }

    var linkEs = document.querySelector('.lang-link-es');
    var linkEn = document.querySelector('.lang-link-en');
    if (linkEs) {
      // Siempre apunta a la versión ES de la misma página
      var esPath = pathname.replace(/\/(en|es)\//, '/es/');
      if (esPath === pathname && !isEs) esPath = '/es/';
      linkEs.href = esPath;
      linkEs.classList.toggle('is-active', current === 'es');
      linkEs.addEventListener('click', function () {
        setStoredLocale('es');
      });
    }
    if (linkEn) {
      // Siempre apunta a la versión EN de la misma página
      var enPath = pathname.replace(/\/(en|es)\//, '/en/');
      if (enPath === pathname && !isEn) enPath = '/en/';
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
