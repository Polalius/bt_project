package entity

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	EmpName string
	Email     string

	UserID *uint
	User   User
	RoleID		*uint
	Role		Role
	DepartmentID *uint
	Department	Department
	
	LeaveList []LeaveList `gorm:"foreignKey:EmployeeID"`
}
