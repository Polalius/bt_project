package controller

import (
	"net/http"
	"strings"

	"github.com/Polalius/bt_project/entity"
	"github.com/Polalius/bt_project/services"
	"github.com/gin-gonic/gin"
)

type LoginPayload struct {
	User     string `json:"username"`
	Password string `json:"password"`
}

type EmployeeResponse struct {
	Token    string
	UserID   uint   `json:"user_id"`
	EmpID    uint   `json:"p_id"`
	RoleName string `json:"role_name"`
}
type ManagerResponse struct {
	Token    string
	UserID   uint   `json:"user_id"`
	ManID    uint   `json:"p_id"`
	RoleName string `json:"role_name"`
}

// POST /signin
func Signin(c *gin.Context) {
	var payload LoginPayload
	var login entity.User
	var role entity.Role

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ค้นหา login ด้วย Username ที่ผู้ใช้กรอกมา
	if err := entity.DB().Raw("SELECT * FROM users WHERE user_name = ?", payload.User).Scan(&login).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//ตรวจสอบ Password
	err := services.VerifyPassword(login.Password, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user credentials"})
		return
	}

	//ค้นหา Role ด้วย role_id
	if err := entity.DB().Raw("SELECT * FROM roles WHERE id = ?", login.RoleID).Scan(&role).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:      "Secret",
		Issuer:         "AuthService",
		ExpirationHour: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(login.ID, role.Name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
	if role.Name == "employee"{
		var emp entity.Employee
		if tx := entity.DB().
			Raw("SELECT * FROM employees WHERE user_id = ?", login.ID).Find(&emp); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
			return
		}
		tokenResponse := EmployeeResponse{
			Token:    signedToken,
			UserID:   login.ID,
			EmpID: emp.ID,
			RoleName: role.Name,
		}
		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
	}else if role.Name == "manager"{
		var man entity.Manager
		if tx := entity.DB().
			Raw("SELECT * FROM managers WHERE user_id = ?", login.ID).Find(&man); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "managers not found"})
			return
		}
		tokenResponse := ManagerResponse{
			Token:    signedToken,
			UserID:   login.ID,
			ManID: man.ID,
			RoleName: role.Name,
		}
		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
	}else if role.Name == "payroll"{
		var pay entity.Manager
		if tx := entity.DB().
			Raw("SELECT * FROM managers WHERE user_id = ?", login.ID).Find(&pay); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "payroll not found"})
			return
		}
		tokenResponse := ManagerResponse{
			Token:    signedToken,
			UserID:   login.ID,
			ManID: pay.ID,
			RoleName: role.Name,
		}
		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
	}
	
}

// GET /valid
// validation token
func Validation(c *gin.Context) {
	clientToken := c.Request.Header.Get("Authorization")
	if clientToken == "" {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "No Authorization header provided",
		})
		return
	}

	extractedToken := strings.Split(clientToken, "Bearer ")

	if len(extractedToken) == 2 {
		clientToken = strings.TrimSpace(extractedToken[1])
	} else {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Incorrect Format of Authorization Token", "len": extractedToken})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "Secret",
		Issuer:    "AuthService",
	}

	claims, err := jwtWrapper.ValidateToken(clientToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "Valid Ok",
		"data":   claims,
	})
}