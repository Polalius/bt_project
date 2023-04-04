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
	StartTime   	time.Time	`valid:"required~กรุณากรอกวันที่และเวลา, Current~ไม่สามารถลาย้อนหลัง"`
	StopTime    	time.Time	`valid:"required~กรุณากรอกวันที่และเวลา, Current~ไม่สามารถลาย้อนหลัง"`
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