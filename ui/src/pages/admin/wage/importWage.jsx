import React from 'react'
import NavLink from '../../../layouts/admin/components/link/navLink'
import AddForm from '../../../layouts/admin/components/form/add/addForm'

function ImportWage() {
    const inputs = [
        {
            label: 'Name',
            name:'name',
            isInput: true,
            rules: [{required: true, message: 'Please input Name!'}]
        },
        {
            label: 'Role',
            name:'role',
            isSelect: true,
            options: [
                {value: 'Staff'},
                {value: 'Manger'},
                {value: 'Admin'},
            ],
            rules: [{required: true, message: 'Please input Role!'}]
        },
        {
            label: 'Month',
            name:'month',
            isMonth: true,
            rules: [{required: true, message: 'Please input Month!'}]
        },
        {
            label: 'KPI',
            name:'kpi',
            isInput: true,
            rules: [{required: true, message: 'Please input KPI!'}]
        },
        {
            label: 'Bonus',
            name:'bonus',
            isInput: true,
            rules: [{required: true, message: 'Please input Bonus!'}]
        },
        {
            label: 'Total',
            name:'total',
            isInput: true,
            rules: [{required: true, message: 'Please input Total!'}]
        }

    ]
  return (
    <><NavLink currentPage='Wage' hasChild={true} nextPage='Import wage' />
    <AddForm inputs={inputs} /></>
  )
}

export default ImportWage