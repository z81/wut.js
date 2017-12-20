/**
 * Возвращает направление линии
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
const getLineType = (x0: number, y0: number, x1: number, y1: number): string => {
  if (x0 === x1 && y0 > y1) {
    return "top";
  }

  if (x0 === x1 && y0 < y1) {
    return "bottom";
  }

  if (y0 === y1 && x0 < x1) {
    return "right";
  }

  if (y0 === y1 && x0 > x1) {
    return "left";
  }

  return "";
};

/**
 * Draw line
 * @param x
 * @param y
 * @param ctx
 * @param config
 */
export const line = (x, y, ctx: CanvasRenderingContext2D, config) => {
  const radius = 5;

  ctx.beginPath();
  ctx.moveTo(config.path[0][0], config.path[0][1] + 0.5);

  //*
  let prev = null;

  for (let i = 0; i < config.path.length - 1; i++) {
    const next = config.path[i + 1];
    const p = config.path[i];

    let [x1, y1] = p;
    x1 += 0.5;
    y1 += 0.5;

    if (prev && next) {
      let [x0, y0] = prev;
      let [x2, y2] = next;

      x0 += 0.5;
      y0 += 0.5;
      x2 += 0.5;
      y2 += 0.5;

      let type = "";

      type = getLineType(x0, y0, x1, y1);
      type += getLineType(x1, y1, x2, y2);

      if (type === "rightbottom") {
        ctx.lineTo(x1 - radius, y1);
        ctx.arc(
          x1 - radius + 0.5,
          y1 + radius + 0.5,
          radius,
          Math.PI * 2 - Math.PI / 2,
          0
        );
      } else if (type === "bottomright") {
        ctx.lineTo(x1 + 0.5, y1 - radius);
        ctx.arc(
          x1 + radius + 0.5,
          y1 - radius + 0.5,
          radius,
          Math.PI * 3,
          Math.PI * 4 + Math.PI / 2,
          true
        );
        ctx.moveTo(x1 + radius, y1);
      } else if (type === "bottomleft") {
        ctx.lineTo(x1, y1 - radius);
        ctx.arc(x1 - radius + 0.5, y1 - radius + 0.5, radius, Math.PI * 2, Math.PI / 2);
        ctx.moveTo(x1 - radius, y1);
      } else if (type === "topright") {
        ctx.lineTo(x1, y1 + radius);
        ctx.arc(
          x1 + radius + 0.5,
          y1 + radius + 0.5,
          radius,
          Math.PI * 3,
          Math.PI * 2 - Math.PI / 2
        );
        ctx.moveTo(x1 + radius, y1);
      } else if (type === "lefttop") {
        ctx.lineTo(x1 + radius, y1);
        ctx.arc(
          x1 + radius + 0.5,
          y1 - radius + 0.5,
          radius,
          Math.PI * 2 + Math.PI / 2,
          Math.PI
        );
        ctx.moveTo(x1, y1 - radius);
      } else if (type === "topleft") {
        ctx.lineTo(x1, y1 + radius);
        ctx.arc(
          x1 - radius + 0.5,
          y1 + radius + 0.5,
          radius,
          Math.PI * 2,
          Math.PI * 3 + Math.PI / 2,
          true
        );
        ctx.lineTo(x1 - radius, y1);
      } else if (type === "leftbottom") {
        ctx.lineTo(x1 + radius, y1);
        ctx.arc(
          x1 + radius + 0.5,
          y1 + radius + 0.5,
          radius,
          Math.PI * 2 - Math.PI / 2,
          Math.PI,
          true
        );
        ctx.lineTo(x1, y1 + radius);
      } else if (type === "righttop") {
        ctx.lineTo(x1 - radius, y1);
        ctx.arc(
          x1 - radius + 0.5,
          y1 - radius + 0.5,
          radius,
          Math.PI * 2 + Math.PI / 2,
          Math.PI * 2,
          true
        );
        ctx.moveTo(x1, y1 - radius);
      } else {
        ctx.lineTo(x1, y1);
      }
    }

    prev = p;
  }

  const lastItem = config.path[config.path.length - 1];
  ctx.lineTo(lastItem[0], lastItem[1]);
  ctx.stroke();
};
