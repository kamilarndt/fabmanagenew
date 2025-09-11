import { NavLink } from 'react-router-dom'

export default function MobileNav() {
    return (
        <div className="d-md-none position-fixed bottom-0 start-0 end-0 bg-white border-top" style={{ zIndex: 1020 }}>
            <div className="d-flex justify-content-around py-2">
                <NavLink className="btn btn-link" to="/"><i className="ri-home-4-line"></i></NavLink>
                <NavLink className="btn btn-link" to="/projekty"><i className="ri-briefcase-4-line"></i></NavLink>
                <NavLink className="btn btn-link" to="/cnc"><i className="ri-shape-2-line"></i></NavLink>
                {/* Magazyn temporarily removed */}
                <NavLink className="btn btn-link" to="/zapotrzebowania"><i className="ri-shopping-cart-2-line"></i></NavLink>
                <NavLink className="btn btn-link" to="/produkcja"><i className="ri-dashboard-2-line"></i></NavLink>
            </div>
        </div>
    )
}


