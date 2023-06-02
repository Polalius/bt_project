package entity

type Department struct {
	DepID       uint   `gorm:"primaryKey" db:"dep_id"`
	DepName     string `db:"dep_name"`
	DepMail     string `db:"dep_mail"`
	ManagerMail string `db:"manager_mail"`
}