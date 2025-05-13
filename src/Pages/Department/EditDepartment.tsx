// src/pages/EditDepartment.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import DepartmentForm, { DepartmentFormValues } from './components/DepartmentForm';

export default function EditDepartment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<DepartmentFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<DepartmentFormValues>(`/department/${id}`);
        // API deve retornar algo como { subscriber_id, name, department_logo }
        setInitialValues({
          subscriber_id: res.data.subscriber_id,
          name: res.data.name,
      
        });
      } catch {
        message.error('Erro ao carregar departamento.');
        navigate('/department');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: DepartmentFormValues) => {
    setLoading(true);
    try {
      await api.patch(`/department/${id}`, values);
      message.success('Departamento atualizado com sucesso!');
      navigate('/department');
    } catch {
      message.error('Erro ao atualizar departamento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Departamento não encontrado.</div>;

  return (
    <Card title="Editar Departamento" style={{ padding: 24 }}>
      <DepartmentForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/department')}
      />
    </Card>
  );
}
