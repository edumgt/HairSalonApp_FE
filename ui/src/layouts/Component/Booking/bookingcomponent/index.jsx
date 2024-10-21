import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
import { serviceDetails } from '../../../../data/serviceDetails';
import { spaComboDetail } from '../../../../data/spaComboDetail';
import { hairStylingDetail } from '../../../../data/hairStylingDetail';
import { FaSearch, FaTimes, FaChevronLeft, FaUser, FaChevronRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { message, Radio, Typography, Select, Modal } from 'antd';
import SelectedServicesModal from '../selectservicemodal';
import stylist1 from "../../../../assets/imageHome/Stylist/Stylist_1.jpg";
import stylist2 from "../../../../assets/imageHome/Stylist/Stylist_2.jpg";
import stylist3 from "../../../../assets/imageHome/Stylist/Stylist_3.jpg";
import stylist4 from "../../../../assets/imageHome/Stylist/Stylist_4.jpg";
import stylist5 from "../../../../assets/imageHome/Stylist/Stylist_5.jpg";
import stylist6 from "../../../../assets/imageHome/Stylist/Stylist_6.jpg";
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchServices } from '../../../../data/hairservice';
import { fetchCombos } from '../../../../data/comboservice';


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
    console.log('Submitting booking with:', {
      selectedSalon,
      selectedServices,
      selectedCombos: selectedCombosDetails,
      selectedStylist,
      selectedDate,
      selectedTime,
      totalPrice,
      recurringBooking
    });

    if (!selectedSalon) {
      message.error("Vui lòng chọn salon.");
      return;
    }
    if (selectedServices.length === 0 && selectedCombosDetails.length === 0) {
      message.error("Vui lòng chọn ít nhất một dịch vụ hoặc combo.");
      return;
    }
    if (!selectedStylist) {
      message.error("Vui lòng chọn stylist.");
      return;
    }
    if (!selectedDate) {
      message.error("Vui lòng chọn ngày.");
      return;
    }
    if (!selectedTime) {
      message.error("Vui lòng chọn giờ.");
      return;
    }

    // Chuẩn bị dữ liệu để gửi
    const bookingData = {
      date: selectedDate.date.toISOString().split('T')[0], // Định dạng ngày thành "YYYY-MM-DD"
      stylistId: selectedStylist,
      slotId: parseInt(selectedTime),
      price: totalPrice,
      serviceId: [
        ...selectedServices.map(s => s.serviceId || s.id),
        ...selectedCombosDetails.flatMap(c => c.services ? c.services.map(s => s.serviceId || s.id) : [c.serviceId || c.id])
      ],
      period: recurringBooking ? parseInt(recurringBooking) : null
    };

    console.log('Booking data being sent:', bookingData);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/v1/booking', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response);

      if (response.status === 200 || (response.data && response.data.code === 200)) {
        message.success("Đặt lịch thành công!");
        
        // Chuyển hướng đến trang success với dữ liệu từ response
        navigate('/booking/success', { 
          state: { bookingInfo: response.data.result }
        });
      } else {
        console.error('Booking failed. Response:', response);
        message.error(response.data.message || "Đặt lịch thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
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
                  {selectedServices.length > 0
                    ? `Đã chọn ${selectedServices.length} dịch vụ`
                    : "Xem tất cả dịch vụ hấp dẫn"}
                </span>
                <span className="arrow">›</span>
              </div>
              {selectedServices.length > 0 && (
                <div className="selected-services-summary">
                  {selectedServices.map((service, index) => (
                    <p key={index}>{service.title}</p>
                  ))}
                  <p className="total-price">Tổng thanh toán: {totalPrice.toLocaleString()} VND</p>
                </div>
              )}
            </div>
            <div className="step">
              <h3>3. Chọn ngày, giờ & stylist</h3>

              <DateTimeSelectionStep 
              selectedStylist={selectedStylist} 
              setSelectedStylist={setSelectedStylist}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              recurringBooking={recurringBooking}
              setRecurringBooking={setRecurringBooking}
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
    const isServiceSelected = selectedServices.some(s => (s.serviceId || s.id) === serviceId);
    if (!isServiceSelected) {
      setSelectedServices(prevServices => [...prevServices, {...service, isCombo: false}]);
    } else {
      setSelectedServices(prevServices => prevServices.filter(s => (s.serviceId || s.id) !== serviceId));
    }
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
  selectedStylist, 
  setSelectedStylist, 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime,
  recurringBooking,
  setRecurringBooking
}) => {
  const [isStyleListOpen, setIsStyleListOpen] = useState(false);
  const [isDateListOpen, setIsDateListOpen] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [currentStylistIndex, setCurrentStylistIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);

  

  useEffect(() => {
    //updat current time every minute
    const updateCurrentTime = () => setCurrentTime(new Date());
    updateCurrentTime(); //  set initial time imediately
    const timer = setInterval(updateCurrentTime, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/v1/slot', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.code === 200) {
          setTimeSlots(response.data.result);
        } else {
          console.error('Failed to fetch time slots:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot.id);
  };

  const isTimeDisabled = (timeStart) => {
    if (!selectedDate) return false;
    
    const [hours, minutes] = timeStart.split(':').map(Number);
    const selectedDateTime = new Date(selectedDate.date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    // If selected date is today, disable times before or equal to current time
    if (selectedDate.date.toDateString() === currentTime.toDateString()) {
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      
      // If the time is earlier than or equal to current time, disable it
      if (hours < currentHours || (hours === currentHours && minutes <= currentMinutes)) {
        return true;
      }
      
      // Disable slots within the next 30 minutes from now
      const thirtyMinutesLater = new Date(currentTime.getTime() + 30 * 60000);
      return selectedDateTime <= thirtyMinutesLater;
    }
    return false;
  };



  const stylists = [
    { id: 1, name: '30Shine Chọn Giúp Anh', image: stylist1, code: "None" },
    { id: 2, name: 'Luận Triệu', image: stylist2, code: "S0001" },
    { id: 3, name: 'Bắc Lý', image: stylist3, code: "S0002" },
    { id: 4, name: 'Huy Nguyễn', image: stylist4, code: "S0003" },
    { id: 5, name: 'Đạt Nguyễn', image: stylist5, code: "S0004" },
    { id: 6, name: 'Phúc Nguyễn', image: stylist6, code: "S0005" },
  ];

  const handleStylistSelect = (stylist) => {
    console.log('Selected stylist code:', stylist.code);
    setSelectedStylist(stylist.code);
    setIsStyleListOpen(false);
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


  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDateListOpen(false);
  };
  const toggleStyleList = () => {
    setIsStyleListOpen(!isStyleListOpen);
  };

  const toggleDateList = () => {
    setIsDateListOpen(!isDateListOpen);
    setIsStyleListOpen(false);
  };

  const handlePrev = () => {
    setCurrentStylistIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentStylistIndex(prevIndex => Math.min(stylists.length - 4, prevIndex + 1));
  };

  const handlePrevTime = () => {
    setCurrentTimeIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextTime = () => {
    setCurrentTimeIndex(prev => Math.min(timeSlots.length - 3, prev + 1));
  };

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

  return (
    <div className="date-time-selection">
      <div className="stylist-selection">
        <h3 onClick={toggleStyleList} className="stylist-header">
          Chọn Stylist
          <FaChevronRight className={`arrow ${isStyleListOpen ? 'open' : ''}`} />
        </h3>
        {selectedStylist && (
          <div className="selected-stylist-summary">
            <p>Lựa chọn của bạn: {stylists.find(s => s.code === selectedStylist)?.name || 'Chưa chọn'}</p>
            <img
              src={stylists.find(s => s.code === selectedStylist)?.image || stylist1}
              alt={stylists.find(s => s.code === selectedStylist)?.name || 'Chưa chọn'}
              className="stylist-image"
            />
          </div>
        )}
        {isStyleListOpen && (
          <div className="stylist-carousel">
            {currentStylistIndex > 0 && (
              <button className="nav-button prev" onClick={handlePrev}>
                <FaChevronLeft />
              </button>
            )}
            <div className="stylist-list" style={{ transform: `translateX(-${currentStylistIndex * 25}%)` }}>
              {stylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className={`stylist-item ${selectedStylist === stylist.code ? 'selected' : ''}`}
                  onClick={() => handleStylistSelect(stylist)}
                >
                  {stylist.id === 1 ? (
                    <div className="default-stylist">
                      <FaUser className="icon" />
                      <span className="stylist-name">{stylist.name}</span>
                    </div>
                  ) : (
                    <>
                      <img src={stylist.image} alt={stylist.name} />
                      <div className="stylist-info">
                        <p className="stylist-name">{stylist.name}</p>
                      </div>
                    </>
                  )}
                  {selectedStylist === stylist.code && (
                    <div className="check-icon">✓</div>
                  )}
                </div>
              ))}
            </div>
            {currentStylistIndex < stylists.length - 4 && (
              <button className="nav-button next" onClick={handleNext}>
                <FaChevronRight />
              </button>
            )}
          </div>
        )}
      </div>

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
          <FaChevronRight className="arrow" />
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
          <div className="time-carousel">
            <button className="nav-button prev" onClick={handlePrevTime} disabled={currentTimeIndex === 0}>
              <FaChevronLeft />
            </button>
            <div className="time-grid">
              {[0, 1, 2].map((rowIndex) => (
                <div key={rowIndex} className="time-row">
                  {timeSlots.slice(currentTimeIndex + rowIndex * 5, currentTimeIndex + (rowIndex + 1) * 5).map((slot) => (
                    <button
                      key={slot.id}
                      className={`time-button ${selectedTime === slot.id ? 'selected' : ''} ${isTimeDisabled(slot.timeStart) ? 'disabled' : ''}`}
                      onClick={() => !isTimeDisabled(slot.timeStart) && handleTimeSelect(slot)}
                      disabled={isTimeDisabled(slot.timeStart)}
                    >
                      {slot.timeStart}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button className="nav-button next" onClick={handleNextTime} disabled={currentTimeIndex >= timeSlots.length - 15}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

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









