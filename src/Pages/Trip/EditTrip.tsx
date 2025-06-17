import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../services/api';
import TripForm, { TripFormValues, PersonRow } from './components/TripForm';

export default function EditTrip() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rawData, setRawData] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<Partial<TripFormValues> | null>(null);
  const [initialPersons, setInitialPersons] = useState<PersonRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<any>(`/trip/${id}`);
        const data = res.data;
        setRawData(data);

        // Define apenas os campos usados pelo formulário
        const formValues: Partial<TripFormValues> = {
          purpose: data.purpose,
          start_state: data.start_state,
          start_city: data.start_city,
          end_state: data.end_state,
          end_city: data.end_city,
          journey_start: data.journey_start ? moment(data.journey_start) : undefined,
          journey_back: data.journey_back ? moment(data.journey_back) : undefined,
          driver_id: data.driver_id,
          vehicle_id: data.vehicle_id,
          status: data.status,
        };
        setInitialValues(formValues);
        console.log(formValues)

        // Mapeia passageiros existentes
        const passengers = Array.isArray(data.trip_passengers)
          ? data.trip_passengers.map((p: any) => ({
            id: p.passenger_id,
            full_name: p.passenger.full_name,
            birth_date: p.passenger.birth_date,
            type: p.type, 
            dropoff_location: p.dropoff_location,
            notes: p.notes,
          }))
          : [];
        setInitialPersons(passengers);
      } catch (error) {
        console.error('Erro ao carregar viagem:', error);
        message.error('Erro ao carregar viagem.');
        navigate('/trip');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  console.log(initialValues)
  const handleFinish = async (values: TripFormValues, persons: PersonRow[]) => {
    if (!rawData) return;
    setLoading(true);
    try {
      // Prepara payload apenas com campos relevantes
      const payload = {
        purpose: values.purpose,
        start_state: values.start_state,
        start_city: values.start_city,
        end_state: values.end_state,
        end_city: values.end_city,
        journey_start: values.journey_start?.toISOString() ?? null,
        journey_back: values.journey_back?.toISOString() ?? null,
        status: values.status,
        vehicle_id: values.vehicle_id,
        department_id: rawData.department_id,
        subscriber_id: rawData.subscriber_id,
        driver_id: values.driver_id,
        authorizer_id: rawData.authorizer_id,
        attendant_id: rawData.attendant_id,
        persons: persons.map((p) => ({
          person_id: p.id,
          type: p.type,
          dropoff_location: p.dropoff_location,
          notes: p.notes,
        })),
      };
      await api.patch(`/trip/${id}`, payload);
      message.success('Viagem atualizada com sucesso!');
      navigate('/trip');
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      message.error('Erro ao atualizar viagem.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Viagem não encontrada.</div>;

  return (
    <Card title="Editar Viagem" style={{ padding: 24 }}>
      <TripForm
        initialValues={initialValues}
        initialPersons={initialPersons}
        loading={loading}
        onFinish={handleFinish}
        onCancel={() => navigate('/trip')}
      />
    </Card>
  );
}
