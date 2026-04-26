
import httpClient from "../axios";
import {showToastNotification} from "../../helpers/notificationsHepler"

export const getAllParties = async (rowsPerPage, pageNo, searchBy, searchText) => {
    try{
        let {data} = await httpClient.get(`/Party/list?pageSize=${rowsPerPage}&pageNo=${pageNo}&searchBy=${searchBy}&searchText=${searchText}`);
        return data ? data : { data:null, totalRecords: 0 };
    } catch(error) {
        showToastNotification("error", "Something Went wrong..");
        console.log("Something Went wrong", error.message);
      }
};

export const getAllSuppliersForSelection = async () => {
    try{
        let {data} = await httpClient.get(`/party/suppliers/list_for_select`);
        return data ? data : [];
    } catch(error) {
        showToastNotification("error", "Something Went wrong..");
        console.log("Something Went wrong", error.message);
        return [];
      }
};

export const findPartyById = async (id) => {
    try{
        const resp = await httpClient.get(`http://localhost:3500/api/Party/find/${id}`);
        console.log(resp);
        return resp?.data;
    } catch(error){ 
      console.log("Something Went wrong", "Something Went wrong");
      showToastNotification("error", "Something Went wrong..");
    }
};
  

export const createParty = async (data) => {
    try{
        const resp = await httpClient.post("/Party/create", {data});
        data =  resp.data;
        if(data.status === "error"){
            return showToastNotification("error", "Duplicate or error while creating party");
        }
        showToastNotification("success", "Party created succfully..");
        return data;
    } catch(error) {
        
     showToastNotification("error", "Something Went wrong");
      console.log("Something Went wrong", error.message);
    }
};

export const updateParty = async (id,data) => {
    try{
        if(!id) throw new Error("Invalid id");
        await httpClient.post(`/Party/update/${id}`, {data});
        showToastNotification("success", "Party updated successfully..");
        return true;

    } catch(error){ 
      showToastNotification("error", "Something Went wrong..");
      console.log("Something Went wrong", error.message);
    }
};

export const deleteParty = async (id) => {
    try{
        
        if(!id) throw new Error("Invalid id");
        
        await httpClient.get(`/Party/${id}`);
        showToastNotification("success", 'Party deleted successfully.');
        return true;

    } catch(error) {
      showToastNotification("error", "Something Went wrong");
      console.log("Something Went wrong", error.message);
    }
};
