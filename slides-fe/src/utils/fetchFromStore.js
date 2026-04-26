import { useSelector } from "react-redux";

export const fetchFromStore = function (reducer) {
  if (Array.isArray(reducer)) {
    const data = {};
    reducer.map((e) => {
      const reducerData = useSelector((state) => state[e]);
      data[e] = reducerData;
    });
    return data;
  }
  const data = useSelector((state) => state[reducer]);
  return data;
};
