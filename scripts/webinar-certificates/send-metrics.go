package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// Define the structure matching your JSON payload
type IngestPayload struct {
	WebinarID string  `json:"webinarId"`
	IsLive    bool    `json:"isLive"`
	Action    string  `json:"action"`
	Duration  float64 `json:"duration"`
	Consent   bool    `json:"consent"`
}

const (
	// Keep the exact URL from your curl command
	targetURL = "https://video.dev.developer.pagopa.it/ingest"

	// Name of the environment variable holding the bearer token, and the
	// .env file it can be loaded from (see .env.example in this folder).
	bearerTokenEnvVar = "BEARER_TOKEN"
	envFilePath       = ".env"
)

// loadEnvFile reads a simple KEY=VALUE .env file and sets any variables
// that are not already present in the process environment. A missing file
// is silently ignored so that variables can also be exported manually.
func loadEnvFile(path string) error {
	file, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}

		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)

		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, value)
		}
	}

	return scanner.Err()
}

func main() {
	// Define command line flag '-count', defaulting to 10
	iterations := flag.Int("count", 10, "Number of times to execute the HTTP request")
	flag.Parse()

	if err := loadEnvFile(envFilePath); err != nil {
		fmt.Printf("Error loading %s: %v\n", envFilePath, err)
		return
	}

	bearerToken := os.Getenv(bearerTokenEnvVar)
	if bearerToken == "" {
		fmt.Printf("Missing %s. Set it in the environment or in a %s file (see .env.example).\n", bearerTokenEnvVar, envFilePath)
		return
	}

	// Prepare the JSON payload data
	payload := IngestPayload{
		WebinarID: "TestWebinar456",
		IsLive:    true,
		Action:    "playing",
		Duration:  10,
		Consent:   true,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	// Create an HTTP client reuseable across requests
	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	fmt.Printf("Starting execution loop: %d iterations total.\n\n", *iterations)

	for i := 1; i <= *iterations; i++ {
		fmt.Printf("[%s] Executing request %d/%d...\n", time.Now().Format("15:04:05"), i, *iterations)

		// Create a new HTTP request for each iteration since the body stream gets consumed
		req, err := http.NewRequest("POST", targetURL, bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Printf("Error creating request: %v\n", err)
			continue
		}

		// Set required headers
		req.Header.Set("Authorization", "Bearer "+bearerToken)
		req.Header.Set("Content-Type", "application/json")

		// Execute the request
		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Request failed: %v\n", err)
		} else {
			fmt.Printf("Response Status: %s\n", resp.Status)

			// Safely read and discard the body to allow connection reuse
			_, _ = io.Copy(io.Discard, resp.Body)
			resp.Body.Close()
		}

		// Only sleep if it is NOT the final iteration
		if i < *iterations {
			fmt.Println("Pausing for 1 minute before the next shot...")
			time.Sleep(1 * time.Minute)
			fmt.Println("---")
		}
	}

	fmt.Println("Loop execution completed successfully.")
}
