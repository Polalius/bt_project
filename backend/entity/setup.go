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
		&SwitchLeave{},
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

	de1 := Department{
		DepName:   "IT",
		
	}

	de2 := Department{
		DepName:   "Payroll",
		
	}
	db.Model(&Department{}).Create(&de1)
	db.Model(&Department{}).Create(&de2)
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
		Department: de1,
	}
	userEmp2 := User{
		UserName: "Employee2",
		Password: string(pw),
		Role: emp,
		Department: de1,
	}
	userMan := User{
		UserName: "Manager",
		Password: string(pw),
		Role: man,
		Department: de1,
	}
	userPay := User{
		UserName: "Payroll",
		Password: string(pw),
		Role: pay,
		Department: de2,
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
		ManName: "Tom Holland",
		Email:     "napakan2np@gmail.com",
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
		Email:     "napakan1np@gmail.com",
		User:      userEmp1,
		Department: de1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp1)

	emp2 := Employee{
		EmpName: "Robert Downey",
		Email:     "napakan1np@gmail.com",
		User:      userEmp2,
		Department: de1,
		Role: emp,
	}
	db.Model(&Employee{}).Create(&emp2)

	list1 := LeaveList{
		Employee:   emp1,
		LeaveType: l_type1,
		StartTime: time.Date(2023, 4, 8, 0, 0, 0, 0, time.Now().Location()),
		StopTime:  time.Date(2023, 4, 8, 0, 0, 0, 0, time.Now().Location()),
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list1)
	list2 := LeaveList{
		Employee:   emp2,
		LeaveType: l_type2,
		StartTime: time.Date(2023, 4, 8, 8, 0, 0, 0, time.Now().Location()),
		StopTime:  time.Date(2023, 4, 8, 10, 0, 0, 0, time.Now().Location()),
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&LeaveList{}).Create(&list2)
	list3 := LeaveList{
		Employee:   emp2,
		LeaveType: l_type2,
		StartTime: time.Date(2023, 4, 8, 0, 0, 0, 0, time.Now().Location()),
		StopTime:  time.Date(2023, 4, 8, 0, 0, 0, 0, time.Now().Location()),
		Manager: man1,
		Department: de1,
		Status: "pending approval",
	}
	db.Model(&LeaveList{}).Create(&list3)
	sw_leave1 := SwitchLeave{
		Employee: emp1,
		LeaveDay:  "05-05-2023",
		FromTime: 480,
		ToTime: 720,
		WorkDay: "10-05-2023",
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&SwitchLeave{}).Create(&sw_leave1)
	sw_leave2 := SwitchLeave{
		Employee: emp2,
		LeaveDay:  "15-05-2023",
		FromTime: 780,
		ToTime: 1020,
		WorkDay: "20-05-2023",
		Manager: man1,
		Department: de1,
		Status: "approved",
	}
	db.Model(&SwitchLeave{}).Create(&sw_leave2)


}
