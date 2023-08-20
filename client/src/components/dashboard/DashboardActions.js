import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DashboardActions = ({ user: { _id } }) => {
  // console.log("lohg->", _id);
  return (
    <>
      <div className="dash-buttons">
        <Link to="/edit-profile" className="btn btn-primary">
          <i className="fas fa-user-circle text-light"></i> Edit Profile
        </Link>
        <Link to="/add-experience" className="btn btn-primary">
          <i className="fab fa-black-tie text-light"></i> Add Experience
        </Link>
        <Link to="/add-education" className="btn btn-primary">
          <i className="fas fa-graduation-cap text-light"></i> Add Education
        </Link>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          <i className="fas fa-graduation-cap text-light"></i> View Profile
        </Link>
      </div>
    </>
  );
};
DashboardActions.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DashboardActions;
