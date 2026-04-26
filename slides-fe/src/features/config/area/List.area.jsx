import React from "react";
import ConfigCrudList from "../components/configCrud/ConfigCrudList";
import { deleteArea, getAllArea } from "../../../services/apis/config/areaService";

const ListArea = () => {
  return (
    <ConfigCrudList
      singularLabel="Area"
      collectionLabel="Areas"
      routeBase="/setup/area"
      getAllItems={getAllArea}
      deleteItem={deleteArea}
    />
  );
};

export default ListArea;
