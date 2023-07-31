mod fluid;

use fluid::{ diffuse, project, advect, FluidArray };
pub use fluid::{N, SCALE, index};

#[derive(Debug)]
pub struct Fluid {
    dt: f32,
    diff: f32,
    visc: f32,

    density0: FluidArray,
    density: FluidArray,

    vel_x: FluidArray,
    vel_y: FluidArray,

    vel_x0: FluidArray,
    vel_y0: FluidArray,
}

impl Fluid {
    pub fn new(dt: f32, diff: f32, visc: f32) -> Self {
        Self {
            dt,
            diff,
            visc,
            density0: [0.0; N * N ],
            density: [0.0; N * N ],
            vel_x: [0.0; N * N ],
            vel_y: [0.0; N * N ],
            vel_x0: [0.0; N * N ],
            vel_y0: [0.0; N * N ],
        }
    }

    pub fn add_density(&mut self, x: f32, y: f32, amount: f32) {
        let ix = index(x as usize, y as usize);
        self.density[ix] += amount;
    }
    pub fn add_velocity(&mut self, x: f32, y: f32, amount_x: f32, amount_y: f32) {
        let ix = index(x as usize, y as usize);
        self.vel_x[ix] += amount_x;
        self.vel_y[ix] += amount_y;
    }

    pub fn step(&mut self) {
        diffuse(1, &mut self.vel_x0, &mut self.vel_x, self.visc, self.dt);
        diffuse(2, &mut self.vel_y0, &mut self.vel_y, self.visc, self.dt);

        project(&mut self.vel_x0, &mut self.vel_y0, &mut self.vel_x, &mut self.vel_y);

        advect(1, &mut self.vel_x, & self.vel_x0, & self.vel_x0, & self.vel_y0, self.dt);
        advect(2, &mut self.vel_y, & self.vel_y0, & self.vel_x0, & self.vel_y0, self.dt);

        project(&mut self.vel_x, &mut self.vel_y, &mut self.vel_x0, &mut self.vel_y0);

        diffuse(0, &mut self.density0, & self.density, self.diff, self.dt);
        advect(0, &mut self.density, & self.density0, & self.vel_x, & self.vel_y, self.dt);
    }

    pub fn get_density(&self) -> FluidArray {
        self.density
    }

    pub fn get_velocity(&self) -> (FluidArray, FluidArray) {
        (self.vel_x, self.vel_y)
    }


}
