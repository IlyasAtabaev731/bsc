// ==UserScript==
// @name         Кликер и удаление кнопок
// @version      1.1
// @match        https://telegram.blum.codes/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const claimButtonSelector = 'button.kit-button.is-large.is-drop.is-fill.button.is-done';
  const startFarmingButtonSelector = 'button.kit-button.is-large.is-primary.is-fill.button';
  const reloadButtonSelector = 'button.reset';  // Добавляем новый селектор для кнопки "Обновить"
  const clickerIntervalMilliseconds = 300;

  function clickButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
    }
  }

  function startClicker() {
    setInterval(() => {
      clickButton(claimButtonSelector);
      clickButton(startFarmingButtonSelector);
      clickButton(reloadButtonSelector);  // Клик по кнопке "Обновить"
    }, clickerIntervalMilliseconds);
  }

  function removeTabsButtons() {
    const buttons = document.querySelectorAll('.layout-tabs.tabs a.tab');
    buttons.forEach(button => {
      const label = button.querySelector('.label');
      if (label && (label.textContent.trim() === 'Frens' || label.textContent.trim() === 'Tasks' || label.textContent.trim() === 'Wallet')) {
        button.parentNode.removeChild(button);
      }
    });
  }

  function removeGameButtons() {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
      const label = button.querySelector('.label');
      if (label && (label.textContent.includes('Invite') || label.textContent.includes('Share you win'))) {
        button.parentNode.removeChild(button);
      }
    });
  }

  function removeCustomButtons() {
    // Более точный селектор для кнопки Earn
    const earnButton = document.querySelector('a.tab[href="/tasks"]');
    if (earnButton) {
      earnButton.remove();
    }

    // Удаление кнопки Open
    const openButton = document.querySelector('a.btn');
    if (openButton) {
      openButton.remove();
    }
  }

  function checkAndRemoveButtons() {
    removeTabsButtons();
    removeGameButtons();
    removeCustomButtons();
  }

  window.addEventListener('load', () => {
    startClicker();

    checkAndRemoveButtons();
    setInterval(checkAndRemoveButtons, 1000);
  });

})();
