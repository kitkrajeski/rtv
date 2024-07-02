import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import IssuesList from "./IssuesList";

function Public() {
  const { getIssues, publicIssues } = useContext(UserContext);

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <>
      <IssuesList issues={publicIssues} />
    </>
  );
}

export default Public;
