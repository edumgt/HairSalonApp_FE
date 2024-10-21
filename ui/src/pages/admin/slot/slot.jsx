import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from './slot.module.css'
import NavLink from "../../../layouts/admin/components/link/navLink";
import HeaderButton from "../../../layouts/admin/components/table/buttonv2/headerButton";
import HeaderColumn from "../../../layouts/admin/components/table/headerColumn";
import { deleteById, getAll } from "../services/slotService";
import EditButton from "../../../layouts/admin/components/table/buttonv2/editButton";
import { Modal, notification } from "antd";
import moment from 'moment' // Thêm moment để định dạng thời gian

function Slot() {
    const location = useLocation();
    const isRootPath = location.pathname === '/admin/slot';
    const [slot, setSlot] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Load data
  const loadData = async () => {
    try {
      const response = await getAll();
      setSlot(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (location.state?.shouldReload || location.state === null) {
      loadData();
    }
  }, [location.state]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const filteredCombos = slot.filter((item) =>
    item.id.toString().includes(searchText)
  );
// Delete
const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn xóa khung giờ này ?',
      onOk: async () => {
        try {
          const response = await deleteById(id);
          notification.success({
            message: 'Thành công',
            description: 'Khung giờ đã được xóa',
            duration: 2
          });
          loadData();
          return response
        } catch (error) {
          console.error(error);
          Modal.error({
            title: 'Thất bại',
            content: 'Xóa khung giờ thất bại. Vui lòng thử lại',
          });
        }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };
  const ListItem = ({ id, timeStart }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{moment(timeStart, 'HH:mm:ss').format('HH:mm')}</td>
        <td>
          <EditButton 
            id={id} 
            forPage='updateSlot' 
            handleDelete={handleDelete} 
            item={{ id, timeStart: moment(timeStart, 'HH:mm:ss').format('HH:mm') }} 
          />
        </td>
      </tr>
    );
  };
  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Khung giờ" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Thêm khung giờ" 
              add={true} 
              linkToAdd='addSlot'
              handleSearch={handleSearch}
              searchTarget='ID'
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="ID" />
                    <HeaderColumn title="Thời gian" />
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredCombos) ? (
                    filteredCombos.map((item, index) => (
                      <ListItem key={index} {...item} />
                    ))
                  ) : (
                    <ListItem key={filteredCombos.id} {...filteredCombos} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default Slot
