package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/gin-gonic/gin"
)

func ListEmployee(c *gin.Context) {
	var employees []entity.Employee
	if err := entity.DB().Preload("User").Preload("Manager").Raw("SELECT * FROM employees").Find(&employees).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": employees,
	})
}
func GetEmployee(c *gin.Context) {
	var employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM employees WHERE id = ?", id).Find(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": employee,
	})
}
func GetEmployeeByUserID(c *gin.Context) {
	var employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Department").Preload("User").Preload("Role").Raw("SELECT * FROM employees WHERE user_id = ?", id).Scan(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee})
}

func GetEmployee1(c *gin.Context) {
	var employee User1
	id := c.Param("id")
	if err := entity.DB().Table("employees").
	Select("employees.emp_name as name, employees.email, users.user_name as user, roles.name as role, departments.dep_name as department").
	Joins("inner join users on users.id = employees.user_id").
	Joins("inner join roles on roles.id = employees.role_id").
	Joins("inner join departments on departments.id = employees.department_id").
	Where("users.id = ?", id).Find(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee})
}