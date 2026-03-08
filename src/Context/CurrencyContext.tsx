import React, { createContext, useContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext({
  currency: '€',
  setCurrency: (c: string) => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('optima_currency') || '€');

  useEffect(() => {
    localStorage.setItem('optima_currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
