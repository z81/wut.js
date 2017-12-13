const imageCache = new Map();

/**
 *
 * @param config
 */
export const image = (x, y, ctx: CanvasRenderingContext2D, config) => {
  let { width, height, src } = config;

  let img = imageCache.get(src);

  if (!img) {
    img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      image(x, y, ctx, config);
    };
    img.src = src;
    return;
  }

  ctx.drawImage(img, x + 0.5, y + 0.5, width, height);
};
