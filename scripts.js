'use strict';

const app = {
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    width: 815,
    height: 500,
    stickCount: 3,
    stickRadius: 8,
    ringCount: 5,
    ringRadius: 5,
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
    bricks: [0,0,0]
};


const main = () => {
    updatePage();
    listenForClicks();
}

const updatePage = () => {
    clearCanvas();
    drawFrame();
    drawRings();
}

const clearCanvas = () => {
    app.canvas.width = app.width;
    app.canvas.height = app.height;
}

const listenForClicks = () => {
    app.canvas.addEventListener("click", (e) => {
        var mousePos = getMousePos(e);

        console.log(mousePos);
    }, false);
}

const getMousePos = (e) => {
    const rect = app.canvas.getBoundingClientRect();
    const left = e.clientX - rect.left;

    if (left < app.width / app.stickCount) {
        return 'left';
    } else if (left >= app.width / app.stickCount && left < 2 * (app.width / app.stickCount)) {
        return 'middle';
    } else {
        return 'right';
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
    const position = Math.round((app.width / (2 * app.stickCount)));
    const summit = Math.round(app.heightRatio * (app.height- app.stickness));
    const baseHeight = (app.height - app.stickness);
    const ringHeight = (app.height - app.stickness - summit) / app.ringCount;
    const baseWidth = Math.round(app.width / (app.stickCount) - app.stickness) / 2;
    const topWidth = Math.round(app.heightRatio * baseWidth);
    const widthInc = Math.round((baseWidth - topWidth) / app.ringCount);
    
    for (let i = 0; i < app.ringCount; i++) {
        const colorIndex = i % app.colors.length;
        app.ctx.fillStyle = app.colors[colorIndex];
        app.ctx.beginPath();
        app.ctx.arc((position - baseWidth + (i * widthInc) + app.ringRadius), (baseHeight - (i + 1) * ringHeight + app.ringRadius), app.ringRadius, Math.PI, 1.5 * Math.PI);
        app.ctx.arc((position + baseWidth - (i * widthInc) - app.ringRadius), (baseHeight - (i + 1) * ringHeight + app.ringRadius), app.ringRadius, 1.5 * Math.PI, 0);
        app.ctx.arc((position + baseWidth - (i * widthInc) - app.ringRadius), (app.height - app.stickness - i * ringHeight - app.ringRadius), app.ringRadius, 2 * Math.PI, 0.5 * Math.PI);
        app.ctx.arc((position - baseWidth + (i * widthInc) + app.ringRadius), (baseHeight - i * ringHeight - app.ringRadius), app.ringRadius, 0.5 * Math.PI, Math.PI);
        app.ctx.fill();
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}