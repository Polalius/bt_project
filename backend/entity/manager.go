package entity

import "gorm.io/gorm"

type Manager struct {
	gorm.Model
	ManName 		string
	Email     		string
	
	UserID    		*uint 
	User      		User			`gorm:"references:id" valid:"-"`
	RoleID			*uint
	Role			Role			`gorm:"references:id" valid:"-"`
	DepartmentID 	*uint
	Department		Department		`gorm:"references:id" valid:"-"`

	LeaveList 		[]LeaveList 	`gorm:"foreignKey:ManagerID"`
}
