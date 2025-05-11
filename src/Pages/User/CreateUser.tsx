// src/pages/CreateUser.tsx
import  { useState } from 'react';
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
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
      };
      await api.post('/user', payload);
      message.success('Usuário criado com sucesso!');
      navigate('/user');
    } catch {
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
          name: '',
          cnh: null,
          email: null,
          phone_number: '',
          password_hash: '',
          is_password_temp: false,
          number_try: 0,
          is_blocked: false,
          role: 'ADMIN_LOCAL',
          type: 'CONTRATADO',
          accepted_terms: false,
          accepted_terms_at: undefined as any,
          accepted_terms_version: null,
          subscriber_id: 1, // substituir pelo ID real
          supplier_id: null,
        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}
