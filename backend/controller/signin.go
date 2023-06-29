package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/gin-gonic/gin"
)

//-----------Part Signin -----------

// Get /users
// List All User
func ListUser(c *gin.Context) {
	var users []entity.UserAuthen
	if err := entity.DB().Raw("SELECT * FROM bt_userauthen").Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   users,
	})
}
type userres struct{
	UserSerial	uint
	UserName	string
	UserLname	string
	DepName		string
	DepMail		string
	ManagerMail	string
}
// Get /user/:id
// Get user
func GetUser(c *gin.Context) {
	var user userres
	id := c.Param("id")
	if err := entity.DB().Table("bt_userauthen").
	Select("bt_userauthen.user_serial, bt_userauthen.user_name, dt_user.user_lname, bt_department.dep_name, bt_department.dep_mail, bt_department.manager_mail").
	Joins("inner join dt_user on dt_user.user_serial = bt_userauthen.user_serial").
	Joins("inner join bt_department on bt_department.dep_id = bt_userauthen.dep_id").
	Where("bt_userauthen.user_serial = ?", id).
	Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   user,
	})
}
