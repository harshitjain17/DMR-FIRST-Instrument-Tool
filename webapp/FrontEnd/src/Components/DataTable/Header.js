// import React from "react";
// import { useDispatch } from "react-redux";

// const Header = ({ title = "Page Title" }) => {
//     const dispatch = useDispatch();

//     const toggle = () => {
//         return (dispatch) => {
//             return dispatch({ type: actionTypes.TOGGLE_NAVBAR });
//         };
//     };
//     const toggleNavbar = () => {
//         return dispatch(toggle());
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//             <div className="container-fluid pr-5">
//                 <button
//                     type="button"
//                     id="sidebarCollapse"
//                     className="btn btn-info"
//                     onClick={toggleNavbar}
//                 >
//                     <i className="fas fa-align-justify"></i>
//                 </button>
//                 <h3>{title}</h3>
//             </div>
//         </nav>
//     );
// };

// export default Header;