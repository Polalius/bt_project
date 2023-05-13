package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/gin-gonic/gin"
)

func ListManager(c *gin.Context) {
	var managers []entity.Manager
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM managers").Find(&managers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": managers,
	})
}
type User1 struct {
	Name 		string
	Email     		string
	User   			string
	Role			string
	Department		string
}
func GetManager1(c *gin.Context) {
	var manager User1
	id := c.Param("id")
	if err := entity.DB().Table("managers").
	Select("managers.man_name as name, managers.email, users.user_name as user, roles.name as role, departments.dep_name as department").
	Joins("inner join users on users.id = managers.user_id").
	Joins("inner join roles on roles.id = managers.role_id").
	Joins("inner join departments on departments.id = managers.department_id").
	Where("users.id = ?", id).Find(&manager).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": manager})
}
func GetManager(c *gin.Context) {
	var manager entity.Manager
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM managers WHERE id = ?", id).Find(&manager).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": manager,
	})
}

