import {  BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "../components/NavBar"
import HomeEmp from "../components/Employee/home_emp"
import EmployeeShow from "../components/Employee/show"
import Form from "../components/Employee/form"
import EmployeeShow2 from "../components/Employee/show2"
import Form2 from "../components/Employee/form2"
import Home from "../components/Home"
import ManagerShow from "../components/Manager/show"
import Approve from "../components/Manager/approve"
import ManagerHistory from "../components/Manager/history"
import ManagerSwitchShow from "../components/Manager/switchshow"
import MyTable from "../components/Manager/switchtest"
import { useState } from "react"
import HomeMan from "../components/Manager/home_manager"

const RouterManager = () => {
    const [role, setRole] = useState<String>("")
    return (
        <Router>
            <Navbar />
            <div className='container-router'>
              <Routes>
              <Route path="/" element={<HomeMan />} />
                  <Route path="/รายการคำร้องขอลา" element={<ManagerShow  />} />
                  <Route path="/รายการอนุมัติการลา" element={<ManagerHistory  />} />
                  <Route path="/รายการคำร้องขอสลับวันลา" element={<ManagerSwitchShow  />} />
                  <Route path='/รายการอนุมัติสลับวันลา' element={<MyTable />}/>

                  <Route path="/รายการลางาน" element={<EmployeeShow  />} />
                  <Route path="/แบบฟอร์มขอลา" element={<Form  />} />
                  <Route path="/รายการสลับวันลา" element={<EmployeeShow2  />} />
                  <Route path="/แบบฟอร์มสลับวันลา" element={<Form2/>} />
                  
              </Routes>
            
            </div>
        </Router>
    )
}
export default RouterManager;