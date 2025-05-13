// src/pages/CreateDepartment.tsx
import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import DepartmentForm, { DepartmentFormValues } from './components/DepartmentForm';
import api from '../../services/api';

export default function CreateDepartment() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: DepartmentFormValues) => {
    setLoading(true);
    try {
      await api.post('/department', values);
      message.success('Departamento criado com sucesso!');
      navigate('/department');
    } catch {
      message.error('Erro ao criar departamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Departamento" style={{ padding: 24 }}>
      <DepartmentForm
        initialValues={{
          subscriber_id: undefined,
          name: '',

        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}
