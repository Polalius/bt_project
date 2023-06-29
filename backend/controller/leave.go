package controller

import (
	
	"net/http"
	

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /program
func CreateLeaveList(c *gin.Context) {

	var user entity.UserAuthen
	var leavelists entity.LeaveList
	var depart entity.Department
	var typ entity.LeaveType

	// ผลลัพธ์ที่ได้จากขั้นตอนที่  จะถูก bind เข้าตัวแปร leavelists
	if err := c.ShouldBindJSON(&leavelists); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา user ด้วย id
	if tx := entity.DB().Table("bt_userauthen").Select("*").Where("user_serial = ?", leavelists.UserSerial).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	if tx := entity.DB().Table("kt_qingj").Where("bh = ?", leavelists.Bh).First(&typ); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "leave type not found"})
		return
	}
	//ค้นหา แผนก ด้วย id
	if tx := entity.DB().Table("bt_department").Where("dep_id = ?", leavelists.DepID).First(&depart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}
	//เช็ค ลาซ้ำ
	if leavelists.StartDate == leavelists.StopDate {
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (start_date = ?) AND (start_date = stop_date) AND ( ? BETWEEN start_time AND stop_time)", leavelists.UserSerial, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (start_date = ?) AND (start_date = stop_date) AND ( ? BETWEEN start_time AND stop_time)", leavelists.UserSerial, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (stop_date = ?) AND (start_date != stop_date) AND ( ? BETWEEN 480 AND stop_time)", leavelists.UserSerial, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (start_date = ?) AND (start_date != stop_date) AND (? BETWEEN start_time and 1020)", leavelists.UserSerial, leavelists.StartDate, leavelists.StopTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if leavelists.StopTime <= leavelists.StartTime {
			c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบเวลาผิด"})
			return
		}
	}
	if leavelists.StartDate != leavelists.StopDate {
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (start_date = ?) AND (start_date != stop_date) AND (? BETWEEN start_time and 1020)", leavelists.UserSerial, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (start_date = ?) AND (start_date != stop_date) AND (stop_date = ?) AND (? BETWEEN 480 and stop_time)", leavelists.UserSerial, leavelists.StartDate, leavelists.StopDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
		if tx := entity.DB().Table("bt_leave_lists").Where("user_serial = ? AND (stop_date = ?) AND (start_date != stop_date) AND (? BETWEEN 480 AND stop_time)", leavelists.UserSerial, leavelists.StartDate, leavelists.StartTime).First(&leavelists); tx.RowsAffected != 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "มีการลาเวลานี้ไปแล้ว"})
			return
		}
	}
	// 12: สร้าง leave_list
	l_list := entity.LeaveList{
		UserSerial: user.UserSerial,             // โยงความสัมพันธ์กับ Entity User
		Bh: leavelists.Bh,					// โยงความสัมพันธ์กับ Entity Leave type
		StartDate: leavelists.StartDate,                
		StartTime: leavelists.StartTime, // ตั้งค่าฟิลด์ Start_time
		StopDate: leavelists.StopDate,
		StopTime:  leavelists.StopTime,  // ตั้งค่าฟิลด์ Stop_time
		CountL: leavelists.CountL,
		DepID: depart.DepID,
		Status:     leavelists.Status,     // ตั้งค่าฟิลด์ Status
	}
	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(l_list); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Table("bt_leave_lists").Create(&l_list).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": l_list})
}

// GET /leave_list/:id
func GetLeaveList(c *gin.Context) {
	var leavelist entity.LeaveList
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bt_leave_lists WHERE id = ?", id).Find(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}

// LIST /leave_list
func ListLeaveList(c *gin.Context) {
	var leavelists []entity.LeaveLists
	
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListP(c *gin.Context) {
	var leavelists []entity.LeaveLists
	
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.status = 'approved'").
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListLeaveListP1(c *gin.Context) {
	var leavelists []entity.LeaveLists
	
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.status = 'approved' ORDER BY bt_leave_lists.id DESC LIMIT 5").
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByUserID(c *gin.Context) {
	var leavelists []entity.LeaveLists
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.user_serial = ?", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListLeaveListByUserID1(c *gin.Context) {
	var leavelists []entity.LeaveLists
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.user_serial = ? ORDER BY bt_leave_lists.id DESC LIMIT 3", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListLeaveListByDepWait(c *gin.Context) {
	var leavelists []entity.LeaveLists
	u_id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.dep_id = ? AND bt_leave_lists.status = 'pending approval'", u_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list
func ListLeaveListByDepName(c *gin.Context) {
	var leavelists []entity.LeaveList
	d_id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bt_leave_lists WHERE department_name = ?", d_id).Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// LIST /leave_list status wait
func ListLeaveListByDepIDnSwait(c *gin.Context) {
	var leavelists []entity.LeaveList
	d_id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.dep_id = ? AND bt_leave_lists.status = 'approved'", d_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
func ListLeaveListByDepIDnSNwait(c *gin.Context) {
	var leavelists []entity.LeaveLists
	d_id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("bt_leave_lists.*, dt_user.*, bt_department.*, kt_qingj.*").
	Joins("inner join bt_department on bt_department.dep_id = bt_leave_lists.dep_id").
	Joins("inner join kt_qingj on kt_qingj.bh = bt_leave_lists.bh").
	Joins("inner join dt_user on dt_user.user_serial = bt_leave_lists.user_serial").
	Where("bt_leave_lists.dep_id = ? AND bt_leave_lists.status = 'approved'", d_id).
	Find(&leavelists).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelists})
}
// DELETE /leave_list/:id
func DeleteLeaveListByID(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Table("bt_leave_lists").Exec("DELETE FROM bt_leave_lists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "list not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateLeaveList(c *gin.Context){
	var leavelist entity.LeaveList
	var newleavelist entity.LeaveList1
	
	

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
	if tx := entity.DB().Table("bt_leave_lists").Where("id = ?", newleavelist.ID).First(&leavelist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Leave not found"})
		return
	}
	// ค้นหา employee ด้วย id
	
	// ค้นหา ltype ด้วย id
	
	leavelist.Status = newleavelist.Status

	// ขั้นตอนการ validate
	if err := entity.DB().Table("bt_leave_lists").Save(&leavelist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": leavelist})
}
func CountL1(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").Where("status = 'approved'").
	Select("SUM(count_l)").Where("user_serial = ?",id).
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL2(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("SUM(count_l)").Where("user_serial = ?",id).Where("status = 'approved'").Where("bh = 1").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL3(c *gin.Context) {
	var count int

	id := c.Param("id")
	if err := entity.DB().Table("bt_leave_lists").
	Select("SUM(count_l)").Where("user_serial = ?",id).Where("status = 'approved'").Where("bh = 2").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func CountL4(c *gin.Context) {
	var count int

	id := c.Param("id")
	
	if err := entity.DB().Table("bt_leave_lists").
	Select("COUNT(*)").Where("dep_id = ?",id).Where("status = 'pending approval'").
	Scan(&count).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": count})
}
func GetLeaveType(c *gin.Context) {
	var l_type entity.LeaveType
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM kt_qingj WHERE bh = ?", id).Scan(&l_type).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": l_type})
}

// List /leave_type
func ListLeaveType(c *gin.Context) {
	var l_types []entity.LeaveType
	if err := entity.DB().Raw("SELECT * FROM kt_qingj").Scan(&l_types).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": l_types})
}
// List /leave_type
func ListDepartment(c *gin.Context) {
	var dep []entity.Department
	if err := entity.DB().Raw("SELECT * FROM bt_department").Scan(&dep).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dep})
}