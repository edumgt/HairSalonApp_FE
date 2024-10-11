import AddForm from '../../../layouts/admin/components/form/add/addForm'
import NavLink from '../../../layouts/admin/components/link/navLink'

function AddService() {
    const inputs = [
        {
            label: 'Category ID',
            name: 'id',
            isInput: true,
            rules: [{required: true, message: 'Please input ID!'}]
        },
        {
            label: 'Service ID',
            name: 'serviceID',
            isInput: true,
            rules: [{required: true, message: 'Please input ID!'}]
        },
        {
            label: 'Service Description',
            name: 'serviceDes',
            isTextArea: true,
            rules: [{required: true, message: 'Please input description!'}]
        },
        {
            label: 'Duration',
            name: 'duration',
            isInput: true,
            rules: [{required: true, message: 'Please input duration!'}]
        },
        {
            label: 'Price',
            name: 'price',
            isInput: true,
            rules: [{required: true, message: 'Please input price!'}]
        }
    ]
  return (
    <><NavLink currentPage='Service' hasChild={true} nextPage='Add service' />
    <AddForm inputs={inputs} /></>
  )
}

export default AddService