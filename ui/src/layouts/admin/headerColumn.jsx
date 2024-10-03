import './headerColumn.css'
import sortIcon from '../../assets/admin/column-sorting.svg'

const HeaderColumn = ({ title, sortable }) => {
    return (
      <th className="columnHeader">
        <div className="headerName">{title}</div>
        {sortable && <img className="filterIcon" alt="" src={sortIcon} />}
      </th>
    );
  };

  export default HeaderColumn;