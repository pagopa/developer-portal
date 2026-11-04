#!/bin/bash
set -e

latest_stable_json="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"
# Retrieve the JSON data using curl
json_data=$(curl -s "$latest_stable_json")

latest_chrome_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chrome[] | select(.platform == \"linux64\") | .url")"
latest_chrome_driver_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chromedriver[] | select(.platform == \"linux64\") | .url")"

# latest_chrome_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chrome[0].url")"
# latest_chrome_linux_platform="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chrome[0].platform")"
# latest_chrome_driver_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chromedriver[0].url")"
# latest_chrome_driver_linux_platform="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chromedriver[0].platform")"

echo "Versione Stable dichiarata da Chrome for Testing: $(echo "$json_data" | jq -r '.channels.Stable.version')"
# echo "Versione Chrome platform: $latest_chrome_linux_platform"
echo "Versione Chrome URL: $latest_chrome_linux_download_url"
# echo "Versione Chrome driver platform: $latest_chrome_driver_linux_platform"
echo "Versione Chrome driver URL: $latest_chrome_driver_linux_download_url"

download_path_chrome_linux="/opt/chrome-headless-shell-linux.zip"
download_path_chrome_driver_linux="/opt/chrome-driver-linux.zip"

mkdir -p "/opt/chrome"
curl -Lo $download_path_chrome_linux $latest_chrome_linux_download_url
unzip -q $download_path_chrome_linux -d "/opt/chrome"
rm -rf $download_path_chrome_linux

echo "Contenuto di /opt/chrome:"
ls -la /opt/chrome

mkdir -p "/opt/chrome-driver"
curl -Lo $download_path_chrome_driver_linux $latest_chrome_driver_linux_download_url
unzip -q $download_path_chrome_driver_linux -d "/opt/chrome-driver"
rm -rf $download_path_chrome_driver_linux

echo "Contenuto di /opt/chrome-driver:"
ls -la /opt/chrome-driver