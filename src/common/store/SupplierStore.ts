// src/store/SupplierStore.ts
import { create } from 'zustand';
import api from '../../services/api';
import { Supplier } from '../types';

interface SupplierState {
  suppliers: Supplier[] | null;
  fetchSuppliers: () => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  // estado inicial: sem fornecedores carregados
  suppliers: null,

  // busca os fornecedores uma única vez
  fetchSuppliers: async () => {
    if (get().suppliers) return; // já temos dados, evita nova requisição

    try {
      const { data } = await api.get<Supplier[]>('/Supplier');
      set({ suppliers: data });
    } catch (e: any) {
      console.error('Erro ao carregar fornecedores', e);
    }
  },
}));
