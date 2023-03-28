package entity

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	FirstName string
	LastName  string
	Email     string

	ManagerID *uint
	Manager   Manager

	UserID *uint
	User   User
	RoleID		*uint
	Role		Role
}
