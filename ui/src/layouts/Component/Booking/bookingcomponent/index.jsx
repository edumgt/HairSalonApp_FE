import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
import { FaSearch, FaTimes, FaChevronLeft, FaUser, FaChevronRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { message, Radio, Typography, Select, Modal } from 'antd';
import SelectedServicesModal from '../selectservicemodal';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchServices } from '../../../../data/hairservice';
import { fetchCombos } from '../../../../data/comboservice';
import moment from 'moment';



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

  // Remove service
  const handleRemoveService = (index) => {
    const newServices = [...selectedServices];
    const removedService = newServices.splice(index, 1)[0];
    setSelectedServices(newServices);
    setTotalPrice(prevTotal => prevTotal - parseInt(removedService.price.replace(/\D/g, '')));
  };

  const handleRemoveCombo = (index) => {
    const newCombos = [...selectedCombos];
    const removedCombo = newCombos.splice(index, 1)[0];
    setSelectedCombos(newCombos);
    setTotalPrice(prevTotal => prevTotal - parseInt(removedCombo.price.replace(/\D/g, '')));
  };

  // Set fixed salon address
  const fixedSalon = {
    id: 1,
    address: "Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000",
    description: "Chi nhánh duy nhất của chúng tôi",
    image: "path/to/salon/image.jpg" // Add an appropriate image path
  };

  useEffect(() => {
    setSelectedSalon(fixedSalon);
  }, []);

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
        stylistId: selectedStylist === 'None' ? 'None' : selectedStylist, // Thay đổi ở đây
        slotId: parseInt(selectedTime),
        price: parseInt(totalPrice),
        serviceId: serviceIds,
        period: recurringBooking ? parseInt(recurringBooking) : null
      };

      console.log('Sending booking data:', bookingData);

      const response = await axios.post('http://localhost:8080/api/v1/booking', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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
    // Lấy danh sách dịch vụ từ các combo đã chọn
    const comboServices = selectedCombos.flatMap(combo => combo.services);
    
    // Lấy danh sách dịch vụ đơn lẻ (không nằm trong combo)
    const singleServices = allServices.filter(service => 
      !comboServices.some(comboService => comboService.serviceId === service.serviceId)
    );

    setSelectedServices(singleServices);
    setSelectedCombosDetails(selectedCombos);
    setTotalPrice(totalPrice);

    console.log('Danh sách dịch vụ trong combo:', comboServices);
    console.log('Danh sách dịch vụ đơn lẻ:', singleServices);
    console.log('Tất cả dịch vụ:', allServices);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="booking-steps">
            <div className="step">
              <h3>1. Địa chỉ salon</h3>
              <div className="option">
                <span className="icon">🏠</span>
                <span>{fixedSalon.address}</span>
              </div>
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
        const [servicesResponse, combosResponse] = await Promise.all([
          fetchServices(),
          fetchCombos()
        ]);

        let servicesData = servicesResponse.result || servicesResponse;
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
          setError("Dữ liệu dịch vụ khng hợp lệ.");
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
      const isServiceSelected = prevServices.some(s => (s.serviceId || s.id) === serviceId);
      if (!isServiceSelected) {
        return [...prevServices, {...service, isCombo: false}];
      } else {
        return prevServices.filter(s => (s.serviceId || s.id) !== serviceId);
      }
    });
    updateTotalPrice();
  };
  
  const handleAddCombo = async (combo) => {
    if (!comboDetails[combo.id]) {
      await fetchComboDetails(combo.id);
    }
    const comboWithDetails = comboDetails[combo.id] || combo;
    setSelectedCombos(prevCombos => {
      const isAlreadySelected = prevCombos.some(c => c.id === combo.id);
      if (isAlreadySelected) {
        return prevCombos.filter(c => c.id !== combo.id);
      } else {
        // Loại bỏ các dịch vụ đơn lẻ đã có trong combo
        setSelectedServices(prevServices => 
          prevServices.filter(service => 
            !comboWithDetails.services.some(comboService => 
              (comboService.serviceId || comboService.id) === (service.serviceId || service.id)
            )
          )
        );
        return [...prevCombos, comboWithDetails];
      }
    });
    setSelectedCombosDetails(prevDetails => {
      const isAlreadySelected = prevDetails.some(c => c.id === combo.id);
      if (isAlreadySelected) {
        return prevDetails.filter(c => c.id !== combo.id);
      } else {
        return [...prevDetails, comboWithDetails];
      }
    });
    updateTotalPrice();
  };

  const updateTotalPrice = () => {
    const servicesTotal = selectedServices.reduce((total, service) => total + (Number(service.price) || 0), 0);
    const combosTotal = selectedCombos.reduce((total, combo) => total + (Number(combo.price) || 0), 0);
    setTotalPrice(servicesTotal + combosTotal);
  };

  useEffect(() => {
    updateTotalPrice();
  }, [selectedServices, selectedCombos]);



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
    updateTotalPrice();
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
    updateTotalPrice();
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
      combo.services && combo.services.some(service => service.serviceId === serviceId)
    );
  }, [selectedCombos]);

  // Cập nhật hàm renderService
  const renderService = (service) => {
    const isSelected = selectedServices.some(s => s.serviceId === service.serviceId);
    const isDisabled = isServiceInCombo(service.serviceId);

    return (
      <div key={service.serviceId} className="service-item">
        <img src={getImgurDirectUrl(service.image)} alt={service.serviceName || service.name} />
        <div className="service-content">
          <h3>{service.serviceName || service.name}</h3>
          <p>{service.description || ''}</p>
          <p className="price">{formatPrice(service.price || 0)}</p>
          <button
            className={`add-service ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => !isDisabled && handleAddService(service)}
            disabled={isDisabled}
          >
            {isSelected ? 'Đã thêm' : isDisabled ? 'Trong combo' : 'Thêm dịch vụ'}
          </button>
        </div>
      </div>
    );
  };

  // Thêm hàm render cho combo
  const renderCombo = (combo) => {
    const isSelected = selectedCombos.some(c => c.id === combo.id);
    const comboWithDetails = comboDetails[combo.id] || combo;

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
          <button
            className={`add-service ${isSelected ? 'selected' : ''}`}
            onClick={() => handleAddCombo(comboWithDetails)}
          >
            {isSelected ? 'Đã thêm' : 'Thêm combo'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Đang tải...</div>;
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
            {`Đã chọn ${selectedServices.length + selectedCombos.length} dịch vụ`}
          </span>
          <span className="total-amount">
            Tổng thanh toán: {formatPrice(totalPrice)}
          </span>
        </div>
        <button
          className="done-button"
          disabled={selectedServices.length === 0 && selectedCombos.length === 0}
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
  onRemoveServiceFromCombo={handleBreakCombo}
  totalPrice={totalPrice}
/>
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
  selectedCombos
}) => {
  const [isDateListOpen, setIsDateListOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableStylists, setAvailableStylists] = useState([]);
  const [isStylistLoading, setIsStylistLoading] = useState(false);
  const [stylistError, setStylistError] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/slot', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Time slots response:', response.data); // Log the response

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
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAvailableStylists(selectedTime, selectedDate.date);
    }
  }, [selectedDate, selectedTime]);

  const fetchAvailableStylists = async (slotId, date) => {
    setIsStylistLoading(true);
    setStylistError(null);
    try {
      const token = localStorage.getItem('token');
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await axios.get('http://localhost:8080/api/v1/staff/stylist', {
        params: {
          slotId: slotId,
          date: formattedDate
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 200) {
        setAvailableStylists(response.data.result);
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách stylist có sẵn');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách stylist có sẵn:', error);
      setStylistError('Không thể tải danh sách stylist có sẵn. Vui lòng thử lại.');
    } finally {
      setIsStylistLoading(false);
    }
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
    { date: today, label: `Hôm nay, ${formatDate(today)}`, tag: today.getDay() === 0 || today.getDay() === 6 ? 'Cuối tuần' : 'Ngày thường' },
    { date: tomorrow, label: `Ngày mai, ${formatDate(tomorrow)}`, tag: tomorrow.getDay() === 0 || tomorrow.getDay() === 6 ? 'Cuối tuần' : 'Ngày thường' },
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

  const isTimeDisabled = (timeStart) => {
    if (!selectedDate) return false;
    
    const [hours, minutes] = timeStart.split(':').map(Number);
    const selectedDateTime = new Date(selectedDate.date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    return selectedDateTime <= now;
  };

  const renderTimeGroup = (groupName, slots) => (
    <div className="time-group" key={groupName}>
      <h5>{groupName}</h5>
      <div className="time-grid">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={`time-button ${selectedTime === slot.id ? 'selected' : ''} ${isTimeDisabled(slot.timeStart) ? 'disabled' : ''}`}
            onClick={() => !isTimeDisabled(slot.timeStart) && handleTimeSelect(slot)}
            disabled={isTimeDisabled(slot.timeStart)}
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

  return (
    <div className="date-time-selection">
      <div className="date-selection">
        <div
          className="date-dropdown"
          onClick={toggleDateList}
        >
          <FaCalendarAlt className="icon" />
          <span>{selectedDate ? selectedDate.label : 'Chọn ngày'}</span>
          <span className={`tag ${selectedDate ? (selectedDate.tag === 'Cuối tuần' ? 'weekend' : 'weekday') : ''}`}>
            {selectedDate ? selectedDate.tag : ''}
          </span>
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
                <span className={`tag ${date.tag === 'Cuối tuần' ? 'weekend' : 'weekday'}`}>{date.tag}</span>
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
          ) : (
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
