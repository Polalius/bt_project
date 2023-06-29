package services


func VerifyPassword(password1, password2 string) bool {
    return password1 == password2
}
