use nannou::prelude::*;

use fluid::{ Fluid, index, N, SCALE };

const WIDTH: u32 = (N * SCALE) as u32;

fn main() {
    nannou::app(model).update(update).run();
}

struct Model {
    fluid: Fluid,
}

fn model(app: &App) -> Model {
    let _window = app
        .new_window()
        .size(WIDTH, WIDTH)
        .view(view)
        .mouse_pressed(mouse_pressed)
        .build()
        .unwrap();

    let m = Model {
        fluid: Fluid::new(0.1, 0.0, 0.000001),
    };
    m
}

fn update(app: &App, model: &mut Model, _update: Update) {
    // aiming for distance of mouse to center
    // determines direction of velocity
    let mouse = vec2(app.mouse.x, app.mouse.y);
    // weird conversion because of canvas translation
    let posx = (mouse.x +  WIDTH as f32/2.0) / SCALE as f32;
    let posy = abs((mouse.y + WIDTH as f32/2.0) / SCALE as f32 - N as f32);
    let mouse = vec2(posx, posy);

    let center = vec2((WIDTH as f32/SCALE as f32) * 0.5, (WIDTH as f32/SCALE as f32) * 0.5);
    let dir = mouse - center;
    model.fluid.add_velocity(center.x, center.y, dir.x, dir.y);

    model.fluid.step();
}

fn view(app: &App, model: &Model, frame: Frame) {
    let draw = app.draw();
    let draw = draw.scale_y(-1.0).translate(vec3(
        -(WIDTH as f32)/2.0,
        -(WIDTH as f32)/2.0,
        0.0));
    draw.background().color(BLACK);

    let density = model.fluid.get_density();

    for i in 0..(N-1) {
        for j in 0..(N-1) {
            let x = (i * SCALE) as f32;
            let y = (j * SCALE) as f32;
            let ix = index(i, j);
            let d = density[ix];
            let d = clamp(d, 0.0, 100.0);
            let d = map_range(d, 0.0, 100.0, 0.0, 1.0);

            draw.rect()
                .x_y(x, y)
                .w_h(SCALE as f32, SCALE as f32)
                .hsla(0.5, 0.6, d, 1.0);
        }
    }

    draw.to_frame(app, &frame).unwrap();
}

fn mouse_pressed(_app: &App, model: &mut Model, _button: MouseButton) {
    let center = vec2((WIDTH as f32/SCALE as f32) * 0.5, (WIDTH as f32/SCALE as f32) * 0.5);
    model.fluid.add_density(center.x, center.y, 500.0)
}
