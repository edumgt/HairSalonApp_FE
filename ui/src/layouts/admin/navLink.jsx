import React from 'react'
import './navLink.css'
import arrowIcon from '../../assets/admin/arrow.svg'
const NavLink = ({currentPage}) => {
  return (
    <div className="adminPortalParent">
        <div className="adminPortal">Admin Portal</div>
        <img className="arrow" alt="" src={arrowIcon} />
        <div className="adminPortal">{currentPage}</div>
    </div>
  )
}

export default NavLink