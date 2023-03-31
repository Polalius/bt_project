package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SutupDatabase() {
	database, err := gorm.Open(sqlite.Open("LeaveList.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect databasess")
	}
	database.AutoMigrate(
		//signin
		&User{},
		&Role{},

		//system
		&LeaveList{},
		&LeaveType{},
		&Manager{},
		&Employee{},
	)
	db = database

	emp := Role{
		Name: "employee",
	}
	man := Role{
		Name: "manager",
	}
	pay := Role{
		Name: "payroll",
	}
	db.Model(&Role{}).Create(&emp)
	db.Model(&Role{}).Create(&man)
	db.Model(&Role{}).Create(&pay)

	/////////////
	pw, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		return
	}
	//////////////
	userEmp1 := User{
		UserName: "Employee1",
		Password: string(pw),
		Role: emp,
	}
	userEmp2 := User{
		UserName: "Employee2",
		Password: string(pw),
		Role: emp,
	}
	userMan := User{
		UserName: "Manager",
		Password: string(pw),
		Role: man,
	}
	userPay := User{
		UserName: "Payroll",
		Password: string(pw),
		Role: pay,
	}
	db.Model(&User{}).Create(&userEmp1)
	db.Model(&User{}).Create(&userEmp2)
	db.Model(&User{}).Create(&userMan)
	db.Model(&User{}).Create(&userPay)

	///////////////
	l_type1 := LeaveType{
		TypeName:   "ลาป่วย",
		Information: "---------",
	}

	l_type2 := LeaveType{
		TypeName:   "ลากิจ",
		Information: "---------",
	}
	db.Model(&LeaveType{}).Create(&l_type1)
	db.Model(&LeaveType{}).Create(&l_type2)

	////////////////
	man1 := Manager{
		FirstName: "Tom",
		LastName:  "Holland",
		Email:     "tom@email.com",
		User:      userMan,
		Role: man,
	}
	db.Model(&Manager{}).Create(&man1)
	pay1 := Manager{
		FirstName: "Will",
		LastName:  "Smith",
		Email:     "will@email.com",
		User:      userPay,
		Role: pay,
	}
	db.Model(&Manager{}).Create(&pay1)

	emp1 := Employee{
		FirstName: "Chris",
		LastName:  "Evans",
		Email:     "chris@email.com",
		User:      userEmp1,
		Manager: man1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp1)

	emp2 := Employee{
		FirstName: "Robert",
		LastName:  "Downey",
		Email:     "robert@email.com",
		User:      userEmp2,
		Manager:   man1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp2)

	list1 := LeaveList{
		Employee:   emp1,
		LeaveType: l_type1,
		StartTime: time.Now(),
		StopTime:  time.Now(),
		Manager: man1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list1)
	list2 := LeaveList{
		Employee:   emp2,
		LeaveType: l_type2,
		StartTime: time.Now(),
		StopTime:  time.Now(),
		Manager: man1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list2)

}
