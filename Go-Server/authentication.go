package main

import (
	"fmt"
	"net/http"
)

func BasicAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, pass, ok := r.BasicAuth()

		if !ok || !authenticateUser(user, pass) {
			w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func authenticateUser(username, password string) bool {
	fmt.Print(username, password)
	row := db.QueryRow("SELECT Password FROM logincreds WHERE Username = ?;", username)

	var storedpassword string

	err := row.Scan(&storedpassword)

	if err != nil {
		return false
	}

	return password == storedpassword
}
