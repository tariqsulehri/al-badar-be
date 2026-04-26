import React from "react";
import ConfigCrudForm from "../components/configCrud/ConfigCrudForm";
import {
  createArea,
  deleteArea,
  findAreaById,
  updateArea,
} from "../../../services/apis/config/areaService";

const CreateArea = () => {
  return (
    <ConfigCrudForm
      singularLabel="Area"
      collectionLabel="Areas"
      routeBase="/setup/area"
      findById={findAreaById}
      createItem={createArea}
      updateItem={updateArea}
      deleteItem={deleteArea}
    />
  );
};

export default CreateArea;
