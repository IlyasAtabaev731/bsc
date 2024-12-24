// ==UserScript==
// @name         !BlumFarm!
// @version      2.9.3
// @namespace    Violentmonkey Scripts
// @author       KittenWoof
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ilfae/ilfae/main/logo.webp
// @updateURL    https://github.com/IlyasAtabaev731/bsc/raw/main/bsc.user.js
// @downloadURL  https://github.com/IlyasAtabaev731/bsc/raw/main/bsc.user.js
// @homepage     https://github.com/IlyasAtabaev731/bsc
// ==/UserScript==

let GAME_SETTINGS = {
    clickPercentage: {
        bomb: Math.floor(Math.random() * (90 - 80 + 1)) + 80,
        ice: Math.floor(Math.random() * 2) + 2,
        flower: Math.floor(Math.random() * (90 - 80 + 1)) + 80,
    },
    autoClickPlay: true,
};

let isGamePaused = false;
let isSettingsOpen = false;

try {
    let gameStats = {
        score: 0,
        bombHits: 0,
        iceHits: 0,
        flowersSkipped: 0,
        isGameOver: false,
    };

    const originalPush = Array.prototype.push;
    Array.prototype.push = function (...items) {
        if (!isGamePaused) {
            items.forEach(item => handleGameElement(item));
        }
        return originalPush.apply(this, items);
    };

    async function handleGameElement(element) {
        if (isGamePaused || !element || !element.asset) return;
        const { assetType } = element.asset;
        const randomValue = Math.random() * 100;

        switch (assetType) {
            case "CLOVER":
                if (randomValue < GAME_SETTINGS.clickPercentage.flower) {
                    await clickElementWithDelay(element);
                }
                break;
            case "BOMB":
                if (randomValue < GAME_SETTINGS.clickPercentage.bomb) {
                    await clickElementWithDelay(element);
                }
                break;
            case "FREEZE":
                if (randomValue < GAME_SETTINGS.clickPercentage.ice) {
                    await clickElementWithDelay(element);
                }
                break;
        }
    }

    function clickElementWithDelay(element) {
        if (isGamePaused) return;
        const clickDelay = Math.floor(Math.random() * (1500 - 200 + 1)) + 200;
        setTimeout(() => {
            if (!isGamePaused) {
                element.onClick(element);
                element.isExplosion = true;
                element.addedAt = performance.now();
            }
        }, clickDelay);
    }

    function checkGameCompletion() {
        if (isGamePaused) return;
        const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
        if (rewardElement && !gameStats.isGameOver) {
            gameStats.isGameOver = true;
        }
    }

    function getNewGameDelay() {
        return Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    }

    function checkAndClickPlayButton() {
        const playButtons = document.querySelectorAll('button.kit-button.is-large.is-primary, a.play-btn[href="/game"], button.kit-button.is-large.is-primary');
        const delay = Math.random() * (5000 - 2000) + 2000;

        playButtons.forEach(button => {
            if (!isGamePaused && GAME_SETTINGS.autoClickPlay && button.textContent.trim().length > 0) {
                setTimeout(() => {
                    if (!isGamePaused) {
                        gameStats.isGameOver = true;
                        resetGameStats();
                        button.click();
                    }
                }, delay);
            }
        });
    }

    function resetGameStats() {
        gameStats = {
            score: 0,
            bombHits: 0,
            iceHits: 0,
            flowersSkipped: 0,
            isGameOver: false,
        };
    }

    function clickAdditionalButton() {
        const specificButton = document.querySelector('button.kit-button.is-large.is-primary');
        const delay = Math.random() * (5000 - 2000) + 2000;

        if (specificButton) {
            setTimeout(() => {
                if (!isGamePaused) specificButton.click();
            }, delay);
        }
    }

    function checkAndClickResetButton() {
        const errorPage = document.querySelector('div[data-v-26af7de6].error.page.wrapper');
        const delay = Math.random() * (5000 - 2000) + 2000;

        if (errorPage) {
            const resetButton = errorPage.querySelector('button.reset');
            if (resetButton) {
                setTimeout(() => {
                    if (!isGamePaused) resetButton.click();
                }, delay);
            }
        }
    }

    function AutoClaimAndStart() {
        setInterval(() => {
            if (isGamePaused) return;

            const claimButton = document.querySelector('button.kit-button.is-large.is-drop.is-fill.button.is-done');
            const startFarmingButton = document.querySelector('button.kit-button.is-large.is-primary.is-fill.button');
            const continueButton = document.querySelector('button.kit-button.is-large.is-primary.is-fill.btn');
            const playHighlightedButton = document.querySelector('button.kit-button.is-large.is-primary.highlighted-btn');
            const playLinkButton = document.querySelector('a.play-btn[href="/game"]');

            const delay = Math.random() * (5000 - 2000) + 2000;


            if (claimButton) {
                setTimeout(() => { if (!isGamePaused) claimButton.click(); }, delay);

            } else if (startFarmingButton) {
                setTimeout(() => { if (!isGamePaused) startFarmingButton.click(); }, delay);

            } else if (continueButton) {
                setTimeout(() => { if (!isGamePaused) continueButton.click(); }, delay);

            } else if (playHighlightedButton) {
                setTimeout(() => { if (!isGamePaused) playHighlightedButton.click(); }, delay);

            } else if (playLinkButton) {
                setTimeout(() => { if (!isGamePaused) playLinkButton.click(); }, delay);
            }




        }, Math.floor(Math.random() * 5000) + 5000);
    }


    function clickFirstTab() {
        const firstTab = document.querySelector('#app > div.layout-tabs.tabs > a:nth-child(1)');
        if (firstTab) {
            firstTab.click();
        }
    }

    function checkForFirstTabAndClick() {
        if (isGamePaused) return;
        clickFirstTab();
        setTimeout(checkForFirstTabAndClick, 5000);
    }


    function continuousPlayButtonCheck() {
        if (isGamePaused) return;
        checkAndClickPlayButton();
        checkAndClickResetButton();
        clickAdditionalButton();
        setTimeout(continuousPlayButtonCheck, 1000);
    }



    const observer = new MutationObserver(mutations => {
        if (isGamePaused) return;
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                checkGameCompletion();
            }
        }
    });

    const appElement = document.querySelector('#app');
    if (appElement) {
        observer.observe(appElement, { childList: true, subtree: true });
    }



    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.top = '0';
    controlsContainer.style.left = '50%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.zIndex = '9999';
    controlsContainer.style.backgroundColor = 'black';
    controlsContainer.style.padding = '10px 20px';
    controlsContainer.style.borderRadius = '10px';
    document.body.appendChild(controlsContainer);


    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    controlsContainer.appendChild(buttonsContainer);

    const pauseButton = document.createElement('button');

    pauseButton.textContent = '❚❚';
    pauseButton.style.padding = '4px 8px';
    pauseButton.style.backgroundColor = '#5d2a8f';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '10px';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.marginRight = '5px';
    pauseButton.onclick = toggleGamePause;
    buttonsContainer.appendChild(pauseButton);


    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⛯';
    settingsButton.style.padding = '4px 8px';
    settingsButton.style.backgroundColor = '#5d2a8f';
    settingsButton.style.color = 'white';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '10px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.onclick = toggleSettings;
    buttonsContainer.appendChild(settingsButton);


    const settingsContainer = document.createElement('div');
    settingsContainer.style.display = 'none';
    settingsContainer.style.marginTop = '10px';
    controlsContainer.appendChild(settingsContainer);


    function toggleSettings() {
        isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen) {
            settingsContainer.style.display = 'block';
            settingsContainer.innerHTML = '';

            const table = document.createElement('table');
            table.style.color = 'white';


            const items = [
                { label: '🎇 Bomb %', settingName: 'bomb' },
                { label: '❄️ Ice %', settingName: 'ice' },
                { label: '🎄 Flower %', settingName: 'flower' },

            ];


            items.forEach(item => {
                const row = table.insertRow();


                const labelCell = row.insertCell();
                labelCell.textContent = item.label;


                const inputCell = row.insertCell();
                const inputElement = document.createElement('input');
                inputElement.type = 'number';
                inputElement.value = GAME_SETTINGS.clickPercentage[item.settingName];
                inputElement.min = 0;
                inputElement.max = 100;
                inputElement.style.width = '50px';
                inputElement.addEventListener('input', () => {
                    GAME_SETTINGS.clickPercentage[item.settingName] = parseInt(inputElement.value, 10);
                });
                inputCell.appendChild(inputElement);

            });


            settingsContainer.appendChild(table);

        } else {
            settingsContainer.style.display = 'none';
        }
    }


    function toggleGamePause() {
        isGamePaused = !isGamePaused;
        pauseButton.textContent = isGamePaused ? '▶' : '❚❚';
        if (!isGamePaused) {
            continuousPlayButtonCheck();
        }
    }



    AutoClaimAndStart();
    continuousPlayButtonCheck();
    checkForFirstTabAndClick();

} catch (e) { }