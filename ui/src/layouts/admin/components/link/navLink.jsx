import React from 'react'
import './navLink.css'
import arrowIcon from '../../../../assets/admin/arrow.svg'
const NavLink = ({currentPage, hasChild, nextPage}) => {
  return (
    <div className="adminPortalParent">
        <div className="adminPortal">Admin Portal</div>
        <img className="arrow" alt="" src={arrowIcon} />
        <div className="adminPortal">{currentPage}</div>
        {hasChild && 
          <>
            <img className="arrow" alt="" src={arrowIcon} />
            <div className="adminPortal">{nextPage}</div>
          </>
        }
    </div>
  )
}

export default NavLink