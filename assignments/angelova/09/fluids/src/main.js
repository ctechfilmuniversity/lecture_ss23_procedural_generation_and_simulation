import { Grid } from './grid.js';
import { Solver } from './solver.js';


const GRID_SIZE = 200;
const SCALING_FACTOR = 3;
const CANVAS_SIZE = GRID_SIZE * SCALING_FACTOR;
const SIMULATION_SPEED = 1;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.height = CANVAS_SIZE;
const frameBuffer = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);

const grid = new Grid(GRID_SIZE);
const solver = new Solver(grid);

let lastAnimationTimestamp = Date.now();

///////////////////// to play around //////////////////////////////////////////
const sources = new Array(solver.grid.size);
for (let i = 0; i < grid.size; i++) {
    sources[i] = 0.01;
}

for (let i = 1; i < grid.n; i++) {
    for (let j = 1; j < grid.n; j++) {
        solver.uPrev[solver.cellIndex(i, j)] = (i + j) * 0.001;
        solver.vPrev[solver.cellIndex(i, j)] = j * 0.001;  // cool one         
        solver.dPrev[solver.cellIndex(i, j)] = 0.001;        
    }
}

///////////////////////////////////////////////////////////////////////////////

function draw() {
    const now = Date.now();
    const elapsed = now - lastAnimationTimestamp;
    const dt = SIMULATION_SPEED * elapsed / 1000;
    lastAnimationTimestamp = now;

    // let dt0 = 0.23;
    solver.velocityStep(dt, sources);
    solver.densityStep(dt, sources);

    drawDensitiesInCanvas();

    setTimeout(() => {
        [solver.d, solver.dPrev] = [solver.dPrev, solver.d];
        [solver.u, solver.uPrev] = [solver.uPrev, solver.u];
        [solver.v, solver.vPrev] = [solver.vPrev, solver.v];
        requestAnimationFrame(draw);
    }, 0);
}

function drawDensitiesInCanvas() {
    ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE);

    updateFrameBuffer();
    ctx.putImageData(frameBuffer, 0, 0);

}

function updateFrameBuffer() {
    for (let i = 1; i <= solver.grid.n; i++) {
        for (let j = 1; j <= solver.grid.n; j++) {
            const density = solver.d[solver.cellIndex(i, j)];

            const row = i-1;
            const col = j-1;

            for (let k = 0; k < SCALING_FACTOR; k++) {
                for (let l = 0; l < SCALING_FACTOR; l++) {
                    const scaledRow = row*SCALING_FACTOR + k;
                    const scaledCol = col*SCALING_FACTOR + l;
                    // console.log(`scaledRow: ${scaledRow}; scaledCol: ${scaledCol}`);
                    const pixelIndex = (scaledRow + scaledCol*CANVAS_SIZE)*4;
                    frameBuffer.data[pixelIndex + 0] = 0;
                    frameBuffer.data[pixelIndex + 1] = 0;
                    frameBuffer.data[pixelIndex + 2] = 0;
                    frameBuffer.data[pixelIndex + 3] = density * 255;
                }
            }
        }
    }
}

window.addEventListener('load', draw);
