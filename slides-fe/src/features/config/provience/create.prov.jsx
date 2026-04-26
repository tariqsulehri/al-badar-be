import React from "react";
import ConfigCrudForm from "../components/configCrud/ConfigCrudForm";
import {
  createProv,
  deleteProv,
  findProvById,
  updateProv,
} from "../../../services/apis/config/provService";

const CreateProv = () => {
  return (
    <ConfigCrudForm
      singularLabel="Provence"
      collectionLabel="Provences"
      routeBase="/setup/prov"
      findById={findProvById}
      createItem={createProv}
      updateItem={updateProv}
      deleteItem={deleteProv}
    />
  );
};

export default CreateProv;
