package controller

import (
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
	// 12: สร้าง leave_list
	l_list := entity.LeaveList{
		Employee:   employees,             // โยงความสัมพันธ์กับ Entity Employee
		LeaveType: l_type,                // โยงความสัมพันธ์กับ Entity Leave type
		StartTime: leavelists.StartTime, // ตั้งค่าฟิลด์ Start_time
		StopTime:  leavelists.StopTime,  // ตั้งค่าฟิลด์ Stop_time
		Manager: manager,
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
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Raw("SELECT * FROM leave_lists WHERE id = ?", id).Find(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}

// LIST /leave_list
func ListLeaveList(c *gin.Context) {
	var leavelists []entity.LeaveList
	
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Raw("SELECT * FROM leave_lists").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByEmpID(c *gin.Context) {
	var leavelists []entity.LeaveList
	emp_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Raw("SELECT * FROM leave_lists WHERE employee_id = ?", emp_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByManID(c *gin.Context) {
	var leavelists []entity.LeaveList
	man_id := c.Param("id")
	if err := entity.DB().Preload("Employee").Preload("Manager").Preload("LeaveType").Raw("SELECT * FROM leave_lists WHERE manager_id = ?", man_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
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
