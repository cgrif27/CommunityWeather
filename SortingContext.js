import React, { useState, useContext, createContext } from "react";

let sortByIndex = 0;
export const Context = createContext();

const GlobalContext = ({ children }) => {
  const [state, setState] = useState(sortByIndex);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default GlobalContext;
