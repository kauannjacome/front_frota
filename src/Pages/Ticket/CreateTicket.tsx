import  { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import TicketForm, { TicketFormValues } from './components/TicketForm';
import api from '../../services/api';

export default function CreateTicket() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      await api.post('/ticket', payload);
      message.success('Passagem criada com sucesso!');
      navigate('/ticket');
    } catch {
      message.error('Erro ao criar passagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Passagem" style={{ padding: 24 }}>
      <TicketForm
        initialValues={{
          supplier_id: 0,
          passenger_id: 0,
          attendant_viewed: false,
          start_state: '',
          start_city: '',
          end_state: '',
          end_city: '',
        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}
