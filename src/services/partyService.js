const Party = require("../models/party.model");

const createParty = async (partyData) => {
  const party = new Party(partyData);
  await party.save();
  return party;
};

const updateParty = async (partyId, updateData) => {
  const party = await Party.findOneAndUpdate(mongoose.Types.ObjectId(partyId), updateData, {
    new: true, // Return the updated document
    runValidators: true, // Validate before update
  });
  return party;
};

const deleteParty = async (id) => {
    await Party.findByIdAndDelete(mongoose.Types.ObjectId(id));
    return { message: 'Item deleted successfully' };
    
};

const findParty = async (id) => {
    const party = await Party.find({ _id: mongoose.Types.ObjectId(id)});
    return party;
  };

const listParties = async () => {
  const parties = await Party.find();
  return parties;
};

module.exports = {
  createParty,
  updateParty,
  deleteParty,
  listParties,
  findParty,
};
