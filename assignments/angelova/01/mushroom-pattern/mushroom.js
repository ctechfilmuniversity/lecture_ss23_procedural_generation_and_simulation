
function setup() {
  createCanvas(2*300, 300);
  background(255);
  angleMode(RADIANS);
  noStroke();
  // side effect - you can always comment out the line below :)
  noLoop();
}

function mushroomLayer(r, steps, natureness, color) {
    const yMinRange = -natureness/2;
    const yMaxRange = 1 + natureness/2;
    // position each layer at the center of the bottom canvas edge 
    const offset = (width - 2*r) / 2;

    fill(color);

    beginShape();
    for (let i = 0; i < steps; i++) {
        let step = i * PI/(steps-1);
        const isBoundary = i == 0 || i == steps-1;

        let x_t = cos(step);
        let y_t;
        if (isBoundary) {
            y_t = yMinRange;
        }
        else {
            y_t = sin(step) + random(-(natureness/2), natureness/2);
        }

        let x = offset + map(x_t, -1, 1, 0, 2) * r;
        let y = offset + map(y_t, yMinRange, yMaxRange, 1, 0) * r;
        
        curveVertex(x, y);
        if (isBoundary) {
            // curveVertex does not draw boundary vertices,
            // resulting in a crooked bottom line :(
            curveVertex(x, y);
        }
    }
    endShape();
}

function getLayerDepthRatios() {
    const nLayers = random(5, 100);
    const layers = [];

    for (let i = 0; i < nLayers; i++) {
        layers.push(.1 + random()*.9)
    }

    layers.sort().reverse();
    return layers;
}

function pickParameters(layerDepthRatio) {
    const radius = Math.floor(height * layerDepthRatio);
    const steps = Math.max(10, Math.floor(30 * layerDepthRatio));
    const natureness = 0.08 * layerDepthRatio;
    const color = pickColor(layerDepthRatio);

    return [radius, steps, natureness, color];
}

function pickColor(layerDepthRatio) {
    for (let i = 0; i < colorConfig.length; i++) {
        if (colorConfig[i].maxRatio >= layerDepthRatio) {
            return randomTint(colorConfig[i]);
        }
    }

    throw new Error(
        "Couldn't find color for layerDepthRatio=" + layerDepthRatio
    );
}

function randomTint({ R, G, B }) {
    const tintFactor = random(0, 0.3);
    const forValue = (value) => value + (tintFactor * (255 - value));

    return color(
        forValue(R),
        forValue(G),
        forValue(B),
    )
}

function draw() {
    const depthRatios = getLayerDepthRatios();
    depthRatios.forEach(ratio => {
        const params = pickParameters(ratio);
        mushroomLayer(...params);
    });
}

saveCanvas();
