import React, { ReactNode, createContext, useState } from 'react';
import { WINGS } from '../../3dComponents/cosntants';

export const WingContext = createContext<{
  choosedWingType: string;
  updateWingType: (newType: string) => void;
}>({
  choosedWingType: WINGS[0].name,
  updateWingType: () => {},
});

interface WingProviderProps {
  children: ReactNode;
}

export const WingProvider = ({ children }: WingProviderProps) => {
  const [choosedWingType, setChoosedWingType] = useState<string>(WINGS[0].name);

  const updateWingType = (newType: string) => {
    setChoosedWingType(newType);
  };

  return (
    <WingContext.Provider value={{ choosedWingType, updateWingType }}>
      {children}
    </WingContext.Provider>
  );
};