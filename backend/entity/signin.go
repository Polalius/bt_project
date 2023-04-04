package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name 		string		

	Employee 	[]Employee 	`gorm:"foreignKey:RoleID"`
	Manager 	[]Manager 	`gorm:"foreignKey:RoleID"`
	User 		[]User 		`gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	UserName 		string  	`gorm:"uniqueIndex"`
	Password 		string
	RoleID			*uint
	Role			Role		`gorm:"references:id" valid:"-"`
	DepartmentID  	*uint
	Department		Department	`gorm:"references:id" valid:"-"`

	Employee 		[]Employee 	`gorm:"foreignKey:UserID"`
	Manager 		[]Manager 	`gorm:"foreignKey:UserID"`
}
