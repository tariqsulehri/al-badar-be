import { useSelector } from "react-redux";

export const useFetchFromStore = (reducerKey) => {
  return useSelector((state) => state[reducerKey]);
};
