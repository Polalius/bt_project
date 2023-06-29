package entity

type UserAuthen struct {
	UserSerial uint   `gorm:"primaryKey" json:"user_serial"`
	UserName   string `json:"user_name"`
	UserPass   string `json:"user_pass"`
	UserPosition   int    `json:"user_position"`
	DepID      int    `json:"dep_id"`
	Department Department `gorm:"foreignKey:DepID"`
}
type User struct {
	UserNo         	uint 		`db:"user_no"`
	UserLname		string		`db:"user_lname"`
	UserAuthenId	int			`db:"user_serial"`
}