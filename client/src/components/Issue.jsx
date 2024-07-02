import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

export default function Issue(props) {
  const { title, description, user, username, _id, upvotes, downvotes } = props;
  const {
    user: sessionUser,
    handleUpvote,
    handleDownvote,
  } = useContext(UserContext);
  //   console.log(user._id);
  //   console.log(sessionUser._id);

  let isUser = user._id === sessionUser._id;

  //   return (
  //     <>
  //         <div>
  //         <h1>{title}</h1>
  //         <h4>{description}</h4>
  //         </div>
  //             { isUser && (
  //                 <button>Edit</button>
  //                 <button>Delete</button>
  //             )}
  //     </>
  //   )
  return (
    <>
      <div>
        <h1>{username}</h1>
        <h1>{title}</h1>
        <h4>{description}</h4>
        <p>Upvotes: {upvotes.length}</p>
        <p>Downvotes: {downvotes.length}</p>
        <button onClick={() => handleUpvote(_id)}>Upvote</button>
        <button onClick={() => handleDownvote(_id)}>downvote</button>
      </div>
      {isUser && (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </>
  );
}
