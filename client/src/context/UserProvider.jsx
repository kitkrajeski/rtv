import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UserProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    issues: [],
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);

  const [publicIssues, setPublicIssues] = useState([]);

  async function signup(creds) {
    try {
      const res = await axios.post("/auth/signup", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          user: user,
          token: token,
        };
      });
    } catch (error) {
      handleAuthError(error.response.data.errMsg);
    }
  }

  async function login(creds) {
    try {
      const res = await axios.post("/auth/login", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user: user,
        token: token,
      }));
    } catch (error) {
      handleAuthError(error.response.data.errMsg);
    }
  }

  async function logout() {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          user: {},
          token: "",
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleAuthError(errMsg) {
    setUserState((prevUserState) => {
      //   console.log(errMsg);
      return {
        ...prevUserState,
        errMsg,
      };
    });
  }

  function resetAuthErr() {
    setUserState((prevUserState) => {
      return {
        ...prevUserState,
        errMsg: "",
      };
    });
  }

  async function getUserIssues() {
    // resetPublicState();
    try {
      const res = await userAxios.get("/api/issue/user");
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: res.data,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getIssues() {
    try {
      const res = await userAxios.get("/api/issue");
      setPublicIssues(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addIssue(newIssue) {
    try {
      const res = await userAxios.post("/api/issue", newIssue);
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: [...prevState.issues, res.data],
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  //   async function handleUpvote(issueId) {
  //     try {
  //       const res = await userAxios.put(`/api/issue/${issueId}/upvote`);
  //       console.log(res);
  //       //   const { upvotes } = res.data;
  //       setPublicIssues((prevPublicIssues) =>
  //         prevPublicIssues.map((issue) =>
  //           issueId === issue._id ? res.data : issue
  //         );
  //         setUserState((prevUserState) => {
  //             return {
  //                 ...prevUserState
  //                 issues: prevUserState.issues.map((issue) => issue._id === issueId ? res.data : issue)
  //             }
  //         })
  //       );
  //       // const issue = prevUserState.issues.find(iss => issueId === iss._id);
  //       // issue.upvotes = res.data.upvotes;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  async function handleUpvote(issueId) {
    try {
      const res = await userAxios.put(`/api/issue/${issueId}/upvote`);
      console.log(res);
      setPublicIssues((prevPublicIssues) =>
        prevPublicIssues.map((issue) =>
          issueId === issue._id ? res.data : issue
        )
      );
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          issues: prevUserState.issues.map((issue) =>
            issue._id === issueId ? res.data : issue
          ),
        };
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDownvote(issueId) {
    try {
      const res = await userAxios.put(`/api/issue/${issueId}/downvote`);
      console.log(res);
      setPublicIssues((prevPublicIssues) =>
        prevPublicIssues.map((issue) =>
          issueId === issue._id ? res.data : issue
        )
      );
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          issues: prevUserState.issues.map((issue) =>
            issue._id === issueId ? res.data : issue
          ),
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  const value = {
    ...userState,
    signup,
    login,
    logout,
    getUserIssues,
    addIssue,
    getIssues,
    handleAuthError,
    resetAuthErr,
    handleUpvote,
    handleDownvote,
    // resetUserState,
    // setUserState,
    // resetPublicState,
    publicIssues,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}
