import NavBar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Chat from '../components/chatbot/Chat'

const MainLayout = ({numCartItems}) => {
  return (
    <>
    <NavBar numCartItems={numCartItems} />
    <ToastContainer />
    <Outlet />
    <Footer />
    <Chat />
    </>
  )
}

export default MainLayout