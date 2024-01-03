import React, { createContext, useContext, useState } from 'react';
import { FormDataType } from '../interfaces/InterfacesStock';
 
interface FormDataListContextType {
  formDataList: FormDataType[];
  setFormDataList: React.Dispatch<React.SetStateAction<FormDataType[]>>;
}

const FormDataListContext = createContext<FormDataListContextType | undefined>(undefined);

export const FormDataListProvider:  React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const [formDataListContext, setFormDataListContext] = useState<FormDataType[]>([]);

  return (
    <FormDataListContext.Provider value={{ formDataList: formDataListContext, setFormDataList: setFormDataListContext }}>
      {children}
    </FormDataListContext.Provider>
  );
};

export const useFormDataList = () => {
  const context = useContext(FormDataListContext);
  if (context === undefined) {
    throw new Error('useFormDataList must be used within a FormDataListProvider');
  }
  return context;
};
