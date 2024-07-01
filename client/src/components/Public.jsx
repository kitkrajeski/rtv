import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import IssuesList from "./IssuesList";

function Public() {
  const { getIssues, issues } = useContext(UserContext);

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <>
      <IssuesList issues={issues} />
    </>
  );
}

export default Public;
