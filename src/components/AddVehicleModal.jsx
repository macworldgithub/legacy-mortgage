import { Modal, Carousel, Input, Form, Button, Upload, Select, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import CustomLoader from "../commons/CustomLoader";

const { Option } = Select;

const AddVehicleModal = ({ modalVisible, setModalVisible, onAddVehicle }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state

  const [imageList, setImageList] = useState([]);

  const handleImageUpload = ({ fileList }) => {
    setImageList(fileList);
  };

  const handleSubmit = (values) => {
    setLoading(true)
    setLoading(true)
    const vehicleData = {
      ...values,
      images: imageList.map(file => file.url || URL.createObjectURL(file.originFileObj)),
      features: values.features ? values.features.split(",").map(f => f.trim()) : [],
    };
    onAddVehicle(vehicleData);
    form.resetFields();
    setImageList([]);
    setLoading(false)
    setModalVisible(false);
  };

  return (
    <Modal
      title="Add Vehicle to Inventory"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      centered
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter the vehicle title" }]}>
          <Input placeholder="Enter vehicle title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter vehicle description" />
        </Form.Item>
        <div className="grid grid-cols-3 gap-4">


        <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
  <Select placeholder="Select category">
    <Option value="Sedan">Sedan</Option>
    <Option value="SUV">SUV</Option>
    <Option value="Truck">Truck</Option>
    <Option value="Hatchback">Hatchback</Option>
    <Option value="Coupe">Coupe</Option>
    <Option value="Convertible">Convertible</Option>
    <Option value="Van">Van</Option>
    <Option value="Wagon">Wagon</Option>
  </Select>
</Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
          <InputNumber placeholder="Enter price" min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Stock" name="stock">
          <InputNumber placeholder="Enter stock quantity" min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select placeholder="Select status">
            <Option value="available">Available</Option>
            <Option value="sold">Sold</Option>
            <Option value="reserved">Reserved</Option>
          </Select>
        </Form.Item>

          <Form.Item label="Brand" name={["specifications", "brand"]} rules={[{ required: true, message: "Please enter the brand" }]}>
            <Input placeholder="Enter brand" />
          </Form.Item>
          <Form.Item label="Model" name={["specifications", "model"]} rules={[{ required: true, message: "Please enter the model" }]}>
            <Input placeholder="Enter model" />
          </Form.Item>
          <Form.Item label="Year" name={["specifications", "year"]} rules={[{ required: true, message: "Please enter the year" }]}>
            <InputNumber placeholder="Enter year" min={1900} max={new Date().getFullYear()} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Fuel Type" name={["specifications", "fuelType"]}>
            <Select placeholder="Select fuel type">
              <Option value="petrol">Petrol</Option>
              <Option value="diesel">Diesel</Option>
              <Option value="electric">Electric</Option>
              <Option value="hybrid">Hybrid</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Transmission" name={["specifications", "transmission"]}>
            <Select placeholder="Select transmission type">
              <Option value="manual">Manual</Option>
              <Option value="automatic">Automatic</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Mileage (km)" name={["specifications", "mileage"]}>
            <InputNumber placeholder="Enter mileage" min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Color" name={["specifications", "color"]}>
            <Input placeholder="Enter color" />
          </Form.Item>
          <Form.Item label="Engine Capacity" name={["specifications", "engineCapacity"]}>
            <Input placeholder="Enter engine capacity" />
          </Form.Item>
        </div>

        <Form.Item label="Features" name="features">
          <Input.TextArea rows={2} placeholder="Enter features (comma separated)" />
        </Form.Item>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="City" name={["location", "city"]}>
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item label="State" name={["location", "state"]}>
            <Input placeholder="Enter state" />
          </Form.Item>
          <Form.Item label="Country" name={["location", "country"]}>
            <Input placeholder="Enter country" />
          </Form.Item>
        </div>

        <Form.Item label="Upload Images" name="images">
          <Upload
            listType="picture-card"
            fileList={imageList}
            onChange={handleImageUpload}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined /> <span>Upload</span>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Vehicle
          </Button>
        </Form.Item>
      </Form>
      {loading&&<CustomLoader/>}
    </Modal>
  );
};

export default AddVehicleModal;
