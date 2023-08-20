import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
  profile: { status, user, company, location, skills },
}) => {
  // console.log("user->\n", user);
  return (
    <>
      {user && (
        <div className="profile bg-light">
          <img src={user.avatar} alt="Profile Img" className="round-img"></img>
          <div>
            <h2>{user.name}</h2>
            <p>
              {status} {company !== null && <span> at {company} </span>}
            </p>
            <p className="my-1">{location && <span>{location}</span>}</p>

            <Link to={`/profile/${user._id}`} className="btn btn-primary">
              View Profile
            </Link>
          </div>
          <ul>
            {skills.slice(0, 5).map((skill, index) => (
              <li key={index} className="text-primary">
                <i className="fas fa-check" /> {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
