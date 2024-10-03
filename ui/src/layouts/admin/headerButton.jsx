import addIcon from '../../assets/admin/add.svg'
import filterIcon from '../../assets/admin/filter.svg'
import searchIcon from '../../assets/admin/Search.svg'
import './headerButton.css'

const HeaderButton = ({text}) => {
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
                    placeholder="Search"
                />
            </div>
            <div className="addButton">
              <img className="arrowIcon" alt="" src={addIcon}  />
              <div className="add">Add {text}</div>
            </div>
          </div>  )
}

export default HeaderButton

