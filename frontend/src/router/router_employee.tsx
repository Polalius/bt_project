import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Navbar from "../components/NavBar"
import HomeEmp from "../components/Employee/home_emp"
import EmployeeShow from "../components/Employee/show"
import EmployeeShow2 from "../components/Employee/show2"
import Form2 from "../components/Employee/form2"
import Form1 from "../components/Employee/form1"

const RouterEmployee = () => {
    return (
        <Router>
            <Navbar />
            <div className='container-router'>
              <Routes>
                  <Route path="/" element={<HomeEmp/>} />
                  <Route path="/รายการลางาน" element={<EmployeeShow  />} />
                  <Route path="/แบบฟอร์มขอลา" element={<Form1  />} />
                  <Route path="/รายการสลับวันลา" element={<EmployeeShow2  />} />
                  <Route path="/แบบฟอร์มสลับวันลา" element={<Form2/>} />  
              </Routes>
            </div>
        </Router>
    )
}
export default RouterEmployee;