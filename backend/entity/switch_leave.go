package entity

import (
	"time"

	"gorm.io/gorm"
)

type SwitchLeave struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	WorkTime   	time.Time	
	LeaveTime    	time.Time	
	ManagerID		*uint
	Manager			Manager		`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department	`gorm:"references:id" valid:"-"`
	Status       	string
}