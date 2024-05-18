const hexToRgb = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  return [r, g, b];
};

const rgbToXyz = (r: number, g: number, b: number) => {
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return [x, y, z];
};

const xyzToLab = (x: number, y: number, z: number) => {
  const ref_X =  95.047;
  const ref_Y = 100.000;
  const ref_Z = 108.883;

  x = x / ref_X;
  y = y / ref_Y;
  z = z / ref_Z;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return [l, a, b];
};

const labToLch = (l: number, a: number, b: number) => {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * 360 / (2 * Math.PI);

  if (h < 0) {
    h += 360;
  }

  return [Math.round(l), Math.round(c), Math.round(h)];
};

const colorToLCH = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  const [x, y, z] = rgbToXyz(r, g, b);
  const [l, a, b_] = xyzToLab(x, y, z);
  const [lchL, lchC, lchH] = labToLch(l, a, b_);

  return [lchL, lchC, lchH];
};

export default colorToLCH;
