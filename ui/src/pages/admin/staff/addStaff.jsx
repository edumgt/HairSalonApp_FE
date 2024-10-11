import AddForm from "../../../layouts/admin/components/form/add/addForm"
import NavLink from "../../../layouts/admin/components/link/navLink"

function AddStaff() {
    const inputs = [
        {
            label: 'ID',
            name: 'id',
            isInput: true,
            rules: [{required: true, message: 'Please input ID!'}]
        },
        {
            label: 'Name',
            name: 'name',
            isInput: true,
            rules: [{required: true, message: 'Please input Name!'}]
        },
        {
            label: 'Date of Birth',
            name: 'dob',
            isDate: true,
            rules: [{required: true, message: 'Please input Date of birth!'}]
        },
        {
            label: 'Applied date',
            name: 'appliedDate',
            isDate: true,
            rules: [{required: true, message: 'Please input Applied date!'}]
        },
        {
            label: 'Workplace',
            name: 'workplace',
            isInput: true,
            rules: [{required: true, message: 'Please input Workplace!'}]
        },
        {
            label: 'Role',
            name: 'role',
            isSelect: true,
            options: [
                {value: 'Staff'},
                {value: 'Manager'},
                {value: 'Admin'}
            ],
            rules: [{required: true, message: 'Please input Applied role!'}]
        }
    ]
  return (
    <>
    <NavLink currentPage='Staff' hasChild={true} nextPage='Add staff' />
    <AddForm inputs={inputs}/>
    </>
  )
}

export default AddStaff