package entity

import (
	"gorm.io/driver/mysql"
	
	
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SutupDatabase() {
	dsn := "root:123654@tcp(localhost:3306)/leave_db?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect databasess")
	}
	
	// สร้างตารางในฐานข้อมูล
	database.AutoMigrate(&UserAuthen{}, &Department{}, &LeaveList{})
	db = database

	
	

}
