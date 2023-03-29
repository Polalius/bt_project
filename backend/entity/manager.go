package entity

import "gorm.io/gorm"

type Manager struct {
	gorm.Model
	FirstName string
	LastName  string
	Email     string
	UserID    *uint 
	User      User
	RoleID		*uint
	Role		Role
	
	LeaveList []LeaveList `gorm:"foreignKey:ManagerID"`
	Employee []Employee `gorm:"foreignKey:ManagerID"`
}
