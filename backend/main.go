package main

import (
	"os"

	"github.com/Polalius/bt_project/controller"
	"github.com/Polalius/bt_project/entity"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
func main() {
	os.Remove("./LeaveList.db")
	entity.SutupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/users", controller.ListUser)


	r.GET("/employeeId/:id", controller.GetEmployeeByUserID)
	r.GET("/employees", controller.ListEmployee)
	r.GET("/employeeID/:id", controller.GetEmployee)


	r.GET("/leavelists", controller.ListLeaveList)
	r.GET("/leavelist/:id", controller.GetLeaveList)
	r.GET("/leavelistempid/:id", controller.ListLeaveListByEmpID)
	r.GET("/leavelistmanid/:id", controller.ListLeaveListByManID)
	r.GET("/leavelistmanwait/:id", controller.ListLeaveListByManIDnSwait)
	r.GET("/leavelistmannwait/:id", controller.ListLeaveListByManIDnSNwait)
	r.PATCH("/leavelists", controller.UpdateLeaveList)
	r.GET("/leavetypes", controller.ListLeaveType)
	

	r.GET("/manager/:id", controller.GetManager)

	r.POST("/leavelists", controller.CreateLeaveList)
	r.POST("/signin", controller.Signin)
	r.GET("/valid", controller.Validation)
	r.Run()
}
