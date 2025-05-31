// src/pages/EditPerson.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../services/api';
import PersonForm, { PersonFormValues } from './components/PersonForm';

export default function EditPerson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // <-- note Partial<…> aqui
  const [initialValues, setInitialValues] = useState<Partial<PersonFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<PersonFormValues>(`/person/${id}`);
        console.log(res)
        const data = res.data;
        setInitialValues({
          ...data,
          birth_date: data.birth_date ? moment(data.birth_date) : undefined,
          death_date: data.death_date ? moment(data.death_date) : undefined,
        });
      } catch {
        message.error('Erro ao carregar pessoa.');
        navigate('/person');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: PersonFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date.toISOString(),
        death_date: values.death_date?.toISOString(),
      };
      await api.patch(`/person/${id}`, payload);
      message.success('Pessoa atualizada com sucesso!');
      navigate('/person');
    } catch {
      message.error('Erro ao atualizar pessoa.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Pessoa não encontrada.</div>;

  return (
    <Card title="Editar Pessoa" style={{ padding: 24 }}>
      <PersonForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/person')}
      />
    </Card>
  );
}
