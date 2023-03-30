package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name string		

	Employee []Employee `gorm:"foreignKey:RoleID"`
	Manager []Manager `gorm:"foreignKey:RoleID"`
	User []User `gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	UserName string  `gorm:"uniqueIndex"`
	Password string
	RoleID		*uint
	Role		Role

	Employee []Employee `gorm:"foreignKey:UserID"`
	Manager []Manager `gorm:"foreignKey:UserID"`
}
