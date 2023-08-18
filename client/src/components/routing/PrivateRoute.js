import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  //   console.log(isAuthenticated, loading, Component);
  if (!loading && isAuthenticated) return <Component />;

  return <Navigate to="/login" />;
};
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
