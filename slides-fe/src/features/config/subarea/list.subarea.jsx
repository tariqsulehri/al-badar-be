import React from "react";
import ConfigCrudList from "../components/configCrud/ConfigCrudList";
import { deleteSubArea, getAllSubArea } from "../../../services/apis/config/subAreaService";

const ListSubArea = () => {
  return (
    <ConfigCrudList
      singularLabel="Sub Area"
      collectionLabel="Sub Areas"
      routeBase="/setup/subarea"
      getAllItems={getAllSubArea}
      deleteItem={deleteSubArea}
    />
  );
};

export default ListSubArea;
