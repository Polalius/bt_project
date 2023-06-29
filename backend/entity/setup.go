package entity

import (
	"gorm.io/driver/mysql"
	
	
	"gorm.io/gorm"
)

var (
	db         *gorm.DB
	DBDSN = "super:Sang87958@tcp(117.121.217.183:38990)/bsv5?charset=utf8mb4&parseTime=True&loc=Local"
)

func DB() *gorm.DB {
	return db
}
 
func SutupDatabase() {
	leaveDB, err := gorm.Open(mysql.Open(DBDSN), &gorm.Config{})
	if err != nil {
		panic("failed to connect to user_database")
	}

	// สร้างตารางในฐานข้อมูล leave_db
	leaveDB.AutoMigrate(&UserAuthen{}, &Department{}, &SwitchLeave{}, &LeaveList{})
	db = leaveDB
}
