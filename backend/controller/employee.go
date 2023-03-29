package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
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
	if err := entity.DB().Preload("User").Preload("Manager").Raw("SELECT * FROM employees WHERE id = ?", id).Find(&employee).Error; err != nil {
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
func CreateEmployee(c *gin.Context) {
	//main
	var employee entity.Employee
	//relation
	var user entity.User
	var man entity.Manager

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}

	// Vakidation Value
	if _, err := govalidator.ValidateStruct(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// get user from database
	if tx := entity.DB().Where("id = ?", employee.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user is not found",
		})
		return
	}
	// get manager from database
	if tx := entity.DB().Where("id = ?", employee.ManagerID).First(&man); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "manager is not found",
		})
		return
	}

	emp := entity.Employee{
		FirstName: employee.FirstName,
		LastName:  employee.LastName,
		Email:     employee.Email,
		User:      user,
		Manager:   man,
	}

	// fmt.Println(emp)
	if err := entity.DB().Create(&emp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "Create Employee Success",
		"data":   emp,
	})
}
func GetEmployeeByUserID(c *gin.Context) {
	var employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Manager").Preload("User").Preload("Role").Raw("SELECT * FROM employees WHERE user_id = ?", id).Scan(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": employee})
}