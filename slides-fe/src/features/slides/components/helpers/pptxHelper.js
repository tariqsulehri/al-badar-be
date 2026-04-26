const pptxHelper = {
  createPptx: async function (pptx, records) {
    if (!records || records.length === 0) {
      return;
    }

    for (const slideData of records) {
      const slide = pptx.addSlide();
      const imageX = 2.3;
      const imageY = 0.2;
      const imageHeight = 5.25;
      const imageWidth = 7.5;
      const imagePath = slideData.image;

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.1,
        y: 0.1,
        w: 9.8,
        h: 5.44,
        fill: { color: "#ffffff" },
        rotate: 0,
      });

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.1,
        y: 0.1,
        w: 9.8,
        h: 5.44,
        fill: { color: "#ffffff" },
        rotate: 0,
      });

      await this.pptxMainImage(slide, imagePath, imageX, imageY, imageHeight, imageWidth);
      await this.pptxDetailsTable(slide, slideData);
      await this.pptxLogoTable(slide);
    }
  },

  pptxMainImage: async function (slide, imagePath, imageX, imageY, imageHeight, imageWidth) {
    // const imageX = 2.3;
    // const imageY = 0.2;
    // const imageHeight = 5.25;
    // const imageWidth = 7.5;
    //const imagePath = "http://localhost:3500/uploads/slides/images/ade0e8029b8b654109232636989d827a14b0.jpeg"
    return slide.addImage({
      path: imagePath,
      x: imageX,
      y: imageY,
      w: imageWidth,
      h: imageHeight,
    });
  },

  pptxLogoTable: async function (slide, formData) {
    let options = {
      valign: "center",
      align: "center",
      fontFace: "Arial",
      fontSize: "10",
    };

    let arrTabRows1 = [
      [
        {
          text: 'Al-Badar',
          options: { align: "left", valign: "center", fontFace: "Arial", color: "#f7f5f5", fill: "#c72210" },
        }
      ],
      [
        {
          text: 'Media Solution',
          options: { align: "left", valign: "center", fontFace: "Arial", color: "#080100", fill: "#F7F7F7" },
        }
      ],
    ];

    let tableX = 0.15;
    let tableY = 0.20;
    let tableW = 2.1;
    let tableH = 0.4;

    slide.addTable(arrTabRows1, {
      x: tableX,
      y: tableY,
      w: tableW,
      rowH: tableH,
      fill: { color: "F7F7F7" },
      fontSize: 10,
      color: "363636",
      border: { pt: "1", color: "BBCCDD" },
    });
  },
  pptxDetailsTable: async function (slide, formData) {
    let options = {
      valign: "center",
      align: "left",
      fontFace: "Arial",
      fontSize: "10",
    };

    let arrTabRows1 = [
      [
        {
          text: formData.city + " - " + formData.area + " - " + formData.subArea,
          options: { align: "left", valign: "center", fontFace: "Arial", color: "#f7f5f5", fill: "#c72210", colspan: "2" },
        },
      ],
      [
        {
          text: "Code",
          options: {
            ...options,
          },
        },
        {
          text: formData.code,
          options: {
            ...options,
          },
        },
      ],
      [
        {
          text: "Size",
          options: {
            ...options,
          },
        },
        {
          text: formData.height_feets + " X " + formData.width_feets,
          options: {
            ...options,
          },
        },
      ],
      [
        {
          text: "Dimension",
          options: {
            ...options,
          },
        },
        {
          text: formData.dimension,
          options: {
            ...options,
          },
        },
      ],
      [
        {
          text: "Lights",
          options: {
            ...options,
          },
        },
        {
          text: formData.lights,
          options: {
            ...options,
          },
        },
      ],
      [
        {
          text: "Status",
          options: {
            ...options,
          },
        },
        {
          text: formData.status,
          options: {
            ...options,
          },
        },
      ],
    ];

    let tableX = 0.15;
    let tableY = 2.25;
    let tableW = 2.1;
    let tableH = 0.4;

    slide.addTable(arrTabRows1, {
      x: tableX,
      y: tableY,
      w: tableW,
      rowH: tableH,
      fill: { color: "F7F7F7" },
      fontSize: 10,
      color: "363636",
      border: { pt: "1", color: "BBCCDD" },
    });
  },
};

export default pptxHelper;
