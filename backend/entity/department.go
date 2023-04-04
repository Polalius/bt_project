package entity

import (
	"gorm.io/gorm"
)
type Department struct {
	gorm.Model
	DepName   	string

	Manager 	[]Manager 	`gorm:"foreignKey:DepartmentID"`
	Employee 	[]Employee 	`gorm:"foreignKey:DepartmentID"`
	LeaveList 	[]LeaveList `gorm:"foreignKey:DepartmentID"`
	User 		[]User 		`gorm:"foreignKey:DepartmentID"`
}