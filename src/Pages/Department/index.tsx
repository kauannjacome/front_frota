import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message, Space, Popconfirm, Row, Col, Drawer } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';
import { useNavigate } from "react-router-dom";
import UserFormManager, { UserFormValues } from "../User/components/UserFormManager";

interface Subscriber {
  id: number;
  uuid: string;
  name: string;
  // outros campos, se necessário
}

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

export default function Department() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [loadingUserSubmit, setLoadingUserSubmit] = useState(false);

  // // Carrega lista de assinantes
  const loadSubscribers = async () => {
    const response = await api.get<any>('/subscriber');
    try {

      console.log("Resposta /subscriber →", response.data);
      setSubscribers(response.data);
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error);
      message.error('Não foi possível carregar assinantes.');
    }
  };

  // Carrega departamentos com filtros opcionais
  const loadDepartments = async (params: any = {}) => {
    try {
      const response = await api.get<Department[]>('/department', { params });
      setDepartments(response.data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      message.error('Não foi possível carregar departamentos.');
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    loadDepartments();
  }, []);

  // Ação de busca (submete filtros)
  const onSearch = (values: any) => {
    loadDepartments(values);
  };

  // Excluir departamento
  const onDelete = async (id: number) => {
    try {
      await api.delete(`/department/${id}`);
      setDepartments(prev => prev.filter(d => d.id !== id));
      message.success('Departamento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);
      message.error('Não foi possível excluir o departamento.');
    }
  };

  
  // -----------------------------
  // NOVO: Função que abre o Drawer de usuário para o departamento X
  const openUserDrawer = (deptId: number) => {
    setSelectedDeptId(deptId);
    setUserDrawerVisible(true);
  };

  // NOVO: Ao submeter o formulário de usuário
  const handleUserFinish = async (values: UserFormValues) => {
    if (selectedDeptId === null) {
      message.error('Erro interno: departamento não selecionado.');
      return;
    }

    setLoadingUserSubmit(true);
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date?.toISOString(),
        death_date: values.death_date?.toISOString(),
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
        // Garante que o campo department_ids contenha apenas o departamento que escolhemos
        department_ids: [selectedDeptId],
      };

      await api.post('/user', payload);
      message.success('Usuário criado com sucesso!');
      setUserDrawerVisible(false);
      setSelectedDeptId(null);
      // Redireciona para a lista de usuários (se for o fluxo desejado)
      navigate('/user');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      message.error('Erro ao criar usuário.');
    } finally {
      setLoadingUserSubmit(false);
    }
  };

  // NOVO: Fecha o Drawer de usuário e reseta o estado
  const handleUserDrawerClose = () => {
    setUserDrawerVisible(false);
    setSelectedDeptId(null);
  };
  // -----------------------------

  const columns: ColumnsType<Department> = [
    { title: 'Nome', dataIndex: 'name', key: 'name', width: '60%' },
    {
      title: 'Ações',
      key: 'action',
      width: '40%',

      render: (_, record) => (
        <Space size="small">

          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={() => openUserDrawer(record.id)
            }
          />

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={

              () => navigate(`/department/edit/${record.id}`)
            }
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={async () => {

              await onDelete(record.id);
            }}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}

            />
          </Popconfirm>
        </Space>
      ),
    }]

  // useEffect(() => {
  //   api
  //     .get<Subscriber[]>('/subscriber')
  //     .then(({ data }) => setSubscribers(data))
  //     .catch(err => {
  //       console.error('Erro ao carregar assinantes', err);
  //       message.error('Não foi possível carregar a lista de assinantes.');
  //     });
  // }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="departmentForm"
          onFinish={onSearch}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Assinante"
                name="subscriber_id"
                rules={[{ required: true, message: 'Selecione um assinante' }]}
              >
                <Select<number>
                  showSearch
                  placeholder="Selecione um assinante"
                  optionFilterProp="children"
                // sem filterOption manual, usando o interno
                >
                  {subscribers.map(sub => (
                    <Select.Option key={sub.id} value={sub.id}>
                      {sub.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="name">
                <Input placeholder="Digite o nome do departamento" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
            <Button
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate('/department/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Departamentos">
        <Table<Department>
          rowKey="id"
          dataSource={departments}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

        <Drawer
        title={selectedDeptId !== null ? `Criar usuário (dept. #${selectedDeptId})` : "Criar Usuário"}
        width={600}
        visible={userDrawerVisible}
        onClose={handleUserDrawerClose}
        destroyOnClose
      >
        <UserFormManager
          initialValues={{
            cpf: '',
            full_name: '',
            cnh: null,
            email: null,
            phone_number: null,
            nationality: null,
            birth_date: undefined,
            death_date: undefined,
            mother_name: null,
            father_name: null,
            password_hash: '',
            is_password_temp: false,
            number_try: 0,
            is_blocked: false,
            role: 'ADMIN_LOCAL',
            type: 'CONTRATADO',
            accepted_terms: false,
            accepted_terms_at: undefined,
            accepted_terms_version: null,
            supplier_id: null,
            // → já pré-preenchemos com o departamento que o usuário clicou
            department_ids: selectedDeptId !== null ? [selectedDeptId] : [],
          }}
          onFinish={handleUserFinish}
          onCancel={handleUserDrawerClose}

          // Caso o UserForm tenha um Select de departamentos, passe as opções:
          departmentOptions={departments.map(dep => ({
            label: dep.name,
            value: dep.id,
          }))}
        />
      </Drawer>
    </div>
  );
}
