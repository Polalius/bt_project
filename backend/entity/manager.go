package entity

import "gorm.io/gorm"

type Manager struct {
	gorm.Model
	ManName string
	Email     string
	
	UserID    *uint 
	User      User
	RoleID		*uint
	Role		Role
	DepartmentID *uint
	Department	Department

	LeaveList []LeaveList `gorm:"foreignKey:ManagerID"`
}
