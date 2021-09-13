import React from "react";
import { Button } from "../../components";
import { logout } from "../../store/modules";
export default function Header({ title }) {
  const logoutUser = () => {
    logout();
  };

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={logoutUser} title={"logout"} />
    </div>
  );
}
