'use strict';

const app = {
    width: 815,
    height: 500,
    stickCount: 3,
    stickRadius: 8,
    activeStick: -1,
    ringCount: 5,
    ringMin: 3,
    ringMax: 20,
    ringRadius: 5,
    rings: [],
    quarter: 0.5 * Math.PI,
    stickness: 30,
    heightRatio: 0.25,
    baseColor: '#deb887',
    stickColor: '#ffdead',
    colors: [
        '#9400d3',
        '#4b0082',
        '#0000ff',
        '#00ff00',
        '#ffff00',
        '#ff7f00',
        '#ff0000'
    ],
};

const main = () => {
    setupRings();
    updatePage();
    listenForInput();
}

const listenForInput = () => {
    listenForClicks();
    listenForKeyStrokes();
}

const updatePage = () => {
    clearCanvas();
    drawFrame();
    drawRings();
    checkForWin();
}

const setupRings = () => {
    app.rings = [];
    const left = [];
    for (let i = app.ringCount; i > 0 ; i--) {
        left.push(i);
    }
    app.rings.push(left);
    for (let i = 1; i < app.stickCount; i++) {
        app.rings.push([]);
    }
    document.querySelector('#textSeg').value = app.ringCount;
    app.activeStick = -1;
}

const clearCanvas = () => {
    document.querySelector('#canvas').width = app.width;
    document.querySelector('#canvas').height = app.height;
}

const drawFrame = () => {
    drawBase();
    for (let i = 0; i < app.stickCount; i++) {
        drawStick(Math.round((app.width / (2 * app.stickCount)) * ((i + 1) * 2 - 1)));
    }
}

const checkForWin = () => {
    let win = false;
    for (let i = 1; i < app.stickCount; i++) {
        if (app.rings[i].length === app.ringCount) {
            win = true;
            break;
        }
    }
    document.querySelector('.congratulations').classList.toggle('display-none', !win);
}

const listenForClicks = () => {
    document.querySelector('#canvas').addEventListener("click", (e) => {
        updateActiveStick(getMousePos(e));
    }, false);
}

const listenForKeyStrokes = () => {
    document.addEventListener("keypress", (e) => {
        if (e.key > 0 && e.key <= app.stickCount) {
            updateActiveStick(e.key - 1);
        }
    });
}

const changeRingCount = (input) => {
    let value = 0;
    switch (input) {
        case 'mins': value = app.ringCount - 1; break;
        case 'plus': value = app.ringCount + 1; break;
    }
    app.ringCount = typeof(value) === 'number' && value >= app.ringMin && value <= app.ringMax ? 
        value : 
        app.ringCount;
    setupRings();
    updatePage();
}

const getMousePos = (e) => {
    const rect = document.querySelector('#canvas').getBoundingClientRect();
    const left = e.clientX - rect.left;
    return Math.floor(left / (app.width / app.stickCount));
}

const updateActiveStick = (mousePos) => {
    if (app.activeStick === -1 && app.rings[mousePos].length > 0) {
        readyRing(mousePos);
    } else if (app.activeStick > -1 && mousePos !== app.activeStick && app.rings[app.activeStick].length > 0) {
        moveRing(mousePos);
    } else {
        app.activeStick = -1;
    }
    updatePage();
}

const readyRing = (stick) => {
    app.activeStick = stick;
}

const moveRing = (toStick) => {
    const moveRing = app.rings[app.activeStick].at(-1);
    const targetRing = app.rings[toStick].length > 0 ? app.rings[toStick].at(-1) : app.ringCount + 1;
    if (moveRing < targetRing) {
        const ring = app.rings[app.activeStick].pop();
        app.rings[toStick].push(ring);
        app.activeStick = -1;
    }
}

const drawBase = () => {
    const ctx = document.querySelector('#canvas').getContext('2d');
    ctx.fillStyle = app.baseColor;
    ctx.beginPath();
    ctx.arc((app.stickRadius), (app.height - app.stickness + app.stickRadius), app.stickRadius, (2 * app.quarter), (3 * app.quarter));
    ctx.arc((app.width - app.stickRadius), (app.height - app.stickness + app.stickRadius), app.stickRadius, (3 * app.quarter), 0);
    ctx.arc((app.width - app.stickRadius), (app.height - app.stickRadius), app.stickRadius, 0, (1 * app.quarter));
    ctx.arc((app.stickRadius), (app.height - app.stickRadius), app.stickRadius, (app.quarter), (2 * app.quarter));
    ctx.fill();
}

const drawStick = (position) => {
    const ctx = document.querySelector('#canvas').getContext('2d');
    ctx.fillStyle = app.stickColor;
    ctx.beginPath();
    ctx.moveTo((position - app.stickness / 2), (app.height - app.stickness));
    ctx.arc((position - app.stickness / 2 + app.stickRadius), (app.height / 6 + app.stickRadius), app.stickRadius, (2 * app.quarter), (3 * app.quarter));
    ctx.arc((position + app.stickness / 2 - app.stickRadius), (app.height / 6 + app.stickRadius), app.stickRadius, (3 * app.quarter), 0);
    ctx.lineTo((position + app.stickness / 2), (app.height - app.stickness));
    ctx.fill();
}

const drawRings = () => {
    const ctx = document.querySelector('#canvas').getContext('2d');
    const summit = Math.round(app.heightRatio * (app.height- app.stickness));
    const baseHeight = (app.height - app.stickness);
    const ringHeight = (app.height - app.stickness - summit) / app.ringCount;
    const baseWidth = Math.round(app.width / (app.stickCount) - app.stickness) / 2;
    const topWidth = Math.round(app.heightRatio * baseWidth);
    const widthInc = Math.round((baseWidth - topWidth) / app.ringCount);
    for (let i = 0; i < app.stickCount; i++) {
        const position = Math.round((app.width / (2 * app.stickCount)) + i * (app.width / app.stickCount));
        for (let j = 0; j < app.rings[i].length; j++) {
            const ringSize = app.rings[i][j];
            const ringIndex = app.ringCount - ringSize;
            const colorIndex = ringIndex % app.colors.length;
            const offset = app.activeStick === i && j === app.rings[i].length - 1 ? j + 1 : j;
            ctx.fillStyle = app.colors[colorIndex];
            ctx.beginPath();
            ctx.arc((position - baseWidth + (ringIndex * widthInc) + app.ringRadius), (baseHeight - (offset + 1) * ringHeight + app.ringRadius), app.ringRadius, Math.PI, 1.5 * Math.PI);
            ctx.arc((position + baseWidth - (ringIndex * widthInc) - app.ringRadius), (baseHeight - (offset + 1) * ringHeight + app.ringRadius), app.ringRadius, 1.5 * Math.PI, 0);
            ctx.arc((position + baseWidth - (ringIndex * widthInc) - app.ringRadius), (app.height - app.stickness - offset * ringHeight - app.ringRadius), app.ringRadius, 2 * Math.PI, 0.5 * Math.PI);
            ctx.arc((position - baseWidth + (ringIndex * widthInc) + app.ringRadius), (baseHeight - offset * ringHeight - app.ringRadius), app.ringRadius, 0.5 * Math.PI, Math.PI);
            ctx.fill();
        }
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}