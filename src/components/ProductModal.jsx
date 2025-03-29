import { Modal } from "antd";

const ProductModal = ({ modalVisible, setModalVisible, selectedItem }) => {
  return (
    <Modal
      title="Product Details"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      centered
      width={600}
    >
      {selectedItem && (
        <div className="space-y-4 relative">
          {/* Image Carousel */}
          <div className="flex  justify-center">
          {/* <Carousel autoplay className="w-full maxw max-h-60"> */}
              {selectedItem.images && selectedItem.images.length > 0 ? (
                // selectedItem.images.map((image, index) => (
                  <div className="flex justify-center">
                    <img
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      className="rounded-lg h-60 w-full object-cover shadow-md"
                    />
                  </div>
                // ))
              ) : (
                <div className="flex justify-center">
                  <p>No Image</p>
                </div>
              )}
            {/* </Carousel> */}
          </div>

          {/* Details Section */}
          <h2 className="text-lg font-semibold">{selectedItem.title}</h2>
          <p className="text-gray-600">{selectedItem.description}</p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <p><strong>Brand:</strong> {selectedItem.specifications.brand}</p>
            <p><strong>Model:</strong> {selectedItem.specifications.model}</p>
            <p><strong>Year:</strong> {selectedItem.specifications.year}</p>
            <p><strong>Fuel Type:</strong> {selectedItem.specifications.fuelType}</p>
            <p><strong>Transmission:</strong> {selectedItem.specifications.transmission}</p>
            <p><strong>Mileage:</strong> {selectedItem.specifications.mileage} km</p>
            <p><strong>Color:</strong> {selectedItem.specifications.color}</p>
            <p><strong>Engine:</strong> {selectedItem.specifications.engineCapacity}</p>
          </div>

          {/* Features */}
          <div className="mt-4">
            <h3 className="font-semibold">Features:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {selectedItem.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="mt-4 text-gray-500">
            <p><strong>Location:</strong> {selectedItem.location.city}, {selectedItem.location.state}, {selectedItem.location.country}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
