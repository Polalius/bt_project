package controller

import (
	"net/http"

	"github.com/Polalius/bt_project/entity"
	
	"github.com/gin-gonic/gin"
)

// GET /department/:id
func GetDepartment(c *gin.Context) {
	var de entity.Department
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM departments WHERE id = ?", id).Scan(&de).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": de})
}

// List /department
func ListDepartment(c *gin.Context) {
	var department []entity.Department
	if err := entity.DB().Raw("SELECT * FROM departments").Scan(&department).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": department})
}

// DELETE /department/:id
func DeleteDepartment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM departments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "department not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
