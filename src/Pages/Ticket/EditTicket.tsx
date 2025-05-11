import { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import TicketForm, { TicketFormValues } from './components/TicketForm';
import api from '../../services/api';

export default function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<TicketFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<TicketFormValues>(`/ticket/${id}`);
        const data = res.data;
        setInitialValues({
          ...data,
          travel_date: data.travel_date ? moment(data.travel_date) : undefined,
        });
      } catch {
        message.error('Erro ao carregar passagem.');
        navigate('/ticket');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: TicketFormValues) => {
    setLoading(true);
    try {
      const payload = {
        supplier_id: values.supplier_id,
        passenger_id: values.passenger_id,
        authorizer_id: values.authorizer_id,
        attendant_id: values.attendant_id,
        start_state: values.start_state,
        start_city: values.start_city,
        end_state: values.end_state,
        end_city: values.end_city,
        travel_date: values.travel_date?.toISOString(),
        attendant_viewed: values.attendant_viewed,
        cost: values.cost,
      };
      await api.patch(`/ticket/${id}`, payload);
      message.success('Passagem atualizada com sucesso!');
      navigate('/ticket');
    } catch {
      message.error('Erro ao atualizar passagem.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Passagem não encontrada.</div>;

  return (
    <Card title="Editar Passagem" style={{ padding: 24 }}>
      <TicketForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/ticket')}
      />
    </Card>
  );
}
