// src/pages/EditUser.tsx
import  { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../services/api';
import UserForm, { UserFormValues } from './components/UserForm';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<UserFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<UserFormValues>(`/user/${id}`);
        const data = res.data;
        setInitialValues({
          ...data,
          accepted_terms_at: data.accepted_terms_at
            ? moment(data.accepted_terms_at)
            : undefined,
        });
      } catch {
        message.error('Erro ao carregar usuário.');
        navigate('/user');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
      };
      await api.patch(`/user/${id}`, payload);
      message.success('Usuário atualizado com sucesso!');
      navigate('/user');
    } catch {
      message.error('Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Usuário não encontrado.</div>;

  return (
    <Card title="Editar Usuário" style={{ padding: 24 }}>
      <UserForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/user')}
      />
    </Card>
  );
}
