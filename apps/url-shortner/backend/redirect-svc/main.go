package main

import (
	"fmt"
	"net/http"
	"os"
	"redirect-svc/handlers"
	"redirect-svc/redis"

	"github.com/go-chi/chi"
)

func init() {
	redis.Conn()
}

func main() {

	router := chi.NewRouter()

	router.Get("/*", handlers.HandleRedirect)

	port := os.Getenv("LISTEN_PORT")
	fmt.Println("Redirect SVC Listening on", port)
	http.ListenAndServe(":"+port, router)
}
