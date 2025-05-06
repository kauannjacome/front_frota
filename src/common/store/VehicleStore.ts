// src/store/VeiculoStore.ts
import { create } from 'zustand';
import api from '../../services/api';

export interface Veiculo {
  id: number;
  subscriber_id: number;
  capacity_person?: number;
  surname?: string;
  mark?: string;
  model?: string;
  plate: string;
  renavam: string;
  type: string;             // ou um enum, conforme definido no seu client
  in_service: boolean;
  available: boolean;
  department_id?: number;

}

interface VeiculoState {
  veiculos: Veiculo[] | null;
  fetchVeiculos: () => Promise<void>;
}

export const useVeiculoStore = create<VeiculoState>((set, get) => ({
  veiculos: null,

  fetchVeiculos: async () => {
    if (get().veiculos) return; // já carregado, evita nova requisição

    try {
      // ajuste a rota abaixo conforme seu endpoint real
      const { data } = await api.get<Veiculo[]>('/veiculos');
      set({ veiculos: data });
    } catch (e: any) {
      console.error('Erro ao carregar veículos', e);
    }
  },
}));
