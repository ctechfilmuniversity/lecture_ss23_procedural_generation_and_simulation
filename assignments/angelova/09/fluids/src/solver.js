export class Solver {
    grid;
    numIterations;

    constructor(grid) {
        this.grid = grid;
        // current step values 
        this.d = new Array(this.grid.size);
        this.u = new Array(this.grid.size); // horizontal velocity 
        this.v = new Array(this.grid.size); // vertical velocity 

        // previous step values 
        this.dPrev = new Array(this.grid.size);
        this.uPrev = new Array(this.grid.size); // horizontal velocity 
        this.vPrev = new Array(this.grid.size); // vertical velocity 

        this.diffusion = 0.6; // 0.4?
        this.numIterations = 20;

        for (let i = 0; i < this.grid.size; i++) {
            this.u[i] = this.v[i] = this.d[i] = 0.0;
            this.uPrev[i] = this.vPrev[i] = this.dPrev[i] = 0.0;
        }

    }

    velocityStep(dt) {
        this.add_source(dt, this.u, this.uPrev);
        this.add_source(dt, this.v, this.vPrev);

        [this.u, this.uPrev] = [this.uPrev, this.u];
        [this.v, this.vPrev] = [this.vPrev, this.v];
    
        this.diffuse(dt, 1, this.u, this.uPrev);

        this.diffuse(dt, 2, this.v, this.vPrev);

        this.project(this.u, this.v, this.uPrev, this.vPrev);

        [this.u, this.uPrev] = [this.uPrev, this.u];
        [this.v, this.vPrev] = [this.vPrev, this.v];

        this.advect(dt, 1, this.u, this.uPrev, this.uPrev, this.vPrev);
        
        this.advect(dt, 2, this.v, this.vPrev, this.uPrev, this.vPrev);

        this.project(this.u, this.v, this.uPrev, this.vPrev);

        for (let i = 0; i < this.grid.size; i++) {
            this.uPrev[i] = 0.0;
            this.vPrev[i] = 0.0;
        }

    }

    densityStep(dt, sources) {
        this.add_source(dt, this.d, this.dPrev);
        
        [this.d, this.dPrev] = [this.dPrev, this.d];
        this.diffuse(dt, 0, this.d, this.dPrev);

        [this.d, this.dPrev] = [this.dPrev, this.d];
        this.advect(dt, 0, this.d, this.dPrev, this.u, this.v);

        for (let i = 0; i < this.grid.size; i++) {
            this.dPrev[i] = 0.0;
        }
    }

    // add source (force) to the density 
    add_source(dt, x, source) { // dt is the time step size 
        for (let i = 0; i < this.grid.size; i++) {
            x[i] += 1000 * dt * source[i];

            // adding to the source creates more interesting effects, 
            // this is just an example using the time step and the diffusion 
            source[i] += dt * this.diffusion;
        }
    };

    diffuse(dt, b, x, x0) {
        const a = dt * this.diffusion * (this.grid.n * this.grid.n);
        const c = 1.0 + 4*a;
    
        this.linearSolver(b, x, x0, a, c);
    };

    // this step forces the density to follow a given velocity field
    advect(dt, b, d, dPrev, u, v) {

        let i0, j0, i1, j1, s0, t0, s1, t1, dt0;
        dt0 = dt * this.grid.n;

        for (let i = 1; i <= this.grid.n; i++) {
            for (let j = 1; j <= this.grid.n; j++) {
                let x = i - dt0 * u[this.cellIndex(i, j)];
                let y = j - dt0 * v[this.cellIndex(i, j)];

                if (x < 0.5) {
                    x = 0.5;
                }
                else if (x > this.grid.n + 0.5) {
                    x = this.grid.n + 0.5;
                }

                i0 = x | x;
                i1 = i0 + 1;

                if (y < 0.5) {
                    y = 0.5;
                }
                else if (y > this.grid.n + 0.5) {
                    y = this.grid.n + 0.5;
                }

                j0 = y | y;
                j1 = j0 + 1;
                
                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;

                d[this.cellIndex(i, j)] = s0 * (t0 * dPrev[this.cellIndex(i0, j0)] + 
                                          t1 * dPrev[this.cellIndex(i0, j1)]) + 
                                          s1 * (t0 * dPrev[this.cellIndex(i1, j0)] + 
                                          t1 * dPrev[this.cellIndex(i1, j1)]);

            }
        }
        this.setBoundaries(b, d);
    };

    project(u, v, p, div) {
        const h = 1.0 / this.grid.n;

        for (let i = 1; i <= this.grid.n; i++) {
            for (let j = 1; j <= this.grid.n; j++) {
                div[this.cellIndex(i, j)] = -0.5 * h * 
                                                        (
                                                            u[this.cellIndex(i + 1, j)] - u[this.cellIndex(i - 1, j)] +
                                                            v[this.cellIndex(i, j + 1)] - v[this.cellIndex(i, j - 1)]
                                                        );
                p[this.cellIndex(i, j)] = 0;
            }
        }

        this.setBoundaries(0, div);
        this.setBoundaries(0, p);

        this.linearSolver(0, p, div, 1.0, 4.0);

        for (let i = 1; i <= this.grid.n; i++) {
            for (let j = 1; j <= this.grid.n; j++) {
                u[this.cellIndex(i, j)] -= 0.5 * (p[this.cellIndex(i + 1, j)] - p[this.cellIndex(i - 1, j)]) / h;
                v[this.cellIndex(i, j)] -= 0.5 * (p[this.cellIndex(i, j + 1)] - p[this.cellIndex(i, j - 1)]) / h;
            }
        }
        this.setBoundaries(1, u);
        this.setBoundaries(2, v);
    }

    linearSolver(b, x, x0, a, c) {
        for (let k = 0; k < this.numIterations; k++) {
            for (let i = 1; i <= this.grid.n; i++) {
                for (let j = 1; j <= this.grid.n; j++) {
                    x[this.cellIndex(i, j)] = (
                        x0[this.cellIndex(i, j)] + 
                        a * (
                            x[this.cellIndex(i, j - 1)] + 
                            x[this.cellIndex(i + 1, j)] + 
                            x[this.cellIndex(i, j + 1)] + 
                            x[this.cellIndex(i - 1, j)]
                        )
                    ) / c;
                }
            }

            this.setBoundaries(b, x);
        }
    }

    setBoundaries(b, x) {
        for (let i = 1; i < this.grid.n; i++) {
            // on the vertical boundaries 
            x[0, i] = (b === 1) ? -x[1, i] : x[1, i];
            x[this.grid.n + 1, i] = (b === 1) ? -x[this.grid.n, i] : x[this.grid.n, i];

            // on the horizontal boundaries 
            x[i, 0] = (b === 2) ? -x[i, 1] : x[i, 1];
            x[i, this.grid.n + 1] = (b === 2) ? -x[i, this.grid.n] : x[i, this.grid.n];

            x[0, 0] = 0.5 * (x[1, 0] + x[0, 1]);
            x[0, this.grid.n + 1] = 0.5 * (x[1, this.grid.n + 1] + x[0, this.grid.n]);
            x[this.grid.n + 1, 0] = 0.5 * (x[this.grid.n, 0] + x[this.grid.n + 1, 1]);
            x[this.grid.n + 1, this.grid.n + 1] = 0.5 * (x[this.grid.n, this.grid.n + 1] + x[this.grid.n + 1, this.grid.n]);
        }
    }

    cellIndex(i, j) {
        return (j * (this.grid.n + 2)) + i;
    }
}
