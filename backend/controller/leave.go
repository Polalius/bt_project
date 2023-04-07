package controller

import (
	"fmt"
	"net/http"
	"time"

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
		c.JSON(http.StatusBadRequest, gin.H{"error": "leave type not found"})
		return
	}
	// ค้นหา leave type ด้วย id
	if tx := entity.DB().Where("id = ?", leavelists.ManagerID).First(&manager); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", leavelists.DepartmentID).First(&depart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}
	// 12: สร้าง leave_list
	l_list := entity.LeaveList{
		Employee:   employees,             // โยงความสัมพันธ์กับ Entity Employee
		LeaveType: l_type,                // โยงความสัมพันธ์กับ Entity Leave type
		StartTime: leavelists.StartTime.Local(), // ตั้งค่าฟิลด์ Start_time
		StopTime:  leavelists.StopTime.Local(),  // ตั้งค่าฟิลด์ Stop_time
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
	Id int
	TypeName string
	EmpName string
	ManName string
	StartTime   time.Time
	StopTime    time.Time
	DepName		string
	Status string
}
func ListLeave(c *gin.Context){
	var results []results
	
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_time, leave_lists.stop_time, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func ListLeaveWait(c *gin.Context){
	var results []results
	dep_id := c.Param("id")
	if err := entity.DB().Table("leave_lists").
	Select("leave_lists.id, departments.id, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_time, leave_lists.stop_time, leave_lists.status,departments.dep_name").
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
	Select("leave_lists.id, departments.id, leave_types.type_name, employees.emp_name, managers.man_name, leave_lists.start_time, leave_lists.stop_time, leave_lists.status,departments.dep_name").
	Joins("inner join leave_types on leave_types.id = leave_lists.leave_type_id").
	Joins("inner join employees on employees.id = leave_lists.employee_id").
	Joins("inner join managers on managers.id = leave_lists.manager_id").
	Joins("inner join departments on departments.id = leave_lists.department_id").
	Where("departments.id = ? and leave_lists.status != 'pending approval'", d_id).Scan(&results).Error; err != nil {
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