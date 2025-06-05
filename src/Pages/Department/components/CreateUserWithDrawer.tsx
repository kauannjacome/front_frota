import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Select,
  message,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import UserForm, { UserFormValues } from '../../User/components/UserForm';
import api from '../../../services/api';

interface DepartmentOption {
  label: string;
  value: number;
}

export default function CreateUserWithDrawer() {
  const navigate = useNavigate();

  // Estado para controlar visibilidade dos Drawers
  const [deptDrawerVisible, setDeptDrawerVisible] = useState(false);
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);

  // Estado para armazenar a lista de departamentos (poderia vir de uma chamada à API)
  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>([]);

  // Estado para guardar o departamento selecionado pelo usuário
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  // Estado para indicar se o formulário está “submetendo”
  const [loading, setLoading] = useState(false);

  // Simulação de fetch das opções de departamentos (poderia vir de api.get('/departments'))
  useEffect(() => {

  
  }, []);

  // Quando o usuário confirma o departamento, fecha o drawer de departamento e abre o drawer de criação de usuário
  const handleDeptNext = () => {
    if (selectedDeptId === null) {
      message.warning('Selecione um departamento antes de prosseguir.');
      return;
    }
    setDeptDrawerVisible(false);
    setUserDrawerVisible(true);
  };

  // Ao submeter o formulário de usuário
  const handleFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      // Monta o payload incluindo o departamento selecionado
      const payload = {
        ...values,
        birth_date: values.birth_date?.toISOString(),
        death_date: values.death_date?.toISOString(),
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
        // Garante que o campo department_ids contenha apenas o departamento que escolhemos
        department_ids: selectedDeptId !== null ? [selectedDeptId] : [],
      };

      await api.post('/user', payload);
      message.success('Usuário criado com sucesso!');
      // Fecha o drawer de usuário e volta para a lista
      setUserDrawerVisible(false);
      navigate('/user');
    } catch (error) {
      console.error(error);
      message.error('Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  // Se o usuário fechar manualmente o drawer de usuário, reseta tudo
  const handleUserDrawerClose = () => {
    setUserDrawerVisible(false);
    setSelectedDeptId(null);
  };

  return (
    <>
      {/* Botão principal para iniciar o fluxo de selecionar departamento */}
      <Button type="primary" onClick={() => setDeptDrawerVisible(true)}>
        Selecionar Departamento para Criar Usuário
      </Button>

      {/* Drawer 1: seleção de departamento */}
      <Drawer
        title="Selecione um Departamento"
        width={360}
        onClose={() => setDeptDrawerVisible(false)}
        visible={deptDrawerVisible}
        footer={
          <Space style={{ width: '100%', justifyContent: 'end' }}>
            <Button onClick={() => setDeptDrawerVisible(false)}>Cancelar</Button>
            <Button type="primary" onClick={handleDeptNext}>
              Próximo
            </Button>
          </Space>
        }
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Escolha o departamento"
          options={departmentOptions}
          onChange={value => setSelectedDeptId(value)}
          value={selectedDeptId !== null ? selectedDeptId : undefined}
        />
      </Drawer>

      {/* Drawer 2: formulário de criação de usuário já com department_ids preenchido */}
      <Drawer
        title="Criar Usuário"
        width={600}
        onClose={handleUserDrawerClose}
        visible={userDrawerVisible}
        destroyOnClose
      >
        <UserForm
          // Preenche initialValues já colocando o department_ids como [selectedDeptId]
          initialValues={{
            cpf: '',
            full_name: '',
            cnh: null,
            email: null,
            phone_number: null,
            nationality: null,
            birth_date: undefined,
            death_date: undefined,
            mother_name: null,
            father_name: null,
            password_hash: '',
            is_password_temp: false,
            number_try: 0,
            is_blocked: false,
            role: 'ADMIN_LOCAL',
            type: 'CONTRATADO',
            accepted_terms: false,
            accepted_terms_at: undefined,
            accepted_terms_version: null,
            subscriber_id: 1, // substituir pelo ID real
            supplier_id: null,
            // Já atribui o departamento selecionado aqui
            department_ids: selectedDeptId !== null ? [selectedDeptId] : [],
          }}
          onFinish={handleFinish}
          onCancel={handleUserDrawerClose}
          // Passa as opções de departamento para que o Select dentro do UserForm as exiba (mesmo que já venha pré-selecionado)
          departmentOptions={departmentOptions.map(dep => ({
            label: dep.label,
            value: dep.value,
          }))}
        />
      </Drawer>
    </>
  );
}
