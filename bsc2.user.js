// ==UserScript==
// @name         Кликер и удаление кнопок
// @version      1.1
// @namespace    Violentmonkey Scripts
// @author       KittenWoof
// @match        https://web.telegram.org/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ilfae/ilfae/main/logo.webp
// @updateURL    https://github.com/IlyasAtabaev731/bsc/raw/main/bsc2.user.js
// @downloadURL  https://github.com/IlyasAtabaev731/bsc/raw/main/bsc2.user.js
// @homepage     https://github.com/IlyasAtabaev731/bsc
// ==/UserScript==

(function() {
  'use strict';

  function waitForElement(selector, callback, timeout = 10000) {
      const startTime = Date.now();
      const interval = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
              clearInterval(interval);
              callback(element);
          }
          if (Date.now() - startTime > timeout) {
              clearInterval(interval);
          }
      }, 100);
  }

  function clickButton(selector) {
      waitForElement(selector, (button) => {
          if (button instanceof HTMLElement && button.offsetParent !== null) {
              button.click();
          }
      });
  }

  function performInitialClicks() {
      setTimeout(() => {
          clickButton('div.reply-markup-row button.rp');
          clickButton('button.popup-button.btn.primary.rp');
          clickButton('div.btn-menu-item.rp-overflow');
      }, 2000);
  }

  function performRepeatClicks() {
      clickButton('button.btn-icon._BrowserHeaderButton_m63td_65');
      setTimeout(() => {
          clickButton('button.popup-button.btn.danger.rp');
      }, 1000);
      setTimeout(() => {
          performInitialClicks();
      }, 2000);
  }

  function initialize() {
      performInitialClicks();
      setInterval(() => {
          performRepeatClicks();
      }, 600000);
  }

  window.addEventListener('load', () => {
      initialize();
  });
})();
