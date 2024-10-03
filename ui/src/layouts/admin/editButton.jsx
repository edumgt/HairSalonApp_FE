import './editButton'
import editIcon from '../../assets/admin/pencil-fiiled.svg'

const EditButton  = () => {
  return (
    <div className="editGroup">
      <div className="edit">Edit</div>
      <img src={editIcon} alt="Edit Icon" />
    </div>
  )
}

export default EditButton;