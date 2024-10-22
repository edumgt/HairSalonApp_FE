import { useNavigate } from 'react-router-dom'
import addIcon from '../../../../../assets/admin/add.svg'
import filterIcon from '../../../../../assets/admin/filter.svg'
import searchIcon from '../../../../../assets/admin/Search.svg'
import './headerButton.css'

const HeaderButton = ({text, add, linkToAdd, handleSearch, searchTarget}) => {
  const navigate = useNavigate();
  return (
        <div className="headerButton">
            <div className="filter">
              <img className="filterIcon" alt="" src={filterIcon} />            
              </div>          
              <div className="search">
                <img className="filterIcon" alt="" src={searchIcon} />
                <input 
                  className="searchInput" 
                  placeholder= {`Tìm theo ${searchTarget}`}
                  onChange={handleSearch}
                />
              </div>
              {/* <Search
                placeholder= {`Tìm theo ${searchTarget}`}
                allowClear
                onClear={loadData}
                onChange={handleSearch}
                style={{
                  width: 200,
                }}
              /> */}
            {add && 
              <div className="addButton" onClick={() => navigate(linkToAdd)}>
                <img className="arrowIcon" alt="" src={addIcon}  />
                <div className="add">{text}</div>
              </div>
            }
          </div>
            
          )
}

export default HeaderButton

