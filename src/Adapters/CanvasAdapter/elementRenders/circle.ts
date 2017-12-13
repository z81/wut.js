/**
 * Render circle
 * @param ctx
 * @param config
 */
export const circle = (x, y, ctx: CanvasRenderingContext2D, config: any) => {
  let { radius, background, lineWidth, borderColor } = config;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
};
