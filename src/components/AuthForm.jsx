// import React, { useState } from "react";
// import "./auth.css";

// const AuthForm = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       return setMessage("All fields required");
//     }
//     if (password.length < 6) {
//       return setMessage("Password must be at least 6 characters");
//     }

//     setMessage(`${isLogin ? "Logged in" : "Signed up"} successfully (Dummy)`);

//     // TODO: Replace with Firebase or backend auth call
//   };

//   return (
//     <div className="auth-container">
//       <h2>{isLogin ? "Login" : "Signup"}</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password (min 6 chars)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">{isLogin ? "Login" : "Signup"}</button>
//       </form>
//       <p>{message}</p>
//       <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? "New here? Signup" : "Already have an account? Login"}
//       </p>
//     </div>
//   );
// };

// export default AuthForm;
