import React, { ReactNode, createContext, useState } from 'react';
import { WINGS } from '../../3dComponents/cosntants';

export const ModalContext = createContext<{
  state: boolean;
  updateState: (newState: boolean) => void;
}>({
    state: false,
    updateState: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [state, setState] = useState<boolean>(false);

  const updateState = (newState: boolean) => {
    setState(newState);
  };

  return (
    <ModalContext.Provider value={{ state, updateState }}>
      {children}
    </ModalContext.Provider>
  );
};