import { create } from 'zustand';

const useConnectionStore = create((set) => ({
  isConnected: false,
  connectionError: null,
  setConnected: (status) => set({ isConnected: status }),
  setConnectionError: (error) => set({ connectionError: error }),
  resetConnection: () => set({ isConnected: false, connectionError: null }),
}));

export default useConnectionStore; 