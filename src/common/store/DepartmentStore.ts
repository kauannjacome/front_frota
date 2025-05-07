// src/store/DepartmentStore.ts
import { create } from 'zustand';
import api from '../../services/api';
import { Department } from '../types';

interface DepartmentState {
  departments: Department[] | null;
  fetchDepartments: () => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  // estado inicial: sem departamentos carregados
  departments: null,

  // busca os departamentos uma única vez
  fetchDepartments: async () => {
    if (get().departments) return; // já temos dados, evita nova requisição

    try {
      const { data } = await api.get<Department[]>('/departments');
      set({ departments: data });
    } catch (e: any) {
      console.error('Erro ao carregar departamentos', e);
    }
  },
}));
