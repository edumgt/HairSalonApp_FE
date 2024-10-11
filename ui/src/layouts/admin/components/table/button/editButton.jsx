import './editButton.css'
import editIcon from '../../../../../assets/admin/pencil-fiiled.svg'
import deleteIcon from '../../../../../assets/admin/deleteIcon.svg'
import { Button } from 'antd';
// import { useResponsive } from 'antd-style';
const EditButton  = () => {
  return (
    <div className='editGroup'>
      <Button color="primary" variant="outlined" size='small'>
            Edit
            <img src={editIcon} alt="" />
      </Button>
      <Button color="danger" variant="outlined"  size='small'>
            Delete
            <img src={deleteIcon} alt="" />
      </Button>
    </div>
  )
}

export default EditButton;