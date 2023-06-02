package entity

type UserAuthen struct {
	UserSerial uint   `gorm:"primaryKey" db:"user_serial"`
	UserName   string `db:"user_name"`
	Password   string `db:"password"`
	Position   int    `db:"position"`
	DepID      int    `db:"dep_id"`
	Department Department `gorm:"foreignKey:DepID"`
}
type User struct {
	UserNo         	uint 		`db:"user_no"`
	UserLname		string		`db:"user_lname"`
	UserAuthenId	int			`db:"user_serial"`
}