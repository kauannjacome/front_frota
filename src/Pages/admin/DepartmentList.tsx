// src/pages/DepartmentList.tsx
import { useEffect, useState } from 'react';
import { List, Button, message, Row, Col, Card } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

moment.locale('pt-br');

interface Department {
  id: number;
  uuid: string;
  subscriber_id: number;
  name: string;
  department_logo: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const { subscriberId } = useParams<{ subscriberId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Department[]>('/department')
      .then(({ data }) => setDepartments(data))
      .catch(err => {
        console.error('Erro ao carregar departamentos', err);
        message.error('Não foi possível carregar a lista de departamentos.');
      });
  }, []);

  const onFinish = async (id: number) => {
    try {
      // Monta corretamente o objeto de valores
      // const values = {
      //   department_id: id,
      //   // Converte subscriberId (string) para number
      //   subscriber_id: subscriberId ? Number(subscriberId) : undefined,
      // };

      // await api.post('/subscriber', values);
      navigate('/trip');
    } catch (error) {
      console.error('Erro ao adicionar assinante:', error);
      message.error('Não foi possível adicionar o assinante.');
    }
  };

  return (
    // Container com fundo azul claro e preenchimento
    <div style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', padding: 24 }}>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ backgroundColor: '#fff', width: '50%' }}>
          <List
            itemLayout="horizontal"
            dataSource={departments}
            renderItem={department => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="default"
                    shape="circle"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => onFinish(department.id)}
                  />,

                ]}
              >
                <List.Item.Meta
                  title={department.name}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
