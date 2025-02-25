// import React, { useState } from "react";
// import "./layout.css";
// import img from "./Am.png";


// import { Box, Button, keyframes } from "@mui/material";
// import api from "../HTTPHandler/axiosConfig";
// import Timer from "../CommonComponenets/TimerComponent/timer";
// import { useDispatch, useSelector } from "react-redux";
// import { manageTimer } from "../Redux/timerSlice/ManageTimer";
// import { endTimer } from "../Redux/timerSlice/TimerSlice";
// import {
//   toggleBreak,
//   toggleLunch,
// } from "../Redux/ctrlMngntSilce/breakManagementSlice";
// import { toast } from "react-toastify";


// const Layout = () => {
//   // Define the animation
//   const fadeIn = keyframes`
// from {
//   transform: translateX(-100%);
//   opacity: 0;
// }
// to {
//   transform: translateX(0);
//   opacity: 1;
// }
// `;
//   const [comment, setComment] = useState("");
//   // const [isBreakIn, setIsBreakIn] = useState(true);
//   // const [isLunchIn, setIsLunchIn] = useState(true); // New state for lunch
//   // const [message, setMessage] = useState("");
//   const userEmail = useSelector((state) => state.auth.user?.Email);
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector((state) => state.timerState.timerActive);
//   console.log(isLoggedIn);
//   const isLunchIn = useSelector(
//     (state) => state.breakManagementSlice.isLunchIn
//   );
//   const isBreakIn = useSelector(
//     (state) => state.breakManagementSlice.isBreakIn
//   );
//   const interval = useSelector((state) => state.timerState.interval);
//   // let stopTimer = useRef(null);

//   const handleStart = () => {
//     // stopTimer.current = dispatch(manageTimer());
//     dispatch(manageTimer());
//   };

//   const handleStop = () => {
//     if (interval) {
//       // console.log(stopTimer);
//       // stopTimer.current(); // Stop the interval
//       dispatch(endTimer());
//     }
//   };

//   // const handleReset = () => {
//   //   dispatch(resetTimer());
//   // };

//   const handleLoginToggle = () => {
//     const activityType = isLoggedIn ? "Punched Out": "Punched In";
//     isLoggedIn ? handleStop() : handleStart();
//     // const messageText = isLoggedIn
//     //   ? "You are successfully logged out!"
//     //   : "You are successfully logged in!";
//     const commentText = comment.trim(); // Trim the comment text
//     if (commentText !== "") {
//       storeActivity("comment", "comment stored successfully", commentText);
//       setComment("");
//     }

//     storeActivity(activityType, commentText);
//   };
//   const handleActivityToggle = () => {
//     // setIsBreakIn((prevState) => !prevState);
//     dispatch(toggleBreak());

//     const activityType = isBreakIn ? "breakout" : "breakin";
//     // activityType == "breakin" ? handleStop() : handleStart();
//     // const messageText = isBreakIn
//     //   ? "You have successfully break in!"
//     //   : "You have successfully break out!";
//     const commentText = comment.trim(); // Trim the comment text
//     storeActivity(activityType, commentText);
//     setComment("");
//   };

//   const handleLunchToggle = () => {
//     // Function to toggle lunch in/out`
//     // setIsLunchIn((prevState) => !prevState);
//     dispatch(toggleLunch());
//     const activityType = isLunchIn ? "lunchout" : "lunchin";
//     // const messageText = isLunchIn
//     //   ? "You have successfully taken lunch in!"
//     //   : "You have successfully taken lunch out!";
//     const commentText = comment.trim(); // Trim the comment text
//     storeActivity(activityType, commentText);
//     setComment("");
//   };

//   // messageText,
//   const storeActivity = (activityType, commentText) => {
//     const currentDate = new Date(); // Get current date and time
//     const month = currentDate.getMonth() + 1; // Get month (returns 0-indexed, so add 1)
//     const year = currentDate.getFullYear(); // Get full year
//     const date = currentDate.getDate(); // Get day of the month
//     const currentdate = `${month}/${date}/${year}`; // Format date as MM/DD/YYYY
//     const hours = currentDate.getHours(); // Get hours (0-23)
//     const minutes = currentDate.getMinutes(); // Get minutes (0-59)
//     const seconds = currentDate.getSeconds(); // Get seconds (0-59)
//     const currentTime = `${hours}:${minutes}:${seconds}`; // Format time as HH:MM:SS

//     const data = {
//       Date: currentdate,
//       Time: currentTime,
//       Userid: userEmail,
//       Activity_type: activityType,
//       Comments: commentText,
//     };
//     api
//       .post("/attendance_app", data)
//       .then((response) => {
//         toast.success(`You have successfully ${activityType}`);
//         console.log(
//           `${activityType} time stored successfully:`,
//           response.data.Userid
//         );
//         // setMessage(messageText);
//         // if (activityType === "login") {
//         //   setIsLoggedIn(true);
//         // } else if (activityType === "logout") {
//         //   setIsLoggedIn(false);
//         // }
//       })
//       .catch((error) => {
//         console.error(`Error storing ${activityType} time:`, error);
//       });
//   };

