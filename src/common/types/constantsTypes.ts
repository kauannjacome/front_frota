export const DriverTypeOptions = [
  { value: 'CONTRATADO', label: 'Motorista com contrato CLT' },
  { value: 'DIARISTA',    label: 'Motorista contratado por diária' },
] as const;

export const RoleUserTypeOptions = [
  { value: 'MANAGE',      label: 'Manage' },
  { value: 'ADMIN_LOCAL', label: 'Admin local' },
  { value: 'SECRETARY',   label: 'Secretary' },
  { value: 'TYPIST',      label: 'Typist' },
] as const;

export const RoleUserSupplierTypeOptions = [
  { value: 'ATTENDANT',   label: 'Attendant' },
  { value: 'ADMIN_LOCAL', label: 'Admin local' },
  { value: 'TYPIST',      label: 'Typist' },
] as const;

export const VehicleTypeOptions = [
  { value: 'SEDAN',                  label: 'Carro sedan' },
  { value: 'HATCH',                  label: 'Carro hatch' },
  { value: 'SUV',                    label: 'Veículo utilitário esportivo' },
  { value: 'COUPE',                  label: 'Carro cupê' },
  { value: 'CONVERSIVEL',            label: 'Carro conversível' },
  { value: 'PERUA',                  label: 'Carro perua' },
  { value: 'MINIVAN',                label: 'Minivan' },
  { value: 'VAN',                    label: 'Van' },
  { value: 'PICAPE',                 label: 'Picape' },
  { value: 'MOTOCICLETA',            label: 'Motocicleta' },
  { value: 'TRICICLO',               label: 'Triciclo' },
  { value: 'QUADRICICLO',            label: 'Quadriciclo' },
  { value: 'VEICULO_TODO_TERRENO',   label: 'Veículo todo-terreno' },
  { value: 'CAMINHAO_LEVE',          label: 'Caminhão leve (até 3,5 t)' },
  { value: 'CAMINHAO_MEDIO',         label: 'Caminhão médio' },
  { value: 'CAMINHAO_PESADO',        label: 'Caminhão pesado' },
  { value: 'REBOQUE',                label: 'Trailer / semirreboque' },
  { value: 'ONIBUS_URBANO',          label: 'Ônibus urbano' },
  { value: 'ONIBUS_TURISTICO',       label: 'Ônibus turístico' },
  { value: 'ONIBUS_ESCOLAR',         label: 'Ônibus escolar' },
  { value: 'MINIBUS',                label: 'Minibus' },
  { value: 'TRATOR',                 label: 'Veículo agrícola: trator' },
  { value: 'COLHEDORA',              label: 'Veículo agrícola: colhedora' },
  { value: 'PLANTADEIRA',            label: 'Veículo agrícola: plantadeira' },
  { value: 'PULVERIZADOR',           label: 'Veículo agrícola: pulverizador' },
  { value: 'RETROESCAVADEIRA',       label: 'Equipamento: retroescavadeira' },
  { value: 'ENSILADEIRA',            label: 'Equipamento: ensiladeira' },
  { value: 'ROCADEIRA',              label: 'Equipamento: roçadeira' },
  { value: 'AMBULANCIA',             label: 'Veículo de emergência: ambulância geral' },
  { value: 'AMBULANCIA_BASICA',      label: 'Ambulância básica' },
  { value: 'AMBULANCIA_UTI_MOVEL',   label: 'Unidade móvel de UTI' },
  { value: 'UNIDADE_MOVEL_SAUDE',    label: 'Unidade móvel de saúde' },
  { value: 'VEICULO_RESCATE',        label: 'Veículo de resgate' },
  { value: 'AUTOMEDICA',             label: 'Serviço médico automotor' },
] as const;

export const SupplyTypeOptions = [
  { value: 'COMPLETE',                         label: 'Completo' },
  { value: 'LITRO_ESPECIFICADO',               label: 'Litro especificado' },
  { value: 'COMPLETE_SEM_CADASTRO',            label: 'Completo sem cadastro' },
  { value: 'LITRO_ESPECIFICADO_SEM_CADASTRO',  label: 'Litro especificado sem cadastro' },
] as const;

export const TripStatusOptions = [
  { value: 'PENDENTE',     label: 'Pendente' },
  { value: 'APROVADO',     label: 'Aprovada' },
  { value: 'EM_ANDAMENTO', label: 'Andamento' },
  { value: 'CONCLUIDO',    label: 'Concluída' },
  { value: 'CANCELADO',    label: 'Cancelada' },
] as const;
// Mapeamento de cores para cada status
export const TripStatusColors: Record<string, string> = {
  PENDENTE:     'gold',
  APROVADO:     'green',
  EM_ANDAMENTO: 'blue',
  CONCLUIDO:    'cyan',
  CANCELADO:    'red',
};
export const MaintenanceTypeOptions = [
  { value: 'PREVENTIVA', label: 'Manutenção preventiva' },
  { value: 'CORRETIVA',  label: 'Manutenção corretiva' },
  { value: 'INSPECAO',   label: 'Inspeção' },
] as const;

export const FuelTypeOptions = [
  { value: 'GASOLINA', label: 'Gasolina' },
  { value: 'DIESEL',   label: 'Diesel' },
  { value: 'ETANOL',   label: 'Etanol' },
  { value: 'ELETRICO', label: 'Elétrico' },
  { value: 'OUTRO',    label: 'Outro tipo de combustível' },
] as const;

export const NotificationTypeOptions = [
  { value: 'VENCIMENTO_CNH',        label: 'Alerta de vencimento da CNH' },
  { value: 'MANUTENCAO_PENDENTE',   label: 'Alerta de manutenção pendente' },
  { value: 'VENCIMENTO_SEGURO',     label: 'Alerta de vencimento do seguro' },
  { value: 'OUTRO',                 label: 'Outros tipos de notificação' },
] as const;

export const ExpenseTypeOptions = [
  { value: 'PEDAGIO',        label: 'Despesa de pedágio' },
  { value: 'ESTACIONAMENTO', label: 'Despesa de estacionamento' },
  { value: 'MULTA',          label: 'Despesa de multa' },
  { value: 'REEMBOLSO',      label: 'Outros reembolsos' },
  { value: 'OUTRO',          label: 'Outros tipos de despesa' },
] as const;

export const SubscriberTypeOptions = [
  { value: 'PAGO',     label: 'Pago' },
  { value: 'ATRASADO', label: 'Atrasado' },
  { value: 'BLOQUEADO',label: 'Bloqueado' },
] as const;
