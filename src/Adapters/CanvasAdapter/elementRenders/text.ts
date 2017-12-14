/**
 * Render text
 * @param ctx 2d context
 * @param config
 */
export const text = (x, y, ctx: CanvasRenderingContext2D, config: any) => {
  let { text, color, font, fontSize, align } = config;

  ctx.beginPath();
  ctx.font = font;

  if (align) {
    const textSize = ctx.measureText(text);

    if (align === "center") {
      x -= textSize.width / 2;
      y += fontSize / 2;
    }
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
