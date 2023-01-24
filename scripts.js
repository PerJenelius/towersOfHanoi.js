'use strict';

const app = {
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
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

const updatePage = () => {
    clearCanvas();
    drawFrame();
    drawRings();
    checkForWin();
}

const setupRings = () => {
    app.rings = [];
    let left = [];
    for (let i = app.ringCount; i > 0 ; i--) {
        left.push(i);
    }
    app.rings.push(left);

    for (let i = 1; i < app.stickCount; i++) {
        app.rings.push([]);
    }

    document.getElementById('textSeg').value = app.ringCount;
}

const changeRingCount = (input) => {
    let value = 0;
    switch (input) {
        case 'mins': value = app.ringCount - 1; break;
        case 'plus': value = app.ringCount + 1; break;
        case 'text': value = parseInt(document.getElementById('textSeg').value); break;
    }
    app.ringCount = typeof(value) == 'number' && value >= app.ringMin && value <= app.ringMax ? value : app.ringCount;
    setupRings();
    updatePage();
}

const checkForWin = () => {
    document.getElementsByTagName('body')[0].style.backgroundColor = 
        app.rings[app.stickCount - 1].length === app.ringCount ?
        body.style.backgroundColor = 'lightgreen' :
        body.style.backgroundColor = '#e5e5e5';
}

const clearCanvas = () => {
    app.canvas.width = app.width;
    app.canvas.height = app.height;
}

const listenForInput = () => {
    listenForClicks();
    listenForKeyStrokes();
}

const listenForClicks = () => {
    app.canvas.addEventListener("click", (e) => {
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

const getMousePos = (e) => {
    const rect = app.canvas.getBoundingClientRect();
    const left = e.clientX - rect.left;
    const stickIndex = Math.floor(left / (app.width / app.stickCount));
    return stickIndex;
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

const drawFrame = () => {
    drawBase();

    for (let i = 0; i < app.stickCount; i++) {
        drawStick(Math.round((app.width / (2 * app.stickCount)) * ((i + 1) * 2 - 1)));
    }
}

const drawBase = () => {
    app.ctx.fillStyle = app.baseColor;
    app.ctx.beginPath();
    app.ctx.arc((app.stickRadius), (app.height - app.stickness + app.stickRadius), app.stickRadius, (2 * app.quarter), (3 * app.quarter));
    app.ctx.arc((app.width - app.stickRadius), (app.height - app.stickness + app.stickRadius), app.stickRadius, (3 * app.quarter), 0);
    app.ctx.arc((app.width - app.stickRadius), (app.height - app.stickRadius), app.stickRadius, 0, (1 * app.quarter));
    app.ctx.arc((app.stickRadius), (app.height - app.stickRadius), app.stickRadius, (app.quarter), (2 * app.quarter));
    app.ctx.fill();
}

const drawStick = (position) => {
    app.ctx.fillStyle = app.stickColor;
    app.ctx.beginPath();
    app.ctx.moveTo((position - app.stickness / 2), (app.height - app.stickness));
    app.ctx.arc((position - app.stickness / 2 + app.stickRadius), (app.height / 6 + app.stickRadius), app.stickRadius, (2 * app.quarter), (3 * app.quarter));
    app.ctx.arc((position + app.stickness / 2 - app.stickRadius), (app.height / 6 + app.stickRadius), app.stickRadius, (3 * app.quarter), 0);
    app.ctx.lineTo((position + app.stickness / 2), (app.height - app.stickness));
    app.ctx.fill();
}

const drawRings = () => {
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



            app.ctx.fillStyle = app.colors[colorIndex];
            app.ctx.beginPath();
            app.ctx.arc((position - baseWidth + (ringIndex * widthInc) + app.ringRadius), (baseHeight - (offset + 1) * ringHeight + app.ringRadius), app.ringRadius, Math.PI, 1.5 * Math.PI);
            app.ctx.arc((position + baseWidth - (ringIndex * widthInc) - app.ringRadius), (baseHeight - (offset + 1) * ringHeight + app.ringRadius), app.ringRadius, 1.5 * Math.PI, 0);
            app.ctx.arc((position + baseWidth - (ringIndex * widthInc) - app.ringRadius), (app.height - app.stickness - offset * ringHeight - app.ringRadius), app.ringRadius, 2 * Math.PI, 0.5 * Math.PI);
            app.ctx.arc((position - baseWidth + (ringIndex * widthInc) + app.ringRadius), (baseHeight - offset * ringHeight - app.ringRadius), app.ringRadius, 0.5 * Math.PI, Math.PI);
            app.ctx.fill();
        }
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}