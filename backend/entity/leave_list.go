package entity

import (
	"time"

	"gorm.io/gorm"
)

type LeaveType struct {
	gorm.Model
	NameType   string
	Information string

	LeaveList []LeaveList `gorm:"foreignKey:Leave_TypeID"`
}
type LeaveList struct {
	gorm.Model
	EmployeeID   *uint
	Employee     Employee
	LeaveTypeID *uint
	LeaveType   LeaveType
	StartTime   time.Time
	StopTime    time.Time
	Status       string
}
