import { Card, Statistic, Row, Col } from "antd";
import { MessageOutlined, UserOutlined, DatabaseOutlined, FileTextOutlined } from "@ant-design/icons";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Total Chatbots"
              value={10}
              prefix={<DatabaseOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Total Interactions"
              value={450}
              prefix={<MessageOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Active Users"
              value={125}
              prefix={<UserOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Saved Templates"
              value={30}
              prefix={<FileTextOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
