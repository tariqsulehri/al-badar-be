import React from 'react'

export function PptxDetailsTable({slide}) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.1,
    y: 0.1,
    w: 9.8,
    h: 5.44,
    fill: { color: "#42e0f5" },
    rotate: 0,
  });

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.1,
    y: 0.1,
    w: 9.8,
    h: 5.44,
    fill: { color: "#42e0f5" },
    rotate: 0,
  });

  slide.addImage({
    x: 0.15,
    y: 0.2,
    w: 2.1,
    h: 0.84,
    path: "logo.png",
    altText: "this is a gif",
  });

  slide.addText("Name:", {
    x: textX,
    y: textY,
    fontSize: textFontSize,
    color: "363636",
  });

  slide.addText("Tariq", {
    x: textX + textDunamicX,
    y: textY + textDunamicY,
    fontSize: textFontSize,
    color: "363636",
  });
}
