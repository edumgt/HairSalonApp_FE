import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
import { FaSearch, FaTimes, FaChevronLeft, FaUser, FaChevronRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { message, Radio, Typography, Select, Modal, Button, Card, Tabs, List, Spin } from 'antd';
import SelectedServicesModal from '../selectservicemodal';
import { DownOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchServices } from '../../../../data/hairservice';
import { fetchCombos } from '../../../../data/comboservice';
import moment from 'moment';
import TabPane from 'antd/es/tabs/TabPane';



const { Title, Paragraph } = Typography;
const { Option } = Select;

const BookingComponent = () => {


  const [step, setStep] = useState(0);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [recurringBooking, setRecurringBooking] = useState(null);

  const [selectedCombos, setSelectedCombos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const [selectedCombosDetails, setSelectedCombosDetails] = useState([]);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

  const [unavailableSlots, setUnavailableSlots] = useState([]);

  // Thêm state mới cho salon
  const [modalVisible, setModalVisible] = useState(false);
  const [salons, setSalons] = useState([]);
  const [salonLoading, setSalonLoading] = useState(false);
  const [salonError, setSalonError] = useState(null);
  const [districts, setDistricts] = useState([]);

  // Thêm useEffect để fetch danh sách salon
  useEffect(() => {
    if (modalVisible) {
      fetchSalons();
    }
  }, [modalVisible]);

  // Thêm hàm fetchSalons
  const fetchSalons = async () => {
    setSalonLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/salon', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code === 0) {
        const salonsWithId = response.data.result.map(salon => ({
          ...salon,
          id: salon.salonId || salon.id,
          salonId: salon.salonId || salon.id
        }));
        setSalons(salonsWithId);
        const uniqueDistricts = [...new Set(salonsWithId.map(salon => salon.district))];
        setDistricts(uniqueDistricts);
      } else {
        message.error('Không thể lấy thông tin salon');
      }
    } catch (error) {
      console.error('Error fetching salons:', error);
      message.error('Không thể tải danh sách salon');
    } finally {
      setSalonLoading(false);
    }
  };

  // Thêm hàm handleSalonSelect
  const handleSalonSelect = (salon) => {
    if (!salon.salonId && !salon.id) {
      message.error('Thông tin salon không hợp lệ');
      return;
    }
    
    const formattedSalon = {
      ...salon,
      salonId: salon.salonId || salon.id,
      id: salon.salonId || salon.id
    };
    
    // Reset tất cả các thông tin đã chọn
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedStylist(null);
    
    // Cập nhật salon mới
    setSelectedSalon(formattedSalon);
    setModalVisible(false);
  };

  // Remove service
  const handleRemoveService = (serviceToRemove, newTotal, isAdding = false) => {
    if (isAdding) {
      // Nếu là thêm mới từ combo
      const newService = {
        ...serviceToRemove,
        quantity: 1,
        isFromCombo: true
      };
      setSelectedServices(prevServices => [...prevServices, newService]);
      // Cập nhật tổng giá bằng cách thêm giá của dịch vụ mới
      setTotalPrice(prevTotal => prevTotal + (serviceToRemove.price * (serviceToRemove.quantity || 1)));
    } else {
      // Nếu là xóa dịch vụ
      setSelectedServices(prevServices => 
        prevServices.filter(service => 
          (service.id || service.serviceId) !== (serviceToRemove.id || serviceToRemove.serviceId)
        )
      );
      setTotalPrice(prevTotal => prevTotal - (serviceToRemove.price * (serviceToRemove.quantity || 1)));
    }

    // Gọi calculateTotalPrice để đảm bảo tổng giá được cập nhật chính xác
    calculateTotalPrice();
  };

  const handleRemoveCombo = (index) => {
    const newCombos = [...selectedCombos];
    const removedCombo = newCombos.splice(index, 1)[0];
    setSelectedCombos(newCombos);
    setTotalPrice(prevTotal => prevTotal - parseInt(removedCombo.price.replace(/\D/g, '')));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    if (stepParam !== null) {
      setStep(parseInt(stepParam, 10));
    } else {
      setStep(0);
    }
  }, [location]);

  const handleViewAllServices = () => {
    if (selectedSalon) {
      setIsServiceModalVisible(true);
    } else {
      message.warning("Anh vui lòng chọn salon trước để xem lịch còn trống ạ!");
    }
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalVisible(false);
  };

  const handleBack = () => {
    navigate('/booking?step=0');
  };

  const handleServiceSelection = (services, combos, price) => {
    setSelectedServices(services);
    setSelectedCombosDetails(combos);
    setTotalPrice(price);
    navigate('/booking?step=0');
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || (!selectedStylist && selectedStylist !== 'None')) {
      message.error("Vui lòng chọn đầy đủ thông tin đặt lịch.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Xử lý danh sách dịch vụ
      const comboServices = selectedCombosDetails.flatMap(combo => combo.services);
      const allServices = [...selectedServices, ...comboServices];
      const serviceIds = allServices.map(service => service.serviceId || service.id);

      const bookingData = {
        date: moment(selectedDate.date).format('YYYY-MM-DD'),
        stylistId: selectedStylist === 'None' ? 'None' : selectedStylist,
        slotId: parseInt(selectedTime),
        price: parseInt(totalPrice),
        serviceId: serviceIds,
        salonId: selectedSalon.salonId,
        period: recurringBooking ? parseInt(recurringBooking) : 0
      };

      console.log('Sending booking data:', bookingData);

      const response = await axios.post('http://localhost:8080/api/v1/booking', 
        bookingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Received response:', response.data);

      if (response.data.code === 201) {
        message.success(response.data.message);
        navigate('/booking/success', { 
          state: { 
            bookingInfo: response.data.result,
            selectedServices: selectedServices,
            selectedCombos: selectedCombosDetails
          }
        });
      } else {
        message.warning(response.data.message || "Có vấn đề khi đặt lịch. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        message.error(error.response.data.message || "Đặt lịch thất bại. Vui lòng thử lại.");
      } else {
        message.error("Có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.");
      }
    }
  };

  const handleServiceConfirm = (allServices, selectedCombos, totalPrice) => {
    // Lấy các dịch vụ không phải từ combo
    const standaloneServices = allServices.filter(service => !service.isCombo);
    
    // Cập nhật state
    setSelectedServices(allServices);
    setSelectedCombosDetails(selectedCombos);
    setTotalPrice(totalPrice);
    
    // Log để debug
    console.log('Confirmed Services:', allServices);
    console.log('Confirmed Combos:', selectedCombos);
    console.log('Total Price:', totalPrice);
    
    // Đóng modal
    hideModal();
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="booking-steps">
            <div className="step">
              <h3>1. Địa chỉ salon</h3>
              <div className="salon-address" onClick={() => setModalVisible(true)}>
                <Card className="address-card">
                  <div className="address-content">
                    <div className="selected-address">
                      <EnvironmentOutlined />
                      {selectedSalon ? (
                        <span>{selectedSalon.address}, Quận {selectedSalon.district}</span>
                      ) : (
                        <span className="select-prompt">Chọn chi nhánh</span>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              <Modal
                title="Chọn Salon"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                width={800}
                footer={null}
                className="salon-modal"
              >
                {salonLoading ? (
                  <div className="loading-container">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Tabs defaultActiveKey="all" className="salon-tabs">
                    <TabPane tab="Tất cả" key="all">
                      <List
                        dataSource={salons}
                        renderItem={salon => (
                          <List.Item 
                            className={`salon-item ${selectedSalon?.id === salon.id ? 'selected' : ''}`}
                            onClick={() => handleSalonSelect(salon)}
                          >
                            <div className="salon-info">
                              <h4>30Shine {salon.district}</h4>
                              <p>
                                <EnvironmentOutlined /> {salon.address}, Quận {salon.district}
                              </p>
                              {salon.open && (
                                <span className="status-open">
                                  <CheckCircleOutlined /> Đang mở cửa
                                </span>
                              )}
                            </div>
                            <Button 
                              type={selectedSalon?.id === salon.id ? "primary" : "default"}
                            >
                              {selectedSalon?.id === salon.id ? "Đã chọn" : "Chọn"}
                            </Button>
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    {districts.map(district => (
                      <TabPane tab={`Quận ${district}`} key={district}>
                        <List
                          dataSource={salons.filter(salon => salon.district === district)}
                          renderItem={salon => (
                            <List.Item 
                              className={`salon-item ${selectedSalon?.id === salon.id ? 'selected' : ''}`}
                              onClick={() => handleSalonSelect(salon)}
                            >
                              <div className="salon-info">
                                <h4>30Shine {salon.district}</h4>
                                <p>
                                  <EnvironmentOutlined /> {salon.address}, Quận {salon.district}
                                </p>
                                {salon.open && (
                                  <span className="status-open">
                                    <CheckCircleOutlined /> Đang mở cửa
                                  </span>
                                )}
                              </div>
                              <Button 
                                type={selectedSalon?.id === salon.id ? "primary" : "default"}
                              >
                                {selectedSalon?.id === salon.id ? "Đã chọn" : "Chọn"}
                              </Button>
                            </List.Item>
                          )}
                        />
                      </TabPane>
                    ))}
                  </Tabs>
                )}
              </Modal>
            </div>
            <div className="step">
              <h3>2. Chọn dịch vụ</h3>
              <div className="option" onClick={handleViewAllServices}>
                <span className="icon">✂️</span>
                <span>
                  {selectedServices.length > 0 || selectedCombosDetails.length > 0
                    ? `Đã chọn ${selectedServices.length + selectedCombosDetails.length} dịch vụ/combo`
                    : "Xem tất cả dịch vụ hấp dẫn"}
                </span>
                <span className="arrow">›</span>
              </div>
              {(selectedServices.length > 0 || selectedCombosDetails.length > 0) && (
                <div className="selected-services-summary">
                  {selectedServices.map((service, index) => (
                    <p key={index}>{service.serviceName || service.name}</p>
                  ))}
                  {selectedCombosDetails.map((combo, index) => (
                    <p key={`combo-${index}`}>{combo.name} (Combo)</p>
                  ))}
                  <p className="total-price">Tổng thanh toán: {totalPrice.toLocaleString()} VND</p>
                </div>
              )}
            </div>
            <div className="step">
              <h3>3. Chọn ngày, giờ & stylist</h3>
              <DateTimeSelectionStep 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                selectedStylist={selectedStylist} 
                setSelectedStylist={setSelectedStylist}
                recurringBooking={recurringBooking}
                setRecurringBooking={setRecurringBooking}
                selectedServices={selectedServices}
                selectedCombos={selectedCombosDetails}
                selectedSalon={selectedSalon}
              />
            </div>
          </div>
        );
      case 2:
        return selectedSalon ? (
          <ServiceSelectionStep
            onServiceSelection={handleServiceSelection}
            initialServices={selectedServices}
            initialCombos={selectedCombosDetails}
            initialTotalPrice={totalPrice}
          />
        ) : null;
      case 3:
        return (
          <DateTimeSelectionStep
            selectedStylist={selectedStylist}
            setSelectedStylist={setSelectedStylist}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            recurringBooking={recurringBooking}
            setRecurringBooking={setRecurringBooking}
            selectedServices={selectedServices}
            selectedCombos={selectedCombosDetails}
          />
        );
      default:
        return null;
    }
  };

  const fetchUnavailableSlots = useCallback(async (date) => {
    if (!date) return;
    try {
      const formattedDate = date.format('yyyy-MM-dd');
      const response = await axios.get(`http://localhost:8080/api/v1/slot/${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code === 200) {
        setUnavailableSlots(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching unavailable slots:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchUnavailableSlots(selectedDate.date);
    }
  }, [selectedDate, fetchUnavailableSlots]);

  // Thm hàm xử lý cập nhật số lượng
  const handleUpdateQuantity = (item, newQuantity, isCombo = false) => {
    if (newQuantity < 1 || newQuantity > 3) return;

    if (isCombo) {
      const updatedCombos = selectedCombos.map(combo => 
        (combo.id || combo.serviceId) === (item.id || item.serviceId)
          ? { ...combo, quantity: newQuantity }
          : combo
      );
      setSelectedCombos(updatedCombos);
    } else {
      const updatedServices = selectedServices.map(service => 
        (service.id || service.serviceId) === (item.id || item.serviceId)
          ? { ...service, quantity: newQuantity }
          : service
      );
      setSelectedServices(updatedServices);
    }

    // Cập nhật tổng giá
    calculateTotalPrice();
  };

  // Cập nhật hàm tính tổng giá
  const calculateTotalPrice = () => {
    const servicesTotal = selectedServices.reduce((total, service) => {
      const servicePrice = service.price * (service.quantity || 1);
      console.log(`Service: ${service.name}, Price: ${servicePrice}`); // Debug log
      return total + servicePrice;
    }, 0);
    
    const combosTotal = selectedCombosDetails.reduce((total, combo) => {
      const comboPrice = combo.price * (combo.quantity || 1);
      console.log(`Combo: ${combo.name}, Price: ${comboPrice}`); // Debug log
      return total + comboPrice;
    }, 0);

    const newTotal = servicesTotal + combosTotal;
    console.log(`Total: Services(${servicesTotal}) + Combos(${combosTotal}) = ${newTotal}`); // Debug log
    setTotalPrice(newTotal);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedServices, selectedCombosDetails]);

  return (
    <div className="booking-wrapper">
      {step > 0 && (
        <button className="back-button" onClick={handleBack}>
          <FaChevronLeft />
        </button>
      )}
      <h2>Đặt lịch giữ chỗ</h2>
      <div className="booking-container">
        {renderStepContent()}
        {(step === 0 || step === 3) && (
          <button className="submit-button" onClick={handleSubmit}>
            {step === 0 ? 'CHỐT GIỜ CẮT' : 'HOÀN TẤT ĐẶT LỊCH'}
          </button>
        )}
      </div>  
      <SelectedServicesModal
        visible={isModalVisible}
        onClose={hideModal}
        selectedServices={selectedServices}
        selectedCombos={selectedCombosDetails}
        onRemoveService={handleRemoveService}
        onRemoveCombo={handleRemoveCombo}
        onUpdateQuantity={handleUpdateQuantity}
        totalPrice={totalPrice}
        onConfirm={handleServiceConfirm}
      />
      <Modal
        visible={isServiceModalVisible}
        onCancel={handleCloseServiceModal}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <ServiceSelectionStep
          onServiceSelection={handleServiceSelection}
          initialServices={selectedServices}
          initialCombos={selectedCombosDetails}
          initialTotalPrice={totalPrice}
          onClose={handleCloseServiceModal}
        />
      </Modal>
    </div>
  );
};





const ServiceSelectionStep = ({ onServiceSelection, initialServices, initialCombos, initialTotalPrice, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả dịch vụ');
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(initialServices || []);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice || 0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState(['Tất cả dịch vụ']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCombos, setSelectedCombos] = useState(initialCombos || []);
  const [comboDetails, setComboDetails] = useState({});
  const [combos, setCombos] = useState([]);
  const [selectedCombosDetails, setSelectedCombosDetails] = useState(initialCombos || []);

  // Thêm state cho modal xác nhận
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState(null);

  const getImgurDirectUrl = useCallback((url) => {
    if (!url) {
      console.warn('Image URL is undefined');
      return '/fallback-image.jpg';
    }
    const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
    const match = url.match(imgurRegex);
    if (match && match[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
    console.warn('Invalid Imgur URL:', url);
    return url;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const servicesResponse = await axios.get('http://localhost:8080/api/v1/booking/service', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const combosResponse = await fetchCombos();

        let servicesData = servicesResponse.data.result;
        let combosData = combosResponse.result || combosResponse;

        if (Array.isArray(servicesData) && Array.isArray(combosData)) {
          setAllServices(servicesData);
          setCombos(combosData);

          const categorySet = new Set(servicesData.flatMap(item => 
            item.categories ? [item.categories.categoryName] : []
          ).filter(Boolean));
          setCategories(['Tất cả dịch vụ', ...Array.from(categorySet)]);
        } else {
          console.error('Services or combos data is not an array:', { servicesData, combosData });
          setError("Dữ liệu dịch vụ không hợp lệ.");
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filtered = allServices.filter(service => {
      const serviceName = service.serviceName || service.name || '';
      const description = service.description || '';
      const categoryName = service.categories?.categoryName || '';

      const matchesSearch =
        serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'Tất cả dịch vụ' || 
        categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, allServices]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };

  const handleAddService = (service) => {
    const serviceId = service.serviceId || service.id;
    setSelectedServices(prevServices => {
      const existingService = prevServices.find(s => 
        (s.serviceId || s.id) === serviceId
      );

      if (existingService) {
        if (existingService.quantity >= 3) {
          message.warning('Bạn chỉ có thể chọn tối đa 3 lần cho mỗi dịch vụ');
          return prevServices;
        }
        return prevServices.map(s => 
          (s.serviceId || s.id) === serviceId
            ? { ...s, quantity: (s.quantity || 1) + 1 }
            : s
        );
      } else {
        return [...prevServices, { ...service, quantity: 1 }];
      }
    });
    calculateTotalPrice();
  };
  
  const handleAddCombo = async (combo) => {
    if (!comboDetails[combo.id]) {
      await fetchComboDetails(combo.id);
    }
    const comboWithDetails = comboDetails[combo.id] || combo;
    
    setSelectedCombos(prevCombos => {
      const existingCombo = prevCombos.find(c => c.id === combo.id);
      if (existingCombo) {
        if (existingCombo.quantity >= 3) {
          message.warning('Bạn chỉ có thể chọn tối đa 3 lần cho mỗi combo');
          return prevCombos;
        }
        return prevCombos.map(c => 
          c.id === combo.id 
            ? { ...c, quantity: (c.quantity || 1) + 1 }
            : c
        );
      } else {
        return [...prevCombos, { ...comboWithDetails, quantity: 1 }];
      }
    });

    setSelectedCombosDetails(prevDetails => {
      const existingCombo = prevDetails.find(c => c.id === combo.id);
      if (existingCombo) {
        if (existingCombo.quantity >= 3) {
          return prevDetails;
        }
        return prevDetails.map(c => 
          c.id === combo.id 
            ? { ...c, quantity: (c.quantity || 1) + 1 }
            : c
        );
      } else {
        return [...prevDetails, { ...comboWithDetails, quantity: 1 }];
      }
    });

    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    const servicesTotal = selectedServices.reduce((total, service) => 
      total + (service.price * (service.quantity || 1)), 0);
    
    const combosTotal = selectedCombosDetails.reduce((total, combo) => 
      total + (combo.price * (combo.quantity || 1)), 0);

    setTotalPrice(servicesTotal + combosTotal);
  };

  // Cập nhật useEffect để tính lại tổng tiền khi services hoặc combos thay đổi
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedServices, selectedCombosDetails]);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const handleRemoveService = (serviceToRemove) => {
    setSelectedServices(prevServices => 
      prevServices.filter(service => (service.serviceId || service.id) !== (serviceToRemove.serviceId || serviceToRemove.id))
    );
    setTotalPrice(prevTotal => prevTotal - (Number(serviceToRemove.price) || 0));
  };
  
  const handleRemoveCombo = (comboToRemove) => {
    setSelectedCombos(prevCombos => 
      prevCombos.filter(combo => (combo.id || combo.serviceId) !== (comboToRemove.id || comboToRemove.serviceId))
    );
    setSelectedCombosDetails(prevDetails =>
      prevDetails.filter(combo => (combo.id || combo.serviceId) !== (comboToRemove.id || comboToRemove.serviceId))
    );
    setTotalPrice(prevTotal => prevTotal - (Number(comboToRemove.price) || 0));
  };



  const handleBreakCombo = (comboId, serviceToRemove) => {
    setSelectedCombos(prevCombos => {
      const comboIndex = prevCombos.findIndex(combo => combo.id === comboId);
      if (comboIndex === -1) return prevCombos; // Không tìm thấy combo, giữ nguyên state
  
      const combo = prevCombos[comboIndex];
      const updatedComboServices = combo.services.filter(service => service.serviceId !== serviceToRemove.serviceId);
      
      // Remove the combo
      const newSelectedCombos = prevCombos.filter(c => c.id !== comboId);
  
      // Add remaining services as individual services, avoiding duplicates
      setSelectedServices(prevServices => {
        const newServices = updatedComboServices.filter(comboService => 
          !prevServices.some(existingService => 
            existingService.serviceId === comboService.serviceId
          )
        );
        return [...prevServices, ...newServices];
      });
  
      return newSelectedCombos;
    });
  
    // Update total price
    calculateTotalPrice();
  };
  
  
  
  const handleRemoveServiceFromCombo = (comboId, serviceToRemove) => {
    setSelectedCombos(prevCombos => {
      const updatedCombos = prevCombos.map(combo => {
        if (combo.id === comboId) {
          const remainingServices = combo.services.filter(
            service => service.id !== serviceToRemove.id
          );
          
          if (remainingServices.length === 0) {
            return null; // Remove the combo if no services left
          }
          
          return {
            ...combo,
            services: remainingServices,
            price: remainingServices.reduce((total, service) => total + service.price, 0)
          };
        }
        return combo;
      }).filter(Boolean); // Remove null combos
  
      // If the combo was removed or modified, add remaining services to selectedServices
      const removedCombo = prevCombos.find(combo => combo.id === comboId);
      if (!updatedCombos.find(combo => combo.id === comboId)) {
        const servicesToAdd = removedCombo.services.filter(
          service => service.id !== serviceToRemove.id
        );
        setSelectedServices(prev => [...prev, ...servicesToAdd]);
      }
  
      return updatedCombos;
    });
  
    // Update total price
    calculateTotalPrice();
  };
  


  const handleDoneSelection = () => {
    onServiceSelection(selectedServices, selectedCombosDetails, totalPrice);
    onClose();
  };

  const fetchComboDetails = async (comboId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/v1/combo/${comboId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.code === 200) {
        setComboDetails(prevDetails => ({
          ...prevDetails,
          [comboId]: response.data.result
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin combo:', error);
    }
  };

  // Cập nhật hàm isServiceInCombo
  const isServiceInCombo = useCallback((serviceId) => {
    return selectedCombos.some(combo => 
      combo.services && combo.services.some(service => 
        (service.serviceId || service.id) === serviceId
      )
    );
  }, [selectedCombos]);

  // Thêm hàm xử lý khi click vào nút thêm dịch vụ
  const handleAddServiceClick = (service) => {
    if (isServiceInCombo(service.serviceId || service.id)) {
      // Nếu dịch vụ đã có trong combo, hiện modal xác nhận
      setServiceToAdd(service);
      setConfirmModalVisible(true);
    } else {
      // Nếu không, xử lý thêm dịch vụ bình thường
      handleAddService(service);
    }
  };

  // Thêm hàm xử lý xác nhận thêm dịch vụ
  const handleConfirmAddService = () => {
    if (serviceToAdd) {
      handleAddService(serviceToAdd);
      setConfirmModalVisible(false);
      setServiceToAdd(null);
    }
  };

  // Cập nhật lại hàm renderService
  const renderService = (service) => {
    const existingService = selectedServices.find(s => 
      (s.serviceId || s.id) === (service.serviceId || service.id)
    );
    const quantity = existingService?.quantity || 0;
    const isInCombo = isServiceInCombo(service.serviceId || service.id);
    const isMaxQuantity = quantity >= 3;

    const handleClick = () => {
      if (isMaxQuantity) {
        message.warning('Bạn chỉ có thể chọn tối đa 3 lần cho mỗi dịch vụ');
        return;
      }
      handleAddServiceClick(service);
    };

    return (
      <div key={service.serviceId} className="service-item">
        <img src={getImgurDirectUrl(service.image)} alt={service.serviceName || service.name} />
        <div className="service-content">
          <h3>{service.serviceName || service.name}</h3>
          <p>{service.description || ''}</p>
          <p className="price">{formatPrice(service.price || 0)}</p>
          {isMaxQuantity ? (
            <button className="add-service disabled" disabled>
              Đã đạt giới hạn
            </button>
          ) : (
            <button
              className={`add-service ${quantity > 0 ? 'selected' : ''} ${isInCombo ? 'in-combo' : ''}`}
              onClick={handleClick}
            >
              {quantity > 0 ? `Đã thêm (${quantity})` : isInCombo ? 'Trong combo' : 'Thêm dịch vụ'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Thêm hàm render cho combo
  const renderCombo = (combo) => {
    const existingCombo = selectedCombos.find(c => c.id === combo.id);
    const quantity = existingCombo?.quantity || 0;
    const isMaxQuantity = quantity >= 3;
    const comboWithDetails = comboDetails[combo.id] || combo;

    const handleClick = () => {
      if (isMaxQuantity) {
        message.warning('Bạn chỉ có thể chọn tối đa 3 lần cho mỗi combo');
        return;
      }
      handleAddCombo(comboWithDetails);
    };

    return (
      <div key={combo.id} className="combo-item">
        <div className="combo-services__images">
          {comboWithDetails.services && comboWithDetails.services.slice(0, 2).map((service, index) => (
            <div key={service.serviceId} className="combo-services__image-container">
              <img
                src={getImgurDirectUrl(service.image)}
                alt={service.serviceName}
                className="combo-services__image"
              />
            </div>
          ))}
        </div>
        <div className="combo-content">
          <h3>{comboWithDetails.name}</h3>
          <p>{comboWithDetails.description}</p>
          <p className="price">{formatPrice(comboWithDetails.price || 0)}</p>
          {isMaxQuantity ? (
            <button className="add-service disabled" disabled>
              Đã đạt giới hạn
            </button>
          ) : (
            <button
              className={`add-service ${quantity > 0 ? 'selected' : ''}`}
              onClick={handleClick}
            >
              {quantity > 0 ? `Đã thêm (${quantity})` : 'Thêm combo'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Thêm hàm handleUpdateQuantity
  const handleUpdateQuantity = (item, newQuantity, isCombo = false) => {
    if (newQuantity < 1 || newQuantity > 3) return;

    if (isCombo) {
      setSelectedCombosDetails(prevCombos => 
        prevCombos.map(combo => 
          (combo.id || combo.serviceId) === (item.id || item.serviceId)
            ? { ...combo, quantity: newQuantity }
            : combo
        )
      );
      
      setSelectedCombos(prevCombos => 
        prevCombos.map(combo => 
          (combo.id || combo.serviceId) === (item.id || item.serviceId)
            ? { ...combo, quantity: newQuantity }
            : combo
        )
      );
    } else {
      setSelectedServices(prevServices => 
        prevServices.map(service => 
          (service.id || service.serviceId) === (item.id || item.serviceId)
            ? { ...service, quantity: newQuantity }
            : service
        )
      );
    }
  };

  // Cập nhật hàm handleConfirmServices
  const handleServiceConfirm = (allServices, selectedCombos, totalPrice) => {
    // Chỉ lấy các dịch vụ không phải từ combo
    const standaloneServices = allServices.filter(service => !service.isCombo);
    setSelectedServices(standaloneServices);
    setSelectedCombosDetails(selectedCombos);
    setSelectedCombos(selectedCombos); // Thêm dòng này
    setTotalPrice(totalPrice);
    calculateTotalPrice();
    hideModal();
  };

  if (loading) return <div>Đang ti...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="service-selection">
      <Title level={2}>Chọn dịch vụ</Title>
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ, nhóm dịch vụ hoặc giá"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-button" onClick={() => setSearchTerm('')}>
            <FaTimes />
          </button>
        )}
      </div>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
      <h3>Combo dịch vụ</h3>
      <div className="combo-grid">
        {combos.map(combo => renderCombo(combo))}
      </div>

      <h3>Dịch vụ riêng lẻ</h3>
      <div className="service-grid">
        {filteredServices.map(service => renderService(service))}
      </div>

      <div className="service-summary">
        <div className="summary-content">
          <span className="selected-services" onClick={showModal}>
            {`Đã chọn ${selectedServices.length + selectedCombosDetails.length} dịch vụ/combo`}
          </span>
          <span className="total-amount">
            Tổng thanh toán: {formatPrice(totalPrice)}
          </span>
        </div>
        <button
          className="done-button"
          disabled={selectedServices.length === 0 && selectedCombosDetails.length === 0}
          onClick={handleDoneSelection}
        >
          Xong
        </button>
      </div>
      <SelectedServicesModal
        visible={isModalVisible}
        onClose={hideModal}
        selectedServices={selectedServices}
        selectedCombos={selectedCombosDetails}
        onRemoveService={handleRemoveService}
        onRemoveCombo={handleRemoveCombo}
        onUpdateQuantity={handleUpdateQuantity}
        totalPrice={totalPrice}
        onConfirm={handleServiceConfirm}
      />
      <Modal
        title="Xác nhận thêm dịch vụ"
        visible={confirmModalVisible}
        onCancel={() => {
          setConfirmModalVisible(false);
          setServiceToAdd(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setConfirmModalVisible(false);
              setServiceToAdd(null);
            }}
          >
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleConfirmAddService}
          >
            Xác nhận
          </Button>
        ]}
      >
        <p>
          Dịch vụ "{serviceToAdd?.name || serviceToAdd?.serviceName}" đã có trong combo bạn đã chọn.
        </p>
        <p>
          Bạn có muốn thêm dịch vụ này với giá{' '}
          <strong>{formatPrice(serviceToAdd?.price || 0)}</strong> vào danh sách dịch vụ đã chọn không?
        </p>
      </Modal>
    </div>
  );
};

const DateTimeSelectionStep = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime,
  selectedStylist, 
  setSelectedStylist, 
  recurringBooking,
  setRecurringBooking,
  selectedServices,
  selectedCombos,
  selectedSalon
}) => {
  const [isDateListOpen, setIsDateListOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableStylists, setAvailableStylists] = useState([]);
  const [isStylistLoading, setIsStylistLoading] = useState(false);
  const [stylistError, setStylistError] = useState(null);
  const [formError, setFormError] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/slot', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.code === 200) {
        setTimeSlots(response.data.result);
      } else {
        setError('Không thể lấy khung giờ: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setError('Lỗi khi lấy khung giờ: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
      fetchUnavailableSlots();
    }
  }, [selectedDate]);

  const fetchUnavailableSlots = async () => {
    try {
      const formattedDate = moment(selectedDate.date).format('YYYY-MM-DD');
      const response = await axios.get(`http://localhost:8080/api/v1/slot/${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code === 200) {
        setUnavailableSlots(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching unavailable slots:', error);
    }
  };

  const isSlotUnavailable = (slotId) => {
    return unavailableSlots.some(slot => slot.id === slotId);
  };

  const isTimeDisabled = (slot) => {
    if (!selectedDate) return false;
    
    const [hours, minutes] = slot.timeStart.split(':').map(Number);
    const selectedDateTime = new Date(selectedDate.date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    return selectedDateTime <= now || isSlotUnavailable(slot.id);
  };

  const handleDateSelect = (date) => {
    if (!checkServiceSelected()) {
      setFormError('Vui lòng chọn dịch vụ hoặc combo trước khi chọn ngày.');
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedStylist(null);
    setIsDateListOpen(false);
    setFormError('');
  };

  const handleTimeSelect = (slot) => {
    if (!selectedDate) {
      setFormError('Vui lòng chọn ngày trước khi chọn giờ.');
      return;
    }
    setSelectedTime(slot.id);
    setSelectedStylist(null);
    setFormError('');
    fetchAvailableStylists(selectedDate.date, slot.id);
  };

  const handleStylistSelect = (stylist) => {
    if (!selectedTime) {
      setFormError('Vui lòng chọn giờ trước khi chọn stylist.');
      return;
    }
    setSelectedStylist(stylist.code === 'None' ? 'None' : stylist.code);
    setFormError('');
  };

  const checkServiceSelected = () => {
    return (selectedServices && selectedServices.length > 0) || (selectedCombos && selectedCombos.length > 0);
  };

  const toggleDateList = () => {
    if (!checkServiceSelected()) {
      setFormError('Vui lòng chọn dịch vụ hoặc combo trước khi chọn ngày.');
      return;
    }
    setIsDateListOpen(prevState => !prevState);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${date.getDate()}/${date.getMonth() + 1} (${days[date.getDay()]})`;
  };

  const dates = [
    { date: today, label: `Hôm nay, ${formatDate(today)}` },
    { date: tomorrow, label: `Ngày mai, ${formatDate(tomorrow)}` }
  ];

  const handleRecurringChange = (value) => {
    setRecurringBooking(value);
  };

  const recurringOptions = [
    { value: null, label: 'Không đặt lịch định kỳ hàng tuần' },
    { value: 1, label: 'Mỗi tuần' },
    { value: 2, label: 'Mỗi 2 tuần' },
    { value: 3, label: 'Mỗi 3 tuần' },
    { value: 4, label: 'Mỗi 4 tuần' },
  ];

  const groupTimeSlots = (slots) => {
    const morning = slots.filter(slot => {
      const hour = parseInt(slot.timeStart.split(':')[0]);
      return hour >= 6 && hour < 12;
    });
    const afternoon = slots.filter(slot => {
      const hour = parseInt(slot.timeStart.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    const evening = slots.filter(slot => {
      const hour = parseInt(slot.timeStart.split(':')[0]);
      return hour >= 18 || hour < 6;
    });
    return { morning, afternoon, evening };
  };

  const renderTimeGroup = (groupName, slots) => (
    <div className="time-group" key={groupName}>
      <h5>{groupName}</h5>
      <div className="time-grid">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={`time-button ${selectedTime === slot.id ? 'selected' : ''} ${isTimeDisabled(slot) ? 'disabled' : ''}`}
            onClick={() => !isTimeDisabled(slot) && handleTimeSelect(slot)}
            disabled={isTimeDisabled(slot)}
          >
            {slot.timeStart.slice(0, 5)}
          </button>
        ))}
      </div>
    </div>
  );

  const getImgurDirectUrl = useCallback((url) => {
    if (!url) {
      console.warn('Image URL is undefined');
      return '/fallback-image.jpg';
    }
    const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
    const match = url.match(imgurRegex);
    if (match && match[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
    console.warn('Invalid Imgur URL:', url);
    return url;
  }, []);

  // Hàm kiểm tra các bước đã được chọn
  const checkSteps = () => {
    if (!selectedServices || !selectedCombos) {
      message.warning('Vui lòng chọn dịch vụ hoặc combo trước');
      return false;
    }
    if ((selectedServices.length === 0 && selectedCombos.length === 0) || 
        (!selectedServices.length && !selectedCombos.length)) {
      message.warning('Vui lòng chọn dịch vụ hoặc combo trước');
      return false;
    }
    if (!selectedDate) {
      message.warning('Vui lòng chọn ngày trước');
      return false;
    }
    if (!selectedTime) {
      message.warning('Vui lòng chọn khung giờ trước');
      return false;
    }
    return true;
  };

  const fetchAvailableStylists = async (date, slotId) => {
    if (!date || !slotId || !selectedSalon) return;

    setIsStylistLoading(true);
    setStylistError(null);

    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await axios.get(
        `http://localhost:8080/api/v1/staff/stylist?slotId=${slotId}&date=${formattedDate}&salonId=${selectedSalon.salonId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.code === 200) {
        setAvailableStylists(response.data.result);
      } else {
        setStylistError('Không thể lấy danh sách stylist: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching available stylists:', error);
      setStylistError('Lỗi khi lấy danh sách stylist: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsStylistLoading(false);
    }
  }, []);

  return (
    <div className="date-time-selection">
      <div className="date-selection">
        <div
          className="date-dropdown"
          onClick={toggleDateList}
        >
          <FaCalendarAlt className="icon" />
          <span>{selectedDate ? selectedDate.label : 'Chọn ngày'}</span>
          <FaChevronRight className={`arrow ${isDateListOpen ? 'open' : ''}`} />
        </div>

        {isDateListOpen && (
          <div className="date-list">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`date-item ${selectedDate && selectedDate.label === date.label ? 'selected' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                <span>{date.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="time-selection">
          <h4>
            <FaClock className="icon" />
            Chọn giờ
          </h4>
          {isLoading ? (
            <p>Đang tải khung giờ...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : timeSlots.length > 0 ? (
            <>
              {renderTimeGroup('Buổi sáng', groupTimeSlots(timeSlots).morning)}
              {renderTimeGroup('Buổi chiều', groupTimeSlots(timeSlots).afternoon)}
              {renderTimeGroup('Buổi tối', groupTimeSlots(timeSlots).evening)}
            </>
          ) : (
            <p>Không có khung giờ nào khả dụng.</p>
          )}
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="stylist-selection">
          <h4>
            <FaUser className="icon" />
            Chọn Stylist
          </h4>
          {isStylistLoading ? (
            <p>Đang tải danh sách stylist...</p>
          ) : stylistError ? (
            <p className="error-message">{stylistError}</p>
          ) : availableStylists.length > 0 ? (
            <div className="stylist-list">
              <div
                className={`stylist-item ${selectedStylist === 'None' ? 'selected' : ''}`}
                onClick={() => handleStylistSelect({ code: 'None' })}
              >
                <div className="stylist-info centered-text">
                  <p className="stylist-name">Để chúng tôi chọn giúp bạn</p>
                </div>
                {selectedStylist === 'None' && (
                  <div className="check-icon">✓</div>
                )}
              </div>
              {availableStylists.map((stylist) => (
                <div
                  key={stylist.code}
                  className={`stylist-item ${selectedStylist === stylist.code ? 'selected' : ''}`}
                  onClick={() => handleStylistSelect(stylist)}
                >
                  <img src={getImgurDirectUrl(stylist.image)} alt={`${stylist.firstName} ${stylist.lastName}`} />
                  <div className="stylist-info">
                    <p className="stylist-name">{`${stylist.firstName} ${stylist.lastName}`}</p>
                  </div>
                  {selectedStylist === stylist.code && (
                    <div className="check-icon">✓</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Không có stylist nào khả dụng cho khung giờ này.</p>
          )}
        </div>
      )}

      {formError && <p className="form-error">{formError}</p>}

      <div className="recurring-booking">
        <Title level={4}>Đặt lịch định kỳ (Không bắt buộc)</Title>
        <Paragraph>
          Bạn có muốn đặt lịch định kỳ không? Điều này sẽ giúp bạn tiết kiệm thời gian cho những lần đặt lịch tiếp theo.
        </Paragraph>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn tần suất đặt lịch"
          onChange={handleRecurringChange}
          value={recurringBooking}
          suffixIcon={<DownOutlined />}
        >
          {recurringOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default BookingComponent;