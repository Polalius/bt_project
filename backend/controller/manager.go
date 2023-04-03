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

