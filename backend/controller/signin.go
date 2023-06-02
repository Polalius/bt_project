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
	if err := entity.DB().Raw("SELECT * FROM user_authens").Scan(&users).Error; err != nil {
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
	if err := entity.DB().Table("user_authens").
	Select("user_authens.user_serial, user_authens.user_name, users.user_lname, departments.dep_name, departments.dep_mail, departments.manager_mail").
	Joins("inner join users on users.user_serial = user_authens.user_serial").
	Joins("inner join departments on departments.dep_id = user_authens.dep_id").
	Where("user_authens.user_serial = ?", id).
	Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"data":   user,
	})
}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.UserAuthen
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if tx := entity.DB().Where("id = ?", user.UserSerial).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "Update Success",
		"data":   user,
	})
}

// DELETE /users/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM users WHETE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
