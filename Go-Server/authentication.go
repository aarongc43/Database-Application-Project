package main

import (
	"database/sql"
	"fmt"
	"log"
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
	var resultUsername string
	err := db.QueryRow("CALL GetHashyPassy(?, ?)", username, password).Scan(&resultUsername)
	if err != nil {
		if err == sql.ErrNoRows {
			// No rows were returned, meaning the authentication failed
			fmt.Println("Invalid username or password")
			return false
		} else {
			// Other errors occurred
			log.Fatal(err)
			return false
		}
	}
	return true
}
