const Provence = require("../models/provence.model");

const createRecord = async (data) => {
  const slide = new Slide(data);
  await slide.save();
  return slide;
};

const updateRecord = async (id, updateData) => {
  const result = await Slide.findOneAndUpdate(mongoose.Types.ObjectId(id), updateData, {
    new: true, // Return the updated document
    runValidators: true, // Validate before update
  });
  return result;
};

const deleteRecord= async (id) => {
    await Provence.findByIdAndDelete(mongoose.Types.ObjectId(id));
    return { message: 'Item deleted successfully' };
    
};

const findRecord = async (id) => {
    const result = await Provence.find({ _id: mongoose.Types.ObjectId(id)});
    return result;
  };

const listRecords = async () => {
  const result = await Provence.find({ is_active: true });
  
  return result;
};

module.exports = {
  createRecord,
  updateRecord,
  deleteRecord,
  listRecords,
  findRecord,
};
