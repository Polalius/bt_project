package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)
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
		WorkTime: switchleaves.WorkTime.Local(), // ตั้งค่าฟิลด์ Start_time
		LeaveTime:  switchleaves.LeaveTime.Local(),  // ตั้งค่าฟิลด์ Stop_time
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