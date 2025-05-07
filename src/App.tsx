import AppRoutes from './Routes/index'
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import ptBR from "antd/lib/locale/pt_BR";
function App() {


  return (
    <ConfigProvider locale={ptBR}>
    <AppRoutes />
    </ConfigProvider>
  )
}

export default App
