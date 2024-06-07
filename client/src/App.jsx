import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Manage from './pages/Manage'
import CreateUser from './pages/CreateUser'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ProfileDetail from './pages/ProfileDetail'
import Report from './pages/Report'
import AttendanceDetail from './pages/AttendanceDetail'
import SearchEmployee from './pages/SearchEmployee'
import EmployeeRoute from './components/EmployeeRoute'
import AttendanceInfo from './pages/AttendanceInfo'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path='/manage' element={<Manage />} />
          <Route path='/create-user' element={<CreateUser />} />
          <Route path='/profile-detail/:id' element={<ProfileDetail />} />
          <Route path='/report' element={<Report />} />
          <Route path='/attendance-detail/:id' element={<AttendanceDetail />} />
          <Route path='/employee-info/:id' element={<SearchEmployee />} />
        </Route>
        <Route element={<EmployeeRoute />}>
          <Route path='/attendance-info' element={<AttendanceInfo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
