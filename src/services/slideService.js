const Slide = require("../models/slide");

const createSlide = async (slideData) => {
  const slide = new Slide(slideData);
  await slide.save();
  return slide;
};

const updateSlide = async (slideId, updateData) => {
  const slide = await Slide.findOneAndUpdate(mongoose.Types.ObjectId(slideId), updateData, {
    new: true, // Return the updated document
    runValidators: true, // Validate before update
  });
  return slide;
};

const deleteSlide = async (id) => {
    await Slide.findByIdAndDelete(mongoose.Types.ObjectId(id));
    return { message: 'Item deleted successfully' };
    
};

const findSlide = async (id) => {
    const slide = await Slide.find({ _id: mongoose.Types.ObjectId(id)});
    return slide;
  };

const listSlides = async () => {
  const slides = await Slide.find();
  return slides;
};

module.exports = {
  createSlide,
  updateSlide,
  deleteSlide,
  listSlides,
  findSlide,
};
