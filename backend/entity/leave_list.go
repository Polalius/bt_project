package entity

import (
	"time"

	"gorm.io/gorm"
)

type LeaveType struct {
	gorm.Model
	TypeName   string
	Information string

	LeaveList []LeaveList `gorm:"foreignKey:LeaveTypeID"`
}
type LeaveList struct {
	gorm.Model
	EmployeeID   *uint
	Employee     Employee
	LeaveTypeID *uint
	LeaveType   LeaveType
	StartTime   time.Time
	StopTime    time.Time
	ManagerID	*uint
	Manager		Manager
	Status       string
}
