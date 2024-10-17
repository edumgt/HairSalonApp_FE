import React from 'react'
import styles from './navLink.module.css'
import { Link } from 'react-router-dom'

const NavLink = ({ currentPage, onBack }) => {
    const pages = currentPage.split(' / ')

    return (
        <div className={styles.navLink}>
            <Link to="/dashboard">Trang chủ</Link>
            {pages.map((page, index) => (
                <React.Fragment key={index}>
                    <span> / </span>
                    {index === pages.length - 1 ? (
                        <span>{page}</span>
                    ) : (
                        <Link to="#" onClick={onBack}>{page}</Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default NavLink