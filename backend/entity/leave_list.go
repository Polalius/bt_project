package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	
)


type LeaveList struct {
	ID          uint `gorm:"primaryKey;autoIncrement"`
	UserSerial  uint
	
	LeaveType   string
	DepID       uint
	
	StartDate   string     `valid:"required~กรุณากรอกวันที่และเวลา"`
	StartTime   int
	StopDate    string     `valid:"required~กรุณากรอกวันที่และเวลา"`
	StopTime    int
	CountL      int
	Status      string
}
type LeaveList2 struct {
	ID          uint 
	UserSerial  uint
	LeaveType   string
	DepID       uint
	StartDate   string
	StartTime   int
	StopDate    string
	StopTime    int
	CountL      int
	Status      string
}
type LeaveLists struct {
	ID					uint
	UserSerial   		uint
	UserLname			string
	LeaveType			string
	DepID  				uint
	DepName				string
	StartDate   		string		`valid:"required~กรุณากรอกวันที่และเวลา"`
	StartTime   		int	
	StopDate    		string		`valid:"required~กรุณากรอกวันที่และเวลา"`
	StopTime    		int
	CountL				int	
	Status       		string
}
type LeaveList1 struct {
	ID					uint
	UserSerial   		*uint
	UserAuthen			UserAuthen
	Status       	string
}
func init() {
	
	govalidator.CustomTypeTagMap.Set("Current", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})
}