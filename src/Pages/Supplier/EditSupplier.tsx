// src/pages/EditSupplier.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SupplierForm, { SupplierFormValues } from './components/SupplierForm';

export default function EditSupplier() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<SupplierFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<SupplierFormValues>(`/supplier/${id}`);
        setInitialValues(res.data);
      } catch {
        message.error('Erro ao carregar fornecedor.');
        navigate('/supplier');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: SupplierFormValues) => {
    setLoading(true);
    try {
      await api.patch(`/supplier/${id}`, values);
      message.success('Fornecedor atualizado com sucesso!');
      navigate('/supplier');
    } catch {
      message.error('Erro ao atualizar fornecedor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Fornecedor não encontrado.</div>;

  return (
    <Card title="Editar Fornecedor" style={{ padding: 24 }}>
      <SupplierForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/supplier')}
      />
    </Card>
  );
}
