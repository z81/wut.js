/**
 * Render text
 * @param ctx 2d context
 * @param config
 */
export const text = (x, y, ctx: CanvasRenderingContext2D, config: any) => {
  let { text, color, fontName, fontSize, align } = config;

  ctx.beginPath();
  ctx.font = `normal normal lighter ${fontName}`;

  const textSize = ctx.measureText(text);
  config.width = textSize.width;

  if (align === "center") {
    x = Math.round(x - textSize.width / 2);
    y = Math.round(y + fontSize / 2);
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
