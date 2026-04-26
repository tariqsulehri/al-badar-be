import React from "react";
import ConfigCrudForm from "../components/configCrud/ConfigCrudForm";
import {
  createSubArea,
  deleteSubArea,
  findSubAreaById,
  updateSubArea,
} from "../../../services/apis/config/subAreaService";

const CreateSubarea = () => {
  return (
    <ConfigCrudForm
      singularLabel="Sub Area"
      collectionLabel="Sub Areas"
      routeBase="/setup/subarea"
      findById={findSubAreaById}
      createItem={createSubArea}
      updateItem={updateSubArea}
      deleteItem={deleteSubArea}
    />
  );
};

export default CreateSubarea;
