import JPEG from 'jpeg-js';
import { PNG } from 'pngjs';

export const cropCircleRaw = (height: number, width: number, data: Buffer): Buffer => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = height / 2;
      if (y >= Math.sqrt(Math.pow(r, 2) - Math.pow(x - r, 2)) + r || y <= -(Math.sqrt(Math.pow(r, 2) - Math.pow(x - r, 2))) + r) {
        data[idx + 3] = 0;
      }
    }
  }
  return data;
};

export const cropCircle = (buffer: Buffer, mime: string): Buffer => {
  switch (mime) {
    case 'image/png': {
      const png = PNG.sync.read(buffer);
      png.data = cropCircleRaw(png.height, png.width, png.data);
      return PNG.sync.write(png, { colorType: 6 });
    }
    case 'image/jpeg': {
      const jpeg = JPEG.decode(buffer);
      jpeg.data = cropCircleRaw(jpeg.height, jpeg.width, jpeg.data);
      return JPEG.encode(jpeg, 80).data;
    }
    default: {
      return buffer;
    }
  }
};
