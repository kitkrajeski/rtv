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
  };

  const [userState, setUserState] = useState(initState);

  const [publicState, setPublicState] = useState([]);

  async function resetUserState() {
    setUserState(initState);
  }

  function resetPublicState() {
    setPublicState([]);
  }
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
      console.log(error);
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
      console.log(error);
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

  async function getUserIssues() {
    resetPublicState();
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
      setPublicState((prevState) => {
        return {
          ...prevState,
          issues: res.data,
        };
      });
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

  console.log(userState.user);

  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        getUserIssues,
        addIssue,
        getIssues,
        resetUserState,
        setUserState,
        resetPublicState,
        ...publicState,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
