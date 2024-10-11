import AddForm from "../../../layouts/admin/components/form/add/addForm"
import NavLink from "../../../layouts/admin/components/link/navLink"

function AddCategory() {
    const inputs = [
        {
            label: 'Category ID',
            name: 'id',
            isInput: true,
            rules: [{required: true, message: 'Please input ID!'}]
        },
        {
            label: 'Category Name',
            name: 'name',
            isInput: true,
            rules: [{required: true, message: 'Please input name!'}]
        },
        {
            label: 'Category Description',
            name: 'categoryDes',
            isTextArea: true,
            rules: [{required: true, message: 'Please input description!'}]
        }
    ]
  return (
    <><NavLink currentPage='Category' hasChild={true} nextPage='Add category' />
    <AddForm inputs={inputs} /></>
  )
}

export default AddCategory