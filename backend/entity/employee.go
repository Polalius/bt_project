package entity

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	EmpName 		string
	Email     		string

	UserID 			*uint
	User   			User			`gorm:"references:id" valid:"-"`
	RoleID			*uint
	Role			Role			`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department		`gorm:"references:id" valid:"-"`
	
	LeaveList 		[]LeaveList 	`gorm:"foreignKey:EmployeeID"`
}
