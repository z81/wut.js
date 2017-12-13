/**
 * Draw rounded reactangle
 * @param ctx 2d context
 * @param x
 * @param y
 * @param width
 * @param height
 * @param radius border radius
 */

const drawRoundRect = (ctx, x, y, width, height, radius) => {
  ctx.moveTo(x + radius, y + 0.5);
  ctx.lineTo(x + width - radius, y + 0.5);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius + 0.5);
  ctx.lineTo(x + width, y + height - radius + 0.5);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height + 0.5);
  ctx.lineTo(x + radius, y + height + 0.5);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius + 0.5);
  ctx.lineTo(x, y + radius + 0.5);
  ctx.quadraticCurveTo(x, y, x + radius, y + 0.5);
};

/**
 * Render reactangle
 * @param ctx 2d context
 * @param config Element config
 */
export const rect = (x, y, ctx: CanvasRenderingContext2D, config: any) => {
  let { background, borderColor, width, height, rotate, borderRadius } = config;

  ctx.beginPath();

  if (borderRadius) {
    drawRoundRect(ctx, x, y, width, height, borderRadius);
  } else {
    ctx.rect(x, y, width, height);
  }

  ctx.stroke();
  ctx.fill();
  ctx.translate(0, 0);
};
