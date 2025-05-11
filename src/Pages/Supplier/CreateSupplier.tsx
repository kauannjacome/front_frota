
// src/pages/CreateSupplier.tsx
import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SupplierForm, { SupplierFormValues } from './components/SupplierForm';
import api from '../../services/api';

export default function CreateSupplier() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: SupplierFormValues) => {
    setLoading(true);
    try {
      await api.post('/supplier', values);
      message.success('Fornecedor criado com sucesso!');
      navigate('/supplier');
    } catch {
      message.error('Erro ao criar fornecedor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Fornecedor" style={{ padding: 24 }}>
      <SupplierForm
        initialValues={{
          name: '',
          telephone: '',
          email: '',
          cnpj: '',
          category: '',
        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}