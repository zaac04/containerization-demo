package redis

import (
	"context"
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var Client *redis.Client

func Conn() {
	fmt.Println("Connecting to Redis..")
	Client = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":6379", // Redis server address
		Password: "",                                // No password by default
		DB:       0,                                 // Default DB
	})

	status, err := Client.Ping(context.Background()).Result()

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(Client.Ping(context.Background()), status)
}