//   const handleInputChange = (e) => {
//     setComment(e.target.value);
//   };

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <div
//         className="layout"
//         style={{
//           width: "100vw",
//           height: "90vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           position: "relative",
//           // top: "85px",
//           zIndex: 1,
//         }}
//       >
//         {/* left container */}
//         <Box
//           className="left-image"
//           sx={{
//             paddingTop: "90px",
//             width: "50%",
//             height: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Box
//             className="inner-image"
//             width={600}
//             height={400}
//             sx={{
//               animation: `${fadeIn} 2s ease-out forwards`,
//             }}
//           >
//             <img src={img} alt="" className="logo-wel" />
//           </Box>
//         </Box>
//         {/* Right container */}
//         <Box
//           className="right-side-div"
//           sx={{
//             paddingTop: "25px",
//             width: "50%",
//             height: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           {/* split into two one is for logo image and another for timelogs */}
//           <Box
//             className="Food Logo-container"
//             width={"100%"}
//             height={"23%"}
//             // bgcolor={"red"}
//             display={"flex"}
//             justifyContent={"center"}
//             alignItems={"center"}
//           >
//             {/* Need to animation container */}
//             <Box
//               className="food logo"
//               width={"100%"}
//               height={"100%"}
//               // bgcolor={"black"}
//             >
//               {/* Logo */}
//             </Box>
//           </Box>
//           {/* timings container */}
//           <Box
//             className="timing container"
//             width={"100%"}
//             height={"55%"}
//             // bgcolor={"blueviolet"}
//             display={"flex"}
//             justifyContent={"center"}
//           >
//             <Box
//               width={"400px"}
//               height={"350px"}
//               bgcolor={"#e1dede"}
//               borderRadius={"10px"}
//               display={"flex"}
//               flexDirection={"column"}
//               alignItems={"center"}
//               justifyContent={"space-evenly"}
//               sx={{
//                 boxShadow: "0px 0px 10px #aaa",
//                 "&:hover": {
//                   boxShadow: "2px 2px 20px #27ABCC",
//                 },
//               }}
//             >
//               <Box>
//                 <input
//                   type="text"
//                   value={comment}
//                   onChange={handleInputChange}
//                   placeholder="Enter your comment"
//                   className="comment-input"
//                 />
//               </Box>
//               <Box>
//                 <Timer />
//               </Box>
//               <Box
//                 width={"100%"}
//                 display={"flex"}
//                 justifyContent={"space-evenly"}
//                 alignItems={"center"}
//               >
//                 <Button
//                   variant="contained"
//                   color={isLoggedIn ? "primary" : "success"}
//                   className="login-button"
//                   onClick={handleLoginToggle}
//                   disabled={isLunchIn || isBreakIn}
//                 >
//                   {isLoggedIn ? "Time Out" : "Time In"}
//                 </Button>
//                 {isLoggedIn && (
//                   <>
//                     <Button
//                       variant="contained"
//                       color={!isBreakIn ? "success" : "error"}
//                       className="break-button"
//                       onClick={handleActivityToggle}
//                       disabled={isLunchIn}
//                     >
//                       {!isBreakIn ? "Break In" : "Break Out"}
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color={!isLunchIn ? "success" : "error"}
//                       className="lunch-button"
//                       onClick={handleLunchToggle}
//                       disabled={isBreakIn}
//                     >
//                       {!isLunchIn ? "Lunch In" : "Lunch Out"}
//                     </Button>
//                   </>
//                 )}
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </div>
//       {/* <Box className="message Box" position={"abso?lute"} bottom={77} right={10}> */}
//       {/* {message && (
//           <Box
//             bgcolor={"#4caf50"}
//             color={"white"}
//             padding={"10px"}
//             borderRadius={"20px"}
//             className="login-message"
//             sx={{ animation: "fadeIn 1s ease-in-out" }}
//           >
//             {message}
//           </Box>
//         )}
//       </Box> */}
//     </div>
//   );
// };

// export default Layout;


import { Box, Button, keyframes } from "@mui/material";
import "./layout.css";
import api from "../HTTPHandler/axiosConfig";
import Timer from "../CommonComponenets/TimerComponent/timer";
import { useDispatch, useSelector } from "react-redux";
import { manageTimer } from "../Redux/timerSlice/ManageTimer";
import { endTimer } from "../Redux/timerSlice/TimerSlice";
import { useState } from "react";
import img from "./Am.png";
import breakImg from "./rbreak.jpg";
import lunch from "./rlunch.jpg"


import {
  toggleBreak,
  toggleLunch,
} from "../Redux/ctrlMngntSilce/breakManagementSlice";
import { toast } from "react-toastify";
import { Welcomemsg } from "./welcomemsg";

