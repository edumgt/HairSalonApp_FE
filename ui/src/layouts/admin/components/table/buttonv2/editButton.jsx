import './editButton.css'
import editIcon from '../../../../../assets/admin/pencil-fiiled.svg'
import deleteIcon from '../../../../../assets/admin/deleteIcon.svg'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useResponsive } from 'antd-style';
const EditButton = ({handleDelete, id, forPage, item}) => {
  const navigate = useNavigate()
  const handleEdit = () => {
    navigate(forPage, { state: { item } })
  }
  return (
    <div className='editGroup'>
      <Button color="primary" variant="outlined" size='small' onClick={handleEdit}>
            Cập nhật
            <img className='editImg' src={editIcon} alt="" />
      </Button>
      <Button color="danger" variant="outlined"  size='small' value={id} onClick={() => handleDelete(id)}>
            Xóa
            <img className='editImg' src={deleteIcon} alt=""/>
      </Button>
    </div>
  )
}

export default EditButton;