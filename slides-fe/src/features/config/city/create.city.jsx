import React from "react";
import ConfigCrudForm from "../components/configCrud/ConfigCrudForm";
import {
  createCity,
  deleteCity,
  findCityById,
  updateCity,
} from "../../../services/apis/config/cityService";

const CreateCity = () => {
  return (
    <ConfigCrudForm
      singularLabel="City"
      collectionLabel="Cities"
      routeBase="/setup/city"
      findById={findCityById}
      createItem={createCity}
      updateItem={updateCity}
      deleteItem={deleteCity}
    />
  );
};

export default CreateCity;
