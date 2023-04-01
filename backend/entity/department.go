package entity

import (
	"gorm.io/gorm"
)
type Department struct {
	gorm.Model
	Name   string

	Manager []Manager `gorm:"foreignKey:DepartmentID"`
	Employee []Employee `gorm:"foreignKey:DepartmentID"`
	LeaveList []LeaveList `gorm:"foreignKey:DepartmentID"`
}