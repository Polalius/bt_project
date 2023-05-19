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
	r.GET("/user/:id", controller.GetUser)


	r.GET("/employeeId/:id", controller.GetEmployeeByUserID)
	r.GET("/employees", controller.ListEmployee)
	r.GET("/employeeID/:id", controller.GetEmployee)
	r.GET("/employee1/:id", controller.GetEmployee1)


	r.GET("/leavelists", controller.ListLeaveList)
	r.GET("/leave", controller.ListLeave)
	r.GET("/leave_eid/:id", controller.ListLeaveEID)
	r.GET("/leavestatus", controller.ListLeaveStatus)
	r.GET("/leavedate/start&stop", controller.ListLeaveStatusDate)
	r.GET("/leavewait/:id", controller.ListLeaveWait)
	r.GET("/leavelist/:id", controller.GetLeaveList)
	r.GET("/leavelistempid/:id", controller.ListLeaveListByEmpID)
	r.GET("/leavelist_depid/:id", controller.ListLeaveListByDepID)
	r.GET("/leavelist_depwait/:id", controller.ListLeaveListByDepIDnSwait)
	r.GET("/leavelist_depnwait/:id", controller.ListLeaveListByDepIDnSNwait)
	r.PATCH("/leavelists", controller.UpdateLeaveList)
	r.GET("/count_l/:id", controller.CountL)

	r.GET("/switch/:id", controller.GetSwitchID)
	r.GET("/switchs", controller.ListSwitch)//
	r.GET("/switch_eid/:id", controller.ListSwitchEID)
	r.GET("/switch_id/:id", controller.ListSwitchByEmpID)//
	r.GET("/switch_depid/:id", controller.ListSwitchByDepID)
	r.GET("/switch_wait/:id", controller.ListSwitchWait)
	r.GET("/switch_depnwaitid/:id", controller.ListSwitchByDepIDnSNwait)
	r.POST("/switch_leaves", controller.CreateSwitchLeave)//
	r.PATCH("/switch_leaves", controller.UpdateSwitch)
	r.GET("/countsw/:id", controller.CountSW)

	r.GET("/leavetypes", controller.ListLeaveType)
	
	r.GET("/department/:id", controller.GetDepartment)

	r.GET("/manager/:id", controller.GetManager)
	r.GET("/manager1/:id", controller.GetManager1)


	r.POST("/leavelists", controller.CreateLeaveList)
	r.POST("/signin", controller.Signin)
	r.GET("/valid", controller.Validation)
	r.POST("/mail", controller.SendEmailHandler)
	r.POST("/mail2", controller.SendEmailHandler2)
	r.Run()
}
