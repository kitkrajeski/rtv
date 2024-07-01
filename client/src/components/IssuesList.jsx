import React from "react";
import Issue from "../components/Issue";
export default function IssuesList(props) {
  const { issues } = props;

  const issueElements = issues.map((issue) => {
    return <Issue {...issue} key={issue._id} />;
  });

  return <div>{issueElements}</div>;
}
