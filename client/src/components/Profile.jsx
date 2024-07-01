import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import IssuesList from "./IssuesList";
import IssueForm from "./IssueForm";

function Profile() {
  const { user, getUserIssues, issues } = useContext(UserContext);

  useEffect(() => {
    getUserIssues();
  }, []);

  return (
    <>
      <h1>Username: {user.username}</h1>
      <IssueForm />
      <IssuesList issues={issues} />
    </>
  );
}

export default Profile;
