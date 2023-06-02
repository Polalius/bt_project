package entity

import (

	"gorm.io/gorm"
)

type SwitchLeave struct {
	ID				uint
	UserSerial  	uint
	DepID       	uint
	LeaveDay    	string		`valid:"required~กรุณาเลือกวันที่สลับวันลา"`
	FromTime		int			`valid:"required~กรุณาเลือกเวลา"`
	ToTime			int			`valid:"required~กรุณาเลือกเวลา"`
	Count			int
	WorkDay   		string		`valid:"required~กรุณาเลือกวันทำงาน"`
	Status       	string
}
type SwitchLeaves struct {
	ID				uint
	UserSerial  	uint
	UserLname		string
	DepID       	uint
	DepName			string
	LeaveDay    	string		`valid:"required~กรุณาเลือกวันที่สลับวันลา"`
	FromTime		int			`valid:"required~กรุณาเลือกเวลา"`
	ToTime			int			`valid:"required~กรุณาเลือกเวลา"`
	Count			int
	WorkDay   		string		`valid:"required~กรุณาเลือกวันทำงาน"`
	Status       	string
}
type SwitchLeave1 struct {
	gorm.Model
	UserID   		*uint
	DepartmentName 	*string
	User    		User	`gorm:"references:id" valid:"-"`
	
	Status       	string
}