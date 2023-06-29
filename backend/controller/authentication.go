package controller

import (
	"crypto/tls"
	"log"
	"net/http"
	"net/smtp"

	"strings"

	"github.com/Polalius/bt_project/entity"
	"github.com/Polalius/bt_project/services"
	"github.com/gin-gonic/gin"
)

type LoginPayload struct {
	User     string `json:"username"`
	Password string `json:"userpass"`
}

type UserResponse struct {
	Token    	string	`json:"token"`
	UserPass	string  `json:"user_pass"`
	UserSerial  uint   	`json:"user_serial"`
	DepID 		uint 	`json:"dep_id"`
	Position 	int 	`json:"user_position"`
}
// POST /signin
func Signin(c *gin.Context) {
	var payload LoginPayload
	var login entity.UserAuthen
	var dep		entity.Department

	pay1 := entity.UserAuthen{
	UserSerial: 0,
	UserName: "Payroll1",
	UserPass: "123456",
	UserPosition: 2,
	DepID: 2,
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if (payload.User == pay1.UserName){
		err := services.VerifyPassword(pay1.UserPass, payload.Password)
		if err == false {	
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user credentials"})
			return
		}
		login = pay1
	}else{
	//ค้นหา login ด้วย Username ที่ผู้ใช้กรอกมา
		if err := entity.DB().Raw("SELECT * FROM bt_userauthen WHERE user_name = ?", payload.User).Scan(&login).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "err.Error()"})
			return
		}
		
		//ตรวจสอบ Password
		err := services.VerifyPassword(login.UserPass, payload.Password)
		if err == false {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user credentials"})
			return
		}
	}

	
	//ค้นหา Department ด้วย did
	if err := entity.DB().Raw("SELECT * FROM bt_department WHERE dep_id = ?", login.DepID).Scan(&dep).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	jwtWrapper := services.JwtWrapper{
		SecretKey:      "Secret",
		Issuer:         "AuthService",
		ExpirationHour: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(login.UserSerial, login.UserPosition)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
		tokenResponse := UserResponse{
			Token:    signedToken,
			UserSerial:  login.UserSerial,
			UserPass: login.UserPass,
			DepID: dep.DepID,
			Position: login.UserPosition,
		}
		c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
	
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
type EmailData struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Manemail string `json:"manemail"`
}
func SendEmailHandler(c *gin.Context) {
	var data EmailData
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Manemail}

	// Email content
	subject := "คำร้องขอลา" 
	body := "เรียน    ผจก.ฝ่าย/แผนก  ข้าพเจ้าได้ส่งคำร้องขอลาในระบบลางานแล้ว http://localhost:3000  จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ."

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		
		ServerName:         smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}
	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
func SendEmailHandler2(c *gin.Context) {
	var data EmailData
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Manemail}

	// Email content
	subject := "คำร้องขอสสับวันลา" 
	body := "เรียน    ผจก.ฝ่าย/แผนก  ข้าพเจ้าได้ส่งคำร้องขอสลับวันลาในระบบลางานแล้ว http://localhost:3000  จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ."

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		
		ServerName:         smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}
	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
type EmailData2 struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Empemail string `json:"empemail"`
}
func SendEmailHandler3(c *gin.Context) {
	var data EmailData2
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "ผลพิจารณาอนุมัติการลา" 
	body := "เรียน    พนักงาน  ข้าพเจ้าได้ส่งผลอนุมัติการลาในระบบลางานแล้ว http://localhost:3000  จึงเรียนมาเพื่อทราบ."

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		
		ServerName:         smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}
	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
func SendEmailHandler4(c *gin.Context) {
	var data EmailData2
	err := c.BindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// SMTP server information
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	username := data.Email
	password := data.Password

	// Recipient information
	to := []string{data.Empemail}

	// Email content
	subject := "ผลพิจารณาอนุมัติสลับวันลา" 
	body := "เรียน    พนักงาน  ข้าพเจ้าได้ส่งผลอนุมัติสลับวันลาในระบบลางานแล้ว http://localhost:3000  จึงเรียนมาเพื่อทราบ."

	// Construct email message
	message := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// TLS configuration
	tlsConfig := &tls.Config{
		
		ServerName:         smtpHost,
	}

	// Connect to the SMTP server
	auth := smtp.PlainAuth("", username, password, smtpHost)
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Println("Failed to connect to the SMTP server:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the SMTP server"})
		return
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Println("Failed to create SMTP client:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create SMTP client"})
		return
	}

	// Start the communication
	err = client.Auth(auth)
	if err != nil {
		log.Println("Failed to authenticate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	err = client.Mail(username)
	if err != nil {
		log.Println("Failed to set sender:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set sender"})
		return
	}

	for _, recipient := range to {
		err = client.Rcpt(recipient)
		if err != nil {
			log.Println("Failed to add recipient:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add recipient"})
			return
		}
	}

	w, err := client.Data()
	if err != nil {
		log.Println("Failed to open data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open data connection"})
		return
	}

	_, err = w.Write(message)
	if err != nil {
		log.Println("Failed to write message:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write message"})
		return
	}

	err = w.Close()
	if err != nil {
		log.Println("Failed to close data connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close data connection"})
		return
	}

	err = client.Quit()
	if err != nil {
		log.Println("Failed to quit connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to quit connection"})
		return
	}
	log.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

