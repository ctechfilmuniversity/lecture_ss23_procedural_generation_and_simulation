use nannou::prelude::*;


pub const N: usize = 128;
pub const ITER: u32 = 4;
pub const SCALE: usize = 5;

// the type we use for all arrays in the Fluid
pub type FluidArray = [f32; N * N];


pub fn index(x: usize, y: usize) -> usize {
    let x = clamp(x, 0, N-1);
    let y = clamp(y, 0, N-1);
    x + (y * N)
}


pub fn diffuse(b: u32, x: &mut FluidArray, x0: &FluidArray, diff: f32, dt: f32) {
    let a = dt * diff * (N - 2) as f32 * (N - 2) as f32;
    lin_solve(b, x, x0, a, 1.0 + 6.0  * a);
}


pub fn project(veloc_x: &mut FluidArray, veloc_y: &mut FluidArray, p: &mut FluidArray, div: &mut FluidArray) {

    for j in 1..(N -1) {
        for i in 1..(N-1) {
            let ix = index(i, j);
            div[ix] = -0.5 *(
                veloc_x[index(i+1, j)]
                    -veloc_x[index(i-1, j)]
                    +veloc_y[index(i  , j+1)]
                    -veloc_y[index(i  , j-1)]
            ) / N as f32;
            p[ix] = 0.0;
        }
    }

    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1.0, 6.0);

    for j in 1..(N-1) {
        for i in 1..(N-1) {
            let ix = index(i, j);
            veloc_x[ix] -= 0.5 * (  p[index(i+1, j)]
                                    -p[index(i-1, j)]) * N as f32;
            veloc_y[ix] -= 0.5 * (  p[index(i, j+1)]
                                    -p[index(i, j-1)]) * N as f32;
        }
    }

    set_bnd(1, veloc_x);
    set_bnd(2, veloc_y);
}

pub fn advect(b: u32, d: &mut FluidArray, d0: &FluidArray,  veloc_x: &FluidArray, veloc_y: &FluidArray, dt: f32) {
    let mut i0: f32;
    let mut i1: f32;
    let mut j0: f32;
    let mut j1: f32;

    let n_float: f32 = N as f32;

    let dtx: f32 = dt * (n_float - 2.0);
    let dty: f32 = dt * (n_float - 2.0);

    let mut s0: f32;
    let mut s1: f32;
    let mut t0: f32;
    let mut t1: f32;

    let mut tmp1: f32;
    let mut tmp2: f32;
    let mut x: f32;
    let mut y: f32;

    for j in 1..(N-1) {
        for i in 1..(N-1) {
            tmp1 = dtx * veloc_x[index(i, j)];
            tmp2 = dty * veloc_y[index(i, j)];

            x = i as f32 - tmp1;
            y = j as f32 - tmp2;

            if x < 0.5 {
                x = 0.5;
            }

            if x > n_float + 0.5 {
                x = n_float + 0.5;
            }

            i0 = x.floor();
            i1 = i0 + 1.0;

            if y < 0.5 {
                y = 0.5;
            }
            if y > n_float + 0.5 {
                y = n_float + 0.5;
            }
            j0 = y.floor();
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            let i0i = i0 as usize;
            let i1i = i1 as usize;
            let j0i = j0 as usize;
            let j1i = j1 as usize;

            let ix = index(i,j);
            let new_value = s0 * (t0 * d0[index(i0i, j0i)] + t1 * d0[index(i0i, j1i)])
                + s1 * (t0 * d0[index(i1i, j0i)] + t1 * d0[index(i1i, j1i)]);

            d[ix] = new_value;

            //println!("{:?}", d0);
        }
    }
    set_bnd(b, d);
}


fn set_bnd(b: u32, x: &mut FluidArray) {
    for i in 1..(N-1) {
        x[index(i, 0)] = if b == 2 { -x[index(i, 1)] } else { x[index(i, 1)] };
        x[index(i, N-1)] = if b == 2 { -x[index(i, N-2)] } else { x[index(i, N-2)] };
    }

    for j in 1..(N-1) {
        x[index(0  , j)] = if b == 1 { -x[index(1  , j)] } else { x[index(1  , j)] };
        x[index(N-1, j)] = if b == 1 { -x[index(N-2, j)] } else { x[index(N-2, j)] };
    }

    x[index(0, 0)]       = 0.5 * (x[index(1, 0)] + x[index(0, 1)]);
    x[index(0, N-1)]     = 0.5 * (x[index(1, N-1)] + x[index(0, N-2)]);
    x[index(N-1, 0)]     = 0.5 * (x[index(N-2, 0)] + x[index(N-1, 1)]);
    x[index(N-1, N-1)]   = 0.5 * (x[index(N-2, N-1)] + x[index(N-1, N-2)]);

}

fn lin_solve(b: u32, x: &mut FluidArray, x0: &FluidArray, a: f32, c: f32) {
    let c_recip = 1.0 / c;

    for _k in 0..ITER {
        for j in 1..(N - 1) {
            for i in 1..(N - 1) {
                let ix = index(i, j);
                x[ix] =
                    (x0[ix]
                     + a*(    x[index(i+1 , j)]
                              +x[index(i-1, j)]
                              +x[index(i  , j+1)]
                              +x[index(i  , j-1)]
                     )) * c_recip;
            }
        }
        set_bnd(b, x);
    }
}
