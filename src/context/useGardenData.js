import { useContext } from 'react';
import { GardenDataContext } from './gardenDataContextValue';

export function useGardenData() {
  const context = useContext(GardenDataContext);
  if (!context) {
    throw new Error('useGardenData must be used inside GardenDataProvider');
  }
  return context;
}
