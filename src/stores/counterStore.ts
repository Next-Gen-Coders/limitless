import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { indexedDBService } from '../lib/indexedDB';

interface CounterState {
  counters: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  increment: (id: string) => Promise<void>;
  decrement: (id: string) => Promise<void>;
  setValue: (id: string, value: number) => Promise<void>;
  reset: (id: string) => Promise<void>;
  loadCounters: () => Promise<void>;
  getCounter: (id: string) => number;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set, get) => ({
      counters: {},
      isLoading: false,
      error: null,

      increment: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const currentValue = get().getCounter(id);
          const newValue = currentValue + 1;
          
          await indexedDBService.setCounter(id, newValue);
          
          set((state) => ({
            counters: { ...state.counters, [id]: newValue },
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to increment counter',
            isLoading: false 
          });
        }
      },

      decrement: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const currentValue = get().getCounter(id);
          const newValue = currentValue - 1;
          
          await indexedDBService.setCounter(id, newValue);
          
          set((state) => ({
            counters: { ...state.counters, [id]: newValue },
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to decrement counter',
            isLoading: false 
          });
        }
      },

      setValue: async (id: string, value: number) => {
        try {
          set({ isLoading: true, error: null });
          
          await indexedDBService.setCounter(id, value);
          
          set((state) => ({
            counters: { ...state.counters, [id]: value },
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to set counter value',
            isLoading: false 
          });
        }
      },

      reset: async (id: string) => {
        await get().setValue(id, 0);
      },

      loadCounters: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const countersData = await indexedDBService.getAllCounters();
          const countersMap: Record<string, number> = {};
          
          countersData.forEach((counter) => {
            countersMap[counter.id] = counter.value;
          });
          
          set({ counters: countersMap, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load counters',
            isLoading: false 
          });
        }
      },

      getCounter: (id: string) => {
        return get().counters[id] || 0;
      },
    }),
    {
      name: 'counter-store',
    }
  )
); 