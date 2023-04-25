package entity

import (
	"time"

	"gorm.io/gorm"
)

type SwitchLeave struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	LeaveDay    	time.Time
	FromTime		time.Time
	ToTime			time.Time	
	WorkDay   		time.Time
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