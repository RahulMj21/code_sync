import React from "react";
import Avatar from "react-avatar";

const User = ({ name }: { name: string }) => {
  // const iconText = name.slice(0, 2);
  return (
    <div className="user">
      <Avatar name={name} size="50px" round="12px" className="user__avatar" />
      <p className="user__name">{name}</p>
    </div>
  );
};

export default User;
