import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserForm, { UserFormValues } from './components/UserForm';
import api from '../../services/api';

export default function CreateUser() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date?.toISOString(),
        death_date: values.death_date?.toISOString(),
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
      };

      await api.post('/user', payload);
      message.success('Usuário criado com sucesso!');
      navigate('/user');
    } catch (error) {
      console.error(error);
      message.error('Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Usuário" style={{ padding: 24 }}>
      <UserForm
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

        }}
        onFinish={handleFinish}
        onCancel={() => navigate(-1)}
      />
    </Card>
  );
}
