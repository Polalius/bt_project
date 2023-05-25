package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type LeaveType struct {
	gorm.Model
	TypeName   		string
	Information 	string

	LeaveList 		[]LeaveList `gorm:"foreignKey:LeaveTypeID"`
}
type LeaveList struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	LeaveTypeID 	*uint
	LeaveType   	LeaveType	`gorm:"references:id" valid:"-"`
	StartDate   	string		`valid:"required~กรุณากรอกวันที่และเวลา"`
	StartTime   	int	
	StopDate    	string		`valid:"required~กรุณากรอกวันที่และเวลา"`
	StopTime    	int
	CountL			int	
	ManagerID		*uint
	Manager			Manager		`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department	`gorm:"references:id" valid:"-"`
	Status       	string
}
type LeaveList1 struct {
	gorm.Model
	EmployeeID   	*uint
	Employee     	Employee	`gorm:"references:id" valid:"-"`
	LeaveTypeID 	*uint
	LeaveType   	LeaveType	`gorm:"references:id" valid:"-"`
	ManagerID		*uint
	Manager			Manager		`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department	`gorm:"references:id" valid:"-"`
	Status       	string
}
func init() {
	
	govalidator.CustomTypeTagMap.Set("Current", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})
}