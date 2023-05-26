package controller

import (
	"fmt"
	"net/http"
	

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /leave_type
func CreateLeaveType(c *gin.Context) {
	var l_type entity.LeaveType
	if err := c.ShouldBindJSON(&l_type); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&l_type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": l_type})
}

// GET /leave_type/:id
func GetLeaveType(c *gin.Context) {
	var l_type entity.LeaveType
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM leave_types WHERE id = ?", id).Scan(&l_type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": l_type})
}

// List /leave_type
func ListLeaveType(c *gin.Context) {
	var l_types []entity.LeaveType
	if err := entity.DB().Raw("SELECT * FROM leave_types").Scan(&l_types).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": l_types})
}

// DELETE /leave_type/:id
func DeleteLeaveType(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM leave_types WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Exercise not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /leave_type
func UpdateLeaveType(c *gin.Context) {
	var l_type entity.LeaveType
	if err := c.ShouldBindJSON(&l_type); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", l_type.ID).First(&l_type); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type not found"})
		return
	}

	if err := entity.DB().Save(&l_type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": l_type})
}

// POST /program
func CreateLeaveList(c *gin.Context) {

	var employees entity.Employee
	var l_type entity.LeaveType
	var leavelists entity.LeaveList
	var manager entity.Manager
	var depart entity.Department

	// ผลลัพธ์ที่ได้จากขั้นตอนที่  จะถูก bind เข้าตัวแปร leavelists
	if err := c.ShouldBindJSON(&leavelists); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", leavelists.EmployeeID).First(&employees); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
		return
	}
	// ค้นหา leave type ด้วย id
	if tx := entity.DB().Where("id = ?", leavelists.LeaveTypeID).First(&l_type); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณากรอกการลา"})
		return
	}
	// ค้นหา manager ด้วย id
	if tx := entity.DB().Where("id = ?", leavelists.ManagerID).First(&manager); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
		return
	}
	//ค้นหา แผนก ด้วย id
	if tx := entity.DB().Where("id = ?", leavelists.DepartmentID).First(&depart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}
	//เช็ค ลาซ้ำ
	if leavelists.StartDate == leavelists.StopDate {
		if tx := entity.DB().Where("employee_id = ? AND (start_date = ?) AND (start_date = stop_date) AND ( ? BETWEEN start_time AND stop_time)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว วันเดียวกัน1"})
			return
		}
		if tx := entity.DB().Where("employee_id = ? AND (start_date = ?) AND (start_date = stop_date) AND ( ? BETWEEN start_time AND stop_time)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว วันเดียวกัน2"})
			return
		}
		if tx := entity.DB().Where("employee_id = ? AND (stop_date = ?) AND (start_date != stop_date) AND ( ? BETWEEN 480 AND stop_time)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว วันเดียวกัน7"})
			return
		}
		if tx := entity.DB().Where("employee_id = ? AND (start_date = ?) AND (start_date != stop_date) AND (? BETWEEN start_time and 1020)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว6"})
			return
		}
	}
	if leavelists.StartDate != leavelists.StopDate {
	if tx := entity.DB().Where("employee_id = ? AND (start_date = ?) AND (start_date != stop_date) AND (? BETWEEN start_time and 1020)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว3"})
		return
	}
	if tx := entity.DB().Where("employee_id = ? AND (start_date = ?) AND (start_date != stop_date) AND (stop_date = ?) AND (? BETWEEN 480 and stop_time)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StopDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว4"})
		return
	}
	if tx := entity.DB().Where("employee_id = ? AND (stop_date = ?) AND (start_date != stop_date) AND (? BETWEEN 480 AND stop_time)", leavelists.EmployeeID, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว5"})
		return
	}
	}
	// 12: สร้าง leave_list
	l_list := entity.LeaveList{
		Employee:   employees,             // โยงความสัมพันธ์กับ Entity Employee
		LeaveType: l_type,					// โยงความสัมพันธ์กับ Entity Leave type
		StartDate: leavelists.StartDate,                
		StartTime: leavelists.StartTime, // ตั้งค่าฟิลด์ Start_time
		StopDate: leavelists.StopDate,
		StopTime:  leavelists.StopTime,  // ตั้งค่าฟิลด์ Stop_time
		CountL: leavelists.CountL,
		Manager: manager,
		Department: depart,
		Status:     leavelists.Status,     // ตั้งค่าฟิลด์ Status
	}
	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(l_list); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&l_list).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": l_list})
}

