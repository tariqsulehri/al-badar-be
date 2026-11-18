import React from "react";
import ConfigCrudList from "../components/configCrud/ConfigCrudList";
import { deleteProv, getAllProv } from "../../../services/apis/config/provService";

const ListProv = () => {
  return (
    <ConfigCrudList
      singularLabel="Province"
      collectionLabel="Provinces"
      routeBase="/setup/prov"
      getAllItems={getAllProv}
      deleteItem={deleteProv}
    />
  );
};

export default ListProv;
