// src/pages/DepartmentList.tsx
import { useEffect, useState } from 'react';
import { List, Button, message, Row, Col, Card } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { data, useNavigate, useParams } from 'react-router-dom';
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
// Defina a tipagem da resposta de refresh
interface RefreshResponse {
  status: number;
  message: string;
  token: string;
}

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
const { id: subscriberIdNum } = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Department[]>(`/department/subscriber/${subscriberIdNum}`)
      .then(({ data }) => setDepartments(data))
      .catch(err => {
        console.error('Erro ao carregar departamentos', err);
        message.error('Não foi possível carregar a lista de departamentos.');
      });
  }, []);

  const onFinish = async (id: number) => {
    try {
    const values = {
      subscriber_id: subscriberIdNum,
      department_id: id
    };
      // Chama o endpoint de refresh
      const response = await api.post<RefreshResponse>('/auth/admin/refresh', values);
      // Para apagar apenas esse item específico

      sessionStorage.setItem('authTokenFrota', response.data.token);
      console.log(response.data.token)
      message.success('Token regenerado com sucesso.');

      // Redireciona para a página de viagens
      navigate('/trip');

    } catch (error: any) {
      console.error('Erro ao regenerar token:', error);
      message.error('Erro ao regenerar o token. Tente novamente.');
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
