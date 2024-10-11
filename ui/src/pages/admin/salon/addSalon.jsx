import NavLink from "../../../layouts/admin/components/link/navLink"
import AddForm from "../../../layouts/admin/components/form/add/addForm"

// const handleSubmit = (values) => {
//     console.log('Form values:', values);
//   };
const inputs = [
    {
        label: 'District',
        name: 'District',
        isInput: true,
        rules: [{ required: true, message: 'Please input district!' }]
    },
    {
        label: 'Street',
        name: 'Street',
        isInput: true,
        rules: [{ required: true, message: 'Please input street!' }]
    },
    {
        label: 'Status',
        name: 'Status',
        isStatus: true,
        options: [
            {value: 'Open'},
            {value: 'Close'}
        ],
        rules: [{ required: true, message: 'Please input status!' }]
    },
    {
        label: 'Upload image',
        name: 'Upload',
        isImg: true,
        valuePropName: "fileList",
        getValueFromEvent: 'normFile'
    }
]
const AddSalon = () => {
  return (
    <>
    <NavLink currentPage="Salon" hasChild={true} nextPage='Add salon' />
    <AddForm inputs={inputs} />
    </>
  )
}

export default AddSalon