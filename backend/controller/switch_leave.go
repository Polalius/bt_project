package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /leave_list/:id
func GetSwitchID(c *gin.Context) {
	var leavelist entity.SwitchLeave
	id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("Department").Raw("SELECT * FROM switch_leaves WHERE id = ?", id).Find(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}
// LIST /leave_list
func ListSwitch(c *gin.Context) {
	var leavelists []entity.SwitchLeave
	
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("Department").Raw("SELECT * FROM switch_leaves").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListSwitchByEmpID(c *gin.Context) {
	var leavelists []entity.SwitchLeave
	emp_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("Department").Raw("SELECT * FROM switch_leaves WHERE employee_id = ?", emp_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListSwitchByDepID(c *gin.Context) {
	var leavelists []entity.SwitchLeave
	man_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("Department").Raw("SELECT * FROM switch_leaves WHERE department_id = ?", man_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchByDate(c *gin.Context) {
	var leavelists []entity.SwitchLeave
	man_id := c.Param("id")
	from := c.Query("from")
	to := c.Query("to")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("Department").Where("department_id = ? AND (leave_day BETWEEN ? AND ?)", man_id, from, to).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
type swresults struct{
	ID int
	Id int
	EmpName string
	ManName string
	LeaveDay    time.Time
	ToTime 		time.Time
	WorkDay   time.Time
	DepName		string
	Status string
}
func ListSwitchWait(c *gin.Context){
	var results []swresults
	dep_id := c.Param("id")
	if err := entity.DB().Table("switch_leaves").
	Select("switch_leaves.id, departments.id, employees.emp_name, managers.man_name, switch_leaves.work_day, switch_leaves.to_time, switch_leaves.from_time, switch_leaves.leave_day, switch_leaves.status,departments.dep_name").
	Joins("inner join employees on employees.id = switch_leaves.employee_id").
	Joins("inner join managers on managers.id = switch_leaves.manager_id").
	Joins("inner join departments on departments.id = switch_leaves.department_id").
	Where("departments.id = ? AND switch_leaves.status = 'pending approval'", dep_id).Find(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
// LIST /leave_list status wait
func ListSwitchByDepIDnSNwait(c *gin.Context) {
	var results []swresults
	d_id := c.Param("id")
	if err := entity.DB().Table("switch_leaves").
	Select("switch_leaves.id, departments.id, employees.emp_name, managers.man_name, switch_leaves.work_day, switch_leaves.to_time, switch_leaves.from_time, switch_leaves.leave_day, switch_leaves.status,departments.dep_name").
	Joins("inner join employees on employees.id = switch_leaves.employee_id").
	Joins("inner join managers on managers.id = switch_leaves.manager_id").
	Joins("inner join departments on departments.id = switch_leaves.department_id").
	Where("departments.id = ? and switch_leaves.status != 'pending approval'", d_id).Scan(&results).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": results})
}
func CreateSwitchLeave(c *gin.Context){
	var employees entity.Employee
	var switchleaves entity.SwitchLeave
	var manager entity.Manager
	var depart entity.Department

	// ผลลัพธ์ที่ได้จากขั้นตอนที่  จะถูก bind เข้าตัวแปร leavelists
	if err := c.ShouldBindJSON(&switchleaves); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", switchleaves.EmployeeID).First(&employees); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
		return
	}
	// ค้นหา leave type ด้วย id
	if tx := entity.DB().Where("id = ?", switchleaves.ManagerID).First(&manager); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", switchleaves.DepartmentID).First(&depart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}
	// if tx := entity.DB().Where("employee_id = ? AND ((start_time BETWEEN ? AND ?) OR (stop_time BETWEEN ? AND ?))", leavelists.EmployeeID, leavelists.StartTime.Local(), leavelists.StopTime.Local().Add(10 *time.Minute), leavelists.StartTime.Local(), leavelists.StopTime.Local().Add(10 *time.Minute)).First(&leavelists); tx.RowsAffected != 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว1"})
	// 	return
	// }
	
	// 12: สร้าง swith_leave
	sw_l := entity.SwitchLeave{
		Employee:   employees,             // โยงความสัมพันธ์กับ Entity Employee
		LeaveDay:  switchleaves.LeaveDay.Local(), // ตั้งค่าฟิลด์ Start_time
		FromTime: switchleaves.FromTime.Local(),
		ToTime: switchleaves.ToTime.Local(),
		WorkDay: switchleaves.WorkDay.Local(),  // ตั้งค่าฟิลด์ Stop_time
		Manager: manager,
		Department: depart,
		Status:     switchleaves.Status,     // ตั้งค่าฟิลด์ Status
	}
	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(sw_l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&sw_l).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sw_l})
}
func UpdateSwitch(c *gin.Context){
	var switchs entity.SwitchLeave
	var newswitch entity.SwitchLeave1
	var employees entity.Employee
	var manager entity.Manager

	if err := c.ShouldBindJSON(&newswitch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(&newswitch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if tx := entity.DB().Where("id = ?", newswitch.ID).First(&switchs); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Switch Leave not found"})
		return
	}
	// ค้นหา employee ด้วย id
	if newswitch.EmployeeID != nil {
		if tx := entity.DB().Where("id = ?", newswitch.EmployeeID).First(&employees); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "employeesss not found"})
			return
		}
		fmt.Print("NOT NULL")
		newswitch.Employee = employees
	}else {
		if tx := entity.DB().Where("id = ?", newswitch.EmployeeID).First(&employees); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not found employee"})
			return
		}
		fmt.Print("NULL")
		newswitch.Employee = employees
	}
	// ค้นหา exercise ด้วย id
	if newswitch.ManagerID != nil {
		if tx := entity.DB().Where("id = ?", newswitch.ManagerID).First(&manager); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
			return
		}
		newswitch.Manager = manager
	} else {
		if tx := entity.DB().Where("id = ?", newswitch.ManagerID).First(&manager); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "manager not found"})
			return
		}
		newswitch.Manager = manager
	}
	switchs.Status = newswitch.Status

	// ขั้นตอนการ validate
	if err := entity.DB().Save(&switchs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": switchs})
}