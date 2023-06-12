import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Navbar from "../components/NavBar"
import Home from "../components/Home"
import PayrollShow from "../components/Payroll/payroll"
import SwitchPayrollShow from "../components/Payroll/switch_payroll"

const RouterAdmin = () => {
    return (
        <Router>
            <Navbar />
            <div className='container-router'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/รายการการลางาน" element={<PayrollShow  />} />
                <Route path="/รายการการสลับวันลา" element={<SwitchPayrollShow  />} />
                 
              </Routes>
            </div>
        </Router>
    )
}
export default RouterAdmin;