import React from "react";
import ConfigCrudList from "../components/configCrud/ConfigCrudList";
import { deleteCity, getAllCity } from "../../../services/apis/config/cityService";

const CityList = () => {
  return (
    <ConfigCrudList
      singularLabel="City"
      collectionLabel="Cities"
      routeBase="/setup/city"
      getAllItems={getAllCity}
      deleteItem={deleteCity}
    />
  );
};

export default CityList;
