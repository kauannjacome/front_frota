// type_contract
export const DriverTypeOptions = [
  { value: 'CONTRATADO', label: 'Motorista com contrato CLT' },
  { value: 'DIARISTA', label: 'Motorista contratado por diária' },
] as const;

// role_user
export const RoleUserTypeOptions = [
  { value: 'MANAGER', label: 'Manage' },
  { value: 'SECRETARY', label: 'Secretary' },
  { value: 'ADMIN_LOCAL', label: 'Admin local' },
  { value: 'TYPIST', label: 'Typist' },
  { value: 'DRIVE', label: 'Drive' },
  { value: 'TYPIST_SUPPLY', label: 'Typist Supply' },
] as const;

// para usuários de fornecedor (role_user)
export const RoleUserSupplierTypeOptions = [
  { value: 'ADMIN_LOCAL', label: 'Admin local' },
  { value: 'TYPIST_SUPPLY', label: 'Typist Supply' },
] as const;

// supply_type
export const SupplyTypeOptions = [
  { value: 'COMPLETE', label: 'Completo' },
  { value: 'LITRO_ESPECIFICADO', label: 'Litro especificado' },
  { value: 'COMPLETE_SEM_CADASTRO', label: 'Completo sem cadastro' },
  { value: 'LITRO_ESPECIFICADO_SEM_CADASTRO', label: 'Litro especificado sem cadastro' },
] as const;

// status (viagem)
export const TripStatusOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'APROVADO', label: 'Aprovada' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO', label: 'Concluída' },
  { value: 'CANCELADO', label: 'Cancelada' },
] as const;

// cores para status
export const TripStatusColors: Record<string, string> = {
  PENDENTE: 'gold',
  APROVADO: 'green',
  EM_ANDAMENTO: 'blue',
  CONCLUIDO: 'cyan',
  CANCELADO: 'red',
};

// maintenance_type
export const MaintenanceTypeOptions = [
  { value: 'PREVENTIVA', label: 'Manutenção preventiva' },
  { value: 'CORRETIVA', label: 'Manutenção corretiva' },
  { value: 'INSPECAO', label: 'Inspeção' },
] as const;

// fuel_type
export const FuelTypeOptions = [
  { value: 'GASOLINA', label: 'Gasolina' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ETANOL', label: 'Etanol' },
  { value: 'ELETRICO', label: 'Elétrico' },
  { value: 'OUTRO', label: 'Outro tipo de combustível' },
] as const;

// expense_type
export const ExpenseTypeOptions = [
  { value: 'DIARIA', label: 'Diária' },
  { value: 'PEDAGIO', label: 'Despesa de pedágio' },
  { value: 'ESTACIONAMENTO', label: 'Despesa de estacionamento' },
  { value: 'MULTA', label: 'Despesa de multa' },
  { value: 'REEMBOLSO', label: 'Reembolso' },
  { value: 'OUTRO', label: 'Outros tipos de despesa' },
] as const;

// subscriber_type
export const SubscriberTypeOptions = [
  { value: 'PAGO', label: 'Pago' },
  { value: 'ATRASADO', label: 'Atrasado' },
  { value: 'BLOQUEADO', label: 'Bloqueado' },
] as const;

// supplier_category
export const SupplierCategoryOptions = [
  { value: 'POSTO_COMBUSTIVEL', label: 'Posto de combustível tradicional' },
  { value: 'ALTERNATIVO', label: 'Combustível alternativo (biometano, GNV, etc.)' },
  { value: 'ESTACAO_CARREGAMENTO', label: 'Posto de recarga elétrica' },
  { value: 'FORNECEDOR_EQUIPAMENTOS', label: 'Equipamentos em geral' },
  { value: 'FORNECEDOR_PECAS', label: 'Peças de reposição' },
  { value: 'FORNECEDOR_LUBRIFICANTES', label: 'Óleos e lubrificantes' },
  { value: 'OFICINA_SERVICOS', label: 'Mecânica e serviços' },
  { value: 'LAVACAO', label: 'Lavagem e estética' },
  { value: 'COMPANHIA_TRANSPORTE', label: 'Emissão de tickets/passagens' },
  { value: 'SEGUROS', label: 'Apólices de seguro' },
  { value: 'LOCADORA', label: 'Aluguel de veículos/equipamentos' },
] as const;

// component_category
export const ComponentCategoryOptions = [
  { value: 'SPARE_PART', label: 'Peças gerais' },
  { value: 'TIRE', label: 'Pneus' },
  { value: 'BATTERY', label: 'Baterias' },
  { value: 'FILTER', label: 'Filtros' },
  { value: 'OTHER', label: 'Outros' },
] as const;
