package entity

import (

	"gorm.io/gorm"
)

type SwitchLeave struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	LeaveDay    	string		`valid:"required~กรุณาเลือกวันที่สลับวันลา"`
	FromTime		int			`valid:"required~กรุณาเลือกเวลา"`
	ToTime			int			`valid:"required~กรุณาเลือกเวลา"`
	WorkDay   		string		`valid:"required~กรุณาเลือกวันทำงาน"`
	ManagerID		*uint
	Manager			Manager		`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department	`gorm:"references:id" valid:"-"`
	Status       	string
}
type SwitchLeave1 struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	ManagerID		*uint
	Manager			Manager		`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department	`gorm:"references:id" valid:"-"`
	Status       	string
}