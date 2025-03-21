package handlers

import (
	"context"
	"fmt"
	"net/http"
	"path"
	"redirect-svc/redis"
)

func HandleRedirect(w http.ResponseWriter, r *http.Request) {
	fmt.Println()
	endpoint := r.URL.Path

	endpoint = path.Base(endpoint)
	fmt.Println(endpoint)

	val := redis.Client.Get(context.Background(), endpoint)
	value, err := val.Result()

	fmt.Println(value)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("something wrong happended"))
		return
	}
	w.Header().Set("Content-Length", "0") // No body

	w.Header().Set("Location", value)
	http.Redirect(w, r, value, http.StatusPermanentRedirect)
}
