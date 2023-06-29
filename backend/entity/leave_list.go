package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	
)


type LeaveList struct {
	ID          uint `gorm:"primaryKey;autoIncrement"`
	UserSerial  uint
	
	Bh   		string
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
	TypeID		uint
	DepID       uint
	StartDate   string
	StartTime   int
	StopDate    string
	StopTime    int
	CountL      int
	Status      string
}
type LeaveLists struct {
	ID					uint	`gorm:"primaryKey" db:"id"`
	UserSerial   		uint	`db:"user_serial"`
	UserLname			string	`db:"user_lname"`
	Bh					uint	`db:"bh"`
	Mc					string	`db:"mc"`
	DepID  				uint	`db:"dep_id"`
	DepName				string	`db:"dep_name"`
	StartDate   		string	`db:"start_date"`
	StartTime   		int		`db:"start_time"`
	StopDate    		string	`db:"stop_date"`
	StopTime    		int		`db:"stop_time"`
	CountL				int		`db:"count_l"`
	Status       		string	`db:"status"`
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