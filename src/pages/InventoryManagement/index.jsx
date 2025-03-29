import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tag } from "antd";
import { motion } from "framer-motion";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import ProductModal from "../../components/ProductModal";
import AddVehicleModal from "../../components/AddVehicleModal";
import toast from "react-hot-toast";
import { SERVER_URL } from "../../config";
import axios from "axios";
import CustomLoader from "../../commons/CustomLoader";


const InventoryScreen = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [total,setTotal]=useState(0)
  const [page,setPage]=useState(1)
  const [loading, setLoading] = useState(false); 

  const handleDelete =async (id) => {
    try {
      setLoading(true)
      const response = await axios.delete(
        `${SERVER_URL}/api/inventory/delete/${id}`, 
      );
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "failed!");
    }finally{
      setLoading(false)
    }
  };

  // Open Modal for Details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (imgSrc) => <img src={imgSrc[0]} className="h-16 w-16" alt="Car Image" />,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Price ($)", dataIndex: "price", key: "price" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "available" ? "green" : status === "sold" ? "red" : "blue"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            View
          </Button>
          <Button className={"bg-red-700! text-white!"} icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
const fetchData=async()=>{
  try {
      setLoading(true)
      const response = await axios.get(
        `${SERVER_URL}/api/inventory/getAll?page=${page}`, 
      );
      setInventory(response.data.data)
      setTotal(response.data.total)
      console.log(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "failed!");
    }finally{
      setLoading(false)
    }
}
useEffect(()=>{
  fetchData()
},[page])
const onAddVehicle=async(values)=>{
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/inventory/create`, 
        values
      );
      toast.success("Vehicle Added successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "failed!");
    } 
}
  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl! font-bold mb-4">Inventory</h2>
      <div className="flex w-full justify-end">

      <Button type="primary" onClick={() => setAddModalVisible(true)} className="mb-4 px-8! py-6!  text-lg!">
        Add Vehicle
      </Button>
      </div>
      <Table dataSource={inventory} columns={columns} pagination={{
    current: page, 
    pageSize: 10, 
    total: total, 
    onChange: (page) => setPage(page),
    showTotal: (total, range) =>
      `Showing ${range[0]}-${range[1]} of ${total} campaigns`, 
  }} />

      {/* Details Modal */}
      <ProductModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedItem={selectedItem} />
      <AddVehicleModal modalVisible={addModalVisible} setModalVisible={setAddModalVisible} onAddVehicle={onAddVehicle} />
      {loading&&<CustomLoader/>}
    </motion.div>
          
  );
};

export default InventoryScreen;
