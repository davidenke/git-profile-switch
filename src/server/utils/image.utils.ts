import JPEG from 'jpeg-js';
import { PNG } from 'pngjs';

export const cropCircleRaw = (height: number, width: number, data: Buffer): Buffer => {
  const cropped = data.slice();
  const radius = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = Math.sqrt(Math.pow(radius, 2) - Math.pow(x - radius, 2));
      if (y >= r + radius || y <= -r + radius) {
        cropped[idx] = 255;
        cropped[idx + 1] = 0;
        cropped[idx + 2] = 0;
        cropped[idx + 3] = 0;
      }
    }
  }
  return cropped;
};

export const cropCircle = (buffer: Buffer, mime: string): Buffer => {
  switch (mime) {
    case 'image/png': {
      const png = PNG.sync.read(buffer);
      png.data = cropCircleRaw(png.height, png.width, png.data);
      return PNG.sync.write(png, { colorType: 6 });
    }
    case 'image/jpeg': {
      const { data, height, width } = JPEG.decode(buffer);
      const png = new PNG({ height, width, colorType: 6 });
      png.data = cropCircleRaw(height, width, data);
      return PNG.sync.write(png, { colorType: 6 });
    }
    default: {
      return buffer;
    }
  }
};
