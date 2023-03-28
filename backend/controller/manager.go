package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

func ListManager(c *gin.Context) {
	var managers []entity.Manager
	if err := entity.DB().Preload("User").Raw("SELECT * FROM managers").Find(&managers).Error; err != nil {
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
func GetManager(c *gin.Context) {
	var manager entity.Manager
	id := c.Param("id")
	if err := entity.DB().Preload("User").Raw("SELECT * FROM managers WHERE id = ?", id).Find(&manager).Error; err != nil {
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
func CreateManager(c *gin.Context) {
	//main
	var manager entity.Manager
	//relation
	var user entity.User

	if err := c.ShouldBindJSON(&manager); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		c.Abort()
		return
	}

	// Vakidation Value
	if _, err := govalidator.ValidateStruct(&manager); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// get user from database
	if tx := entity.DB().Where("id = ?", manager.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user is not found",
		})
		return
	}
	man := entity.Manager{
		FirstName: manager.FirstName,
		LastName:  manager.LastName,
		Email:     manager.Email,
		User:      user,
	}

	// fmt.Println(man)
	if err := entity.DB().Create(&man).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "Create Manager Success",
		"data":   man,
	})
}