const Layout = () => {
    // Define the animation
  const fadeIn = keyframes`
from {
  transform: translateX(-100%);
  opacity: 0;
}
to {
  transform: translateX(0);
  opacity: 1;
}
`;
  const [comment, setComment] = useState("");
  const userEmail = useSelector((state) => state.auth.user?.Email);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.timerState.timerActive);
  const isLunchIn = useSelector(
    (state) => state.breakManagementSlice.isLunchIn
  );
  const isBreakIn = useSelector(
    (state) => state.breakManagementSlice.isBreakIn
  );
  const interval = useSelector((state) => state.timerState.interval);
  const [imageType, setImageType] = useState("main");

  const handleStart = () => {
    dispatch(manageTimer());
  };

  const handleStop = () => {
    if (interval) {
      dispatch(endTimer());
    }
  };

  const handleLoginToggle = () => {
    const activityType = isLoggedIn ? "Time Out" : "Time In";
    isLoggedIn ? handleStop() : handleStart();
    const commentText = comment.trim();
    if (commentText !== "") {
      storeActivity("comment", "comment stored successfully", commentText);
      setComment("");
    }
    storeActivity(activityType, commentText);
  };

  const handleActivityToggle = () => {
    dispatch(toggleBreak());
    setImageType(isBreakIn ? "main" : "break");
    const activityType = isBreakIn ? "breakout" : "breakin";
    const commentText = comment.trim();
    storeActivity(activityType, commentText);
    setComment("");
  };

  const handleLunchToggle = () => {
    dispatch(toggleLunch());
    setImageType(isLunchIn ? "main" : "lunch");
    const activityType = isLunchIn ? "lunchout" : "lunchin";
    const commentText = comment.trim();
    storeActivity(activityType, commentText);
    setComment("");
  };

  const storeActivity = (activityType, commentText) => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const date = currentDate.getDate();
    const currentdate = `${month}/${date}/${year}`;
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const data = {
      Date: currentdate,
      Time: currentTime,
      Userid: userEmail,
      Activity_type: activityType,
      Comments: commentText,
    };
    api
      .post("/attendance_app", data)
      .then((response) => {
        toast.success(`You have successfully ${activityType}`);
        console.log(
          `${activityType} time stored successfully:`,
          response.data.Userid
        );
      })
      .catch((error) => {
        console.error(`Error storing ${activityType} time:`, error);
      });
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        className="layout"
        style={{
          width: "100vw",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          className="left-image"
          sx={{
            paddingTop: "90px",
            // width: "50%",
            // height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            className="inner-image"
            width={600}
            height={400}
            sx={{
              animation: `${fadeIn} 2s ease-out forwards`,
            }}
          >
            <Welcomemsg />
            {imageType === "main" && <img src={img} alt="" className="logo-wel" />}
            {imageType === "break" && <img src={ breakImg} alt="" className="logo-wel" />}

            {imageType === "lunch" && <img src={lunch} alt="" className="logo-wel" />}
            
            
          </Box>
        </Box>
        <Box
          className="right-side-div"
          sx={{
            paddingTop: "25px",
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            className="Food Logo-container"
            width={"100%"}
            height={"23%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              className="food logo"
              width={"100%"}
              height={"100%"}
            >
              {/* Logo */}
            </Box>
          </Box>
          <Box
            className="timing container"
            width={"100%"}
            height={"55%"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Box
              width={"400px"}
              height={"350px"}
              bgcolor={"#e1dede"}
              borderRadius={"10px"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              sx={{
                boxShadow: "0px 0px 10px #aaa",
                "&:hover": {
                  boxShadow: "2px 2px 20px #27ABCC",
                },
              }}
            >
              <Box>
                <input
                  type="text"
                  value={comment}
                  onChange={handleInputChange}
                  placeholder="Enter your comment"
                  className="comment-input"
                />
              </Box>
              <Box>
                <Timer />
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Button
                  variant="contained"
                  color={isLoggedIn ? "primary" : "success"}
                  className="login-button"
                  onClick={handleLoginToggle}
                  disabled={isLunchIn || isBreakIn}
                >
                  {isLoggedIn ? "Time Out" : "Time In"}
                </Button>
                {isLoggedIn && (
                  <>
                    <Button
                      variant="contained"
                      color={!isBreakIn ? "success" : "error"}
                      className="break-button"
                      onClick={handleActivityToggle}
                      disabled={isLunchIn}
                    >
                      {!isBreakIn ? "Break In" : "Break Out"}
                    </Button>
                    <Button
                      variant="contained"
                      color={!isLunchIn ? "success" : "error"}
                      className="lunch-button"
                      onClick={handleLunchToggle}
                      disabled={isBreakIn}
                    >
                      {!isLunchIn ? "Lunch In" : "Lunch Out"}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Layout;

