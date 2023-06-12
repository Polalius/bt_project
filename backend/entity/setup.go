package entity

import (
	"gorm.io/driver/mysql"
	
	
	"gorm.io/gorm"
)

var (
	db1         *gorm.DB
	db2         *gorm.DB
	leaveDBDSN = "root:123654@tcp(localhost:3306)/leave_db?charset=utf8mb4&parseTime=True&loc=Local"
	switchDBDSN = "root:123654@tcp(localhost:3306)/leavedb?charset=utf8mb4&parseTime=True&loc=Local"
)
func DB1() *gorm.DB {
	return db1
}
func DB2() *gorm.DB {
	return db2
}
func SutupDatabase() {
	leaveDB, err := gorm.Open(mysql.Open(leaveDBDSN), &gorm.Config{})
	if err != nil {
		panic("failed to connect to leave_db")
	}

	switchDB, err := gorm.Open(mysql.Open(switchDBDSN), &gorm.Config{})
	if err != nil {
		panic("failed to connect to switch_db")
	}

	// สร้างตารางในฐานข้อมูล leave_db
	leaveDB.AutoMigrate(&UserAuthen{}, &Department{}, &LeaveList{})
	db1 = leaveDB

	// สร้างตารางในฐานข้อมูล switch_db
	switchDB.AutoMigrate(&SwitchLeave{})
	db2 = switchDB
}