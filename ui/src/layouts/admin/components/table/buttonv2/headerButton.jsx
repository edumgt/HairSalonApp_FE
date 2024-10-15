import { useNavigate } from 'react-router-dom'
import addIcon from '../../../../../assets/admin/add.svg'
import filterIcon from '../../../../../assets/admin/filter.svg'
// import searchIcon from '../../../../../assets/admin/Search.svg'
import './headerButton.css'
import Search from 'antd/es/input/Search'

const HeaderButton = ({text, add, linkToAdd, handleSearch, loadData}) => {
  const navigate = useNavigate();
  return (
        <div className="headerButton">
            <div className="filter">
              <img className="filterIcon" alt="" src={filterIcon} />            
              </div>          
              <Search
                placeholder="Search by ID"
                allowClear
                onClear={loadData}
                onSearch={handleSearch}
                style={{
                  width: 200,
                }}
              />
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

