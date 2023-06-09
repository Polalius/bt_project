package controller

import (
	
	"net/http"
	

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /leave_list/:id
func GetSwitchID(c *gin.Context) {
	var leavelist entity.SwitchLeave
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bt_switch_leaves WHERE id = ?", id).Find(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}
// LIST /leave_list
func ListSwitch(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchP(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.status = 'approved'").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchP1(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.status = 'approved' ORDER BY bt_switch_leaves.id DESC LIMIT 5").Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListSwitchByEmpID(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.user_serial = ?", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchByEmpID1(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.user_serial = ? ORDER BY bt_switch_leaves.id DESC LIMIT 3", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchWait(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.dep_id = ? AND bt_switch_leaves.status = 'pending approval'", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListSwitchNWait(c *gin.Context) {
	var leavelists []entity.SwitchLeaves
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_switch_leaves").
	Select("bt_switch_leaves.*, dt_user.*, bt_department.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_switch_leaves.dep_id").
	Joins("inner join dt_user on dt_user.user_serial = bt_switch_leaves.user_serial").
	Where("bt_switch_leaves.dep_id = ? AND bt_switch_leaves.status = 'approved'", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListSwitchByDepID(c *gin.Context) {
	var leavelists []entity.SwitchLeave
	man_id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bt_switch_leaves WHERE department_name = ?", man_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}

func CreateSwitchLeave(c *gin.Context){
	var employees entity.UserAuthen
	var switchleaves entity.SwitchLeave
	var depart entity.Department
	// ผลลัพธ์ที่ได้จากขั้นตอนที่  จะถูก bind เข้าตัวแปร leavelists
	if err := c.ShouldBindJSON(&switchleaves); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา employee ด้วย id
	if tx := entity.DB().Table("bt_userauthen").Where("user_serial = ?", switchleaves.UserSerial).First(&employees); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
		return
	}
	if tx := entity.DB().Table("bt_department").Where("dep_id = ?", switchleaves.DepID).First(&depart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}

	if tx := entity.DB().Table("bt_switch_leaves").Where("user_serial = ? AND (leave_day = ?) AND ((from_time BETWEEN ? AND ?) OR (to_time BETWEEN ? AND ?))", switchleaves.UserSerial, switchleaves.LeaveDay, switchleaves.FromTime, switchleaves.ToTime, switchleaves.FromTime, switchleaves.ToTime).First(&switchleaves); tx.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
		return
	}
	
	// 12: สร้าง swith_leave
	sw_l := entity.SwitchLeave{
		UserSerial:   employees.UserSerial,             // โยงความสัมพันธ์กับ Entity Employee
		LeaveDay:  switchleaves.LeaveDay, // ตั้งค่าฟิลด์ Start_time
		FromTime: switchleaves.FromTime,
		ToTime: switchleaves.ToTime,
		Count: switchleaves.Count,
		WorkDay: switchleaves.WorkDay,  // ตั้งค่าฟิลด์ Stop_time
		DepID: depart.DepID,
		Status:     switchleaves.Status,     // ตั้งค่าฟิลด์ Status
	}
	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(sw_l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Table("bt_switch_leaves").Create(&sw_l).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sw_l})
}
func UpdateSwitch(c *gin.Context){
	var switchs entity.SwitchLeave
	var newswitch entity.SwitchLeave1
	

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
	if tx := entity.DB().Table("bt_switch_leaves").Where("id = ?", newswitch.ID).First(&switchs); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Switch Leave not found"})
		return
	}
	// ค้นหา employee ด้วย id
	switchs.Status = newswitch.Status

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_switch_leaves").Save(&switchs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": switchs})
}
func CountSW(c *gin.Context) {
	var count int

	id := c.Param("id")
	
	if err := entity.DB().Table("bt_switch_leaves").
	Select("COUNT(*)").Where("user_serial = ?",id).Where("status = 'approved'").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountSW2(c *gin.Context) {
	var count int

	id := c.Param("id")
	
	if err := entity.DB().Table("bt_switch_leaves").
	Select("COUNT(*)").Where("dep_id = ?",id).Where("status = 'pending approval'").

	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
