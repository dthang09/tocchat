import { useContext } from 'react';
import { PresenceContext } from '../context/PresenceContext';
import type { PresenceContextType } from '../types';

export const usePresence = (): PresenceContextType => {
  return useContext(PresenceContext);
};
