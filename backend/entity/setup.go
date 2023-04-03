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

	de1 := Department{
		DepName:   "IT",
		
	}

	de2 := Department{
		DepName:   "Payroll",
		
	}
	db.Model(&Department{}).Create(&de1)
	db.Model(&Department{}).Create(&de2)
	////////////////
	man1 := Manager{
		ManName: "Tom Holland",
		Email:     "tom@email.com",
		User:      userMan,
		Department: de1,
		Role: man,
	}
	db.Model(&Manager{}).Create(&man1)
	pay1 := Manager{
		ManName: "Will Smith",
		Email:     "will@email.com",
		User:      userPay,
		Department: de2,
		Role: pay,
	}
	db.Model(&Manager{}).Create(&pay1)

	emp1 := Employee{
		EmpName: "Chris Evans",
		Email:     "chris@email.com",
		User:      userEmp1,
		Department: de1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp1)

	emp2 := Employee{
		EmpName: "Robert Downey",
		Email:     "robert@email.com",
		User:      userEmp2,
		Department: de1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp2)

	list1 := LeaveList{
		Employee:   emp1,
		LeaveType: l_type1,
		StartTime: time.Now(),
		StopTime:  time.Now(),
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list1)
	list2 := LeaveList{
		Employee:   emp2,
		LeaveType: l_type2,
		StartTime: time.Now(),
		StopTime:  time.Now(),
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list2)
	list3 := LeaveList{
		Employee:   emp2,
		LeaveType: l_type2,
		StartTime: time.Now(),
		StopTime:  time.Now(),
		Manager: man1,
		Department: de1,
		Status: "pending approval",
	}
	db.Model(&LeaveList{}).Create(&list3)


}
