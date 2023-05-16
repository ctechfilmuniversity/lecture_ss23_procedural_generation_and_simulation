

coord = coord / brick_size;
float2 mortar = (mortar_thickness * 0.5) / brick_size;

float2 index = floor(coord);

if (index.y % 2 == 0.0)
{
    coord.x = coord.x + 0.5;
}

coord = frac(coord);

float is_mortar = coord.x < mortar.x || 1 - coord.x < mortar.x || coord.y < mortar.y || 1 - coord.y < mortar.y;
gradient = (smoothstep(0, 0.5, coord.x) - smoothstep(0.5, 1.0, coord.x)) * (smoothstep(0, 0.5, coord.y) - smoothstep(0.5, 1.0, coord.y));

float value = is_mortar;

return value;