// GET /leave_list/:id
func GetLeaveList(c *gin.Context) {
	var leavelist entity.LeaveList
	id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Preload("Department").Raw("SELECT * FROM leave_lists WHERE id = ?", id).Find(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}

// LIST /leave_list
func ListLeaveList(c *gin.Context) {
	var leavelists []entity.LeaveList
	
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Preload("Department").Raw("SELECT * FROM leave_lists").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByEmpID(c *gin.Context) {
	var leavelists []entity.LeaveList
	emp_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Preload("Department").Raw("SELECT * FROM leave_lists WHERE employee_id = ?", emp_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByDepID(c *gin.Context) {
	var leavelists []entity.LeaveList
	man_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Preload("Department").Raw("SELECT * FROM leave_lists WHERE department_id = ?", man_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list status wait
func ListLeaveListByDepIDnSwait(c *gin.Context) {
	var leavelists []entity.LeaveList
	man_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Preload("Department").Raw("SELECT * FROM leave_lists WHERE department_id = ? and status ='pending approval'", man_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
type results struct{
	ID int
	DepID int
	EmpEmail string
	ManEmail string
	TypeName string
	EmpName string
	ManName string
	StartDate  string
	StartTime   int
	StopDate    string
	StopTime    int
	count_l		int
	DepName		string
	Status string
}
func ListLeave(c *gin.Context){
	var results []results
	
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date, leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveStatus(c *gin.Context){
	var results []results
	
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("leave_lists.status = 'approved'").Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveStatusDate(c *gin.Context){
	var results []results
	start := c.Param("start")
	stop := c.Param("stop")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("leave_lists.status = 'approved' AND (start_time BETWEEN ? AND ?)",start,stop).Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveWait(c *gin.Context){
	var results []results
	dep_id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("departments.id = ? AND leave_lists.status = 'pending approval'", dep_id).Find(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveEID(c *gin.Context){
	var results []results
	id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("leave_lists.employee_id = ? ORDER BY leave_lists.id DESC LIMIT 3", id).Find(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveWaitDate(c *gin.Context){
	var results []results
	
	dep_id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("departments.id = ? AND leave_lists.status = 'pending approval'", dep_id).Find(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
// LIST /leave_list status wait
func ListLeaveListByDepIDnSNwait(c *gin.Context) {
	var results []results
	d_id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id as dep_id, employees.email as emp_email,managers.email as man_email, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_date,leave_lists.start_time, leave_lists.stop_date, leave_lists.stop_time, leave_lists.count_l, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("departments.id = ? and leave_lists.status = 'approved'", d_id).Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
// DELETE /leave_list/:id
func DeleteLeaveListByID(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM leave_lists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "list not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateLeaveList(c *gin.Context){
	var leavelist entity.LeaveList
	var newleavelist entity.LeaveList1
	var employees entity.Employee
	var ltype entity.LeaveType
	var manager entity.Manager

	if err := c.ShouldBindJSON(&newleavelist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newleavelist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if tx := entity.DB().Where("id = ?", newleavelist.ID).First(&leavelist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Leave not found"})
		return
	}
	// ค้นหา employee ด้วย id
	if newleavelist.EmployeeID != nil {
		if tx := entity.DB().Where("id = ?", newleavelist.EmployeeID).First(&employees); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "employeesss not found"})
			return
		}
		fmt.Print("NOT NULL")
		newleavelist.Employee = employees
	}else {
		if tx := entity.DB().Where("id = ?", newleavelist.EmployeeID).First(&employees); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not found employee"})
			return
		}
		fmt.Print("NULL")
		newleavelist.Employee = employees
	}
	// ค้นหา ltype ด้วย id
	if newleavelist.LeaveTypeID != nil {
		if tx := entity.DB().Where("id = ?", newleavelist.LeaveTypeID).First(&ltype); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "leave type not found"})
			return
		}
		newleavelist.LeaveType = ltype
	}else {
		if tx := entity.DB().Where("id = ?", newleavelist.LeaveTypeID).First(&ltype); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "leave type not found"})
			return
		}
		newleavelist.LeaveType = ltype
	}
	// ค้นหา exercise ด้วย id
	if newleavelist.ManagerID != nil {
		if tx := entity.DB().Where("id = ?", newleavelist.ManagerID).First(&manager); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
			return
		}
		newleavelist.Manager = manager
	} else {
		if tx := entity.DB().Where("id = ?", newleavelist.ManagerID).First(&manager); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
			return
		}
		newleavelist.Manager = manager
	}
	leavelist.Status = newleavelist.Status

	// ขั้นตอนการ validate
	if err := entity.DB().Save(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}
func CountL1(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("SUM(count_l)").Where("employee_id = ?",id).Where("status = 'approved'").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL2(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("SUM(count_l)").Where("employee_id = ?",id).Where("status = 'approved'").Where("leave_type_id = 1").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL3(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("SUM(count_l)").Where("employee_id = ?",id).Where("status = 'approved'").Where("leave_type_id = 2").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL4(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("COUNT(*)").Where("department_id = ?",id).Where("status = 'pending approval'").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}