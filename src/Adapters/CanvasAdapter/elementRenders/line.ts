/**
 * Draw line
 * @param x
 * @param y
 * @param ctx
 * @param config
 */
export const line = (x, y, ctx: CanvasRenderingContext2D, config) => {
  let { path } = config;

  ctx.beginPath();
  ctx.moveTo(path[0][0], path[0][1]);

  for (let [x, y] of path) {
    ctx.lineTo(x, y);
  }

  ctx.stroke();
};
