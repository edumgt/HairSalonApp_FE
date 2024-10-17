import React from 'react'
import addIcon from '../../../../../assets/admin/add.svg'
import filterIcon from '../../../../../assets/admin/filter.svg'
import searchIcon from '../../../../../assets/admin/Search.svg'
import './headerButton.css'

const HeaderButton = ({text, add, onClick, onSearch}) => {
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="headerButton">
      <div className="filter">
        <img className="filterIcon" alt="" src={filterIcon} />            
      </div>          
      <div className="search">
        <img className="filterIcon" alt="" src={searchIcon} />
        <input 
          className="searchInput" 
          type="text" 
          placeholder="Tìm"
          onChange={handleSearchChange}
        />
      </div>
      {add && 
        <div className="addButton" onClick={onClick}>
          <img className="arrowIcon" alt="" src={addIcon}  />
          <div className="add">{text}</div>
        </div>
      }
    </div>
  )
}

export default HeaderButton
