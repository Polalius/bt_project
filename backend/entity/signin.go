package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name string		`gorm:"uniqueIndex"`

	Employee []Employee `gorm:"foreignKey:RoleID"`
	Manager []Manager `gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	UserName string  `gorm:"uniqueIndex"`
	Password string

	Employee []Employee `gorm:"foreignKey:UserID"`
	Manager []Manager `gorm:"foreignKey:UserID"`
}
