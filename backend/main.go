package main

import (

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
	
	entity.SutupDatabase()
	
	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/users", controller.ListUser)
	r.GET("/user/:id", controller.GetUser)

	r.GET("/leave", controller.ListLeaveList)
	r.GET("/leave_pay", controller.ListLeaveListP)
	
	r.GET("/leavelist/:id", controller.GetLeaveList)
	r.GET("/leave_eid/:id", controller.ListLeaveListByUserID1)
	r.GET("/leave_depwait/:id", controller.ListLeaveListByDepWait)
	r.GET("/leavelist_uid/:id", controller.ListLeaveListByUserID)
	r.GET("/leavelist_depid/:id", controller.ListLeaveListByDepName)
	r.GET("/leavelist_depwait/:id", controller.ListLeaveListByDepIDnSwait)
	r.GET("/leavelist_depnwait/:id", controller.ListLeaveListByDepIDnSNwait)
	
	r.PATCH("/leavelists", controller.UpdateLeaveList)
	r.GET("/count_l1/:id", controller.CountL1)
	r.GET("/count_l2/:id", controller.CountL2)
	r.GET("/count_l3/:id", controller.CountL3)
	r.GET("/count_l4/:id", controller.CountL4)

	r.GET("/switch/:id", controller.GetSwitchID)
	r.GET("/switchs", controller.ListSwitch)//
	r.GET("/switch_pay", controller.ListSwitchP)//
	r.GET("/switch_id/:id", controller.ListSwitchByEmpID)//
	r.GET("/switch_wait/:id", controller.ListSwitchWait)//
	r.GET("/switch_nwait/:id", controller.ListSwitchNWait)//
	r.GET("/switch_id1/:id", controller.ListSwitchByEmpID1)//
	r.GET("/switch_depid/:id", controller.ListSwitchByDepID)

	r.POST("/switch_leaves", controller.CreateSwitchLeave)//
	r.PATCH("/switch_leaves", controller.UpdateSwitch)
	r.GET("/countsw/:id", controller.CountSW)
	r.GET("/countsw2/:id", controller.CountSW2)
	r.POST("/leavelists", controller.CreateLeaveList)
	r.POST("/signin", controller.Signin)
	r.GET("/valid", controller.Validation)
	r.POST("/mail", controller.SendEmailHandler)
	r.POST("/mail2", controller.SendEmailHandler2)
	r.Run()
}
