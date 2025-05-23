import { useContext, useState } from "react"
import "./LoginPage.css"
import api from "../../api"
import Error from "../ui/Error"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"

const LoginPage = () => {

  const {setIsAuthenticated, get_username} = useContext(AuthContext)

  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const userInfo = {username, password}

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    api.post("token/", userInfo )
    .then(res => {
      console.log(res.data)
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      setUsername("")
      setPassword("")
      setLoading(false)
      setIsAuthenticated(true)
      get_username()
      setError("")

      const from = location?.state?.from.pathname || "/";
      navigate(from, {replace:true});
    })
    .catch(err => {
      console.log(err.message);
      
      if (err.response?.status === 401) {
        setError("Invalid username or password. Please check your credentials and try again.");
      } else if (err.response?.status === 404) {
        setError("Account not found. Please verify your username or create a new account.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (err.message.includes("Network Error")) {
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setError("Login failed. Please try again or contact support if the problem persists.");
      }
      
      setLoading(false);
    })
  }

  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        {error && <Error error={error} /> }
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please Login to Your Account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="username" value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="form-control" id="email" placeholder="Enter Your Username" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control" id="password" placeholder="Enter Your Password" required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>Login</button>
        </form>
        <div className="login-footer">
          <p><a href="#">Forgot Password?</a></p>
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage