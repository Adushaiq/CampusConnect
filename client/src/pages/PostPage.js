import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import ShareButton from "../ShareButton";
import { AiOutlineSend } from "react-icons/ai";
import defaultImage from "../Assets/user.png";

import { useRef } from "react";
import { useInView } from "framer-motion";

function Section({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref}>
      <span
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 2s cubic-bezier(0.17, 0.55, 0.55, 1) .5s",
        }}
      >
        {children}
      </span>
    </section>
  );
}

export default function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [postInfo, setPostInfo] = useState(null);
  const [moreOption, setMoreOption] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });

    fetch(`http://localhost:4000/comment`).then((response) => {
      response.json().then((commentInfo) => {
        setCommentsData(commentInfo);
      });
    });
  }, []);

  useEffect(() => {});

  // Assuming you are inside a React component
  const handleCommentSubmission = async (ev) => {
    ev.preventDefault();
    try {
      const commentData = {
        post: id,
        user: userInfo.username,
        content: comments,
      };

      if (comments.length > 200) {
        alert("Comment should be less than 200 characters");
      }
      if (comments.length < 0) {
        alert("Comment should not be less than 0 characters");
      }

      const response = await fetch(`http://localhost:4000/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      setComments("");
    } catch (error) {
      console.error(error);
    }
  };

  function handleMoreOption() {
    setMoreOption(!moreOption);
  }

  const commentFinal = commentsData.map((obj) =>
    Object.keys(obj).map((key) => obj[key])
  );

  if (!postInfo) return "";

  return (
    <Section>
      <div className="post-page">
        <h1 className="title">{postInfo.title}</h1>

        <time>
          {" "}
          {format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}{" "}
        </time>
        <div className="author">by {postInfo.author.name}</div>

        {userInfo && userInfo.id === postInfo.author._id && (
          <div className="edit-row ">
            <Link onClick={handleMoreOption}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </Link>

            {moreOption && (
              <div className="moreOption">
                <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </Link>

                <Link className="edit-btn" to={`/delete/${postInfo._id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete
                </Link>

                <ShareButton shareUrl={id}></ShareButton>
              </div>
            )}
          </div>
        )}

        {userInfo.id != postInfo.author._id && (
          <ShareButton shareUrl={id}></ShareButton>
        )}

        <div className="image">
          <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
        </div>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        ></div>

        {/* Comment Section */}
        <div className="commentSection">
          <h3>Comments</h3>
          <form className="commentForm" onSubmit={handleCommentSubmission}>
            <input
              type="text"
              placeholder="Add a comment"
              value={comments}
              onChange={(ev) => setComments(ev.target.value)}
            />
            <AiOutlineSend
              className="sendIcon"
              onClick={handleCommentSubmission}
            />
          </form>

          <div className="commentContainer">
            {commentFinal.map((item) =>
              item[1] === id ? (
                <div className="comment">
                  <img className="image" src={defaultImage} alt="" />
                  <div className="details">
                    <h6>{item[2]}</h6>
                    <p> {item[3]} </p>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
