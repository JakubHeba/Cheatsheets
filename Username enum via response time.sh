for i in {1..25}; do curl -i -s -k -o /dev/null -X $'POST' \
-H $'Host: {HOST}:{PORT}' \
-H $'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0' \
-H $'Accept: */*' \
-H $'Accept-Language: pl,en-US;q=0.7,en;q=0.3' \
-H $'Accept-Encoding: gzip, deflate' \
-H $'Content-Type: {Content_Type}' \
-H $'Content-Length: {Content_Length}' \
-H $'Connection: close' \
-H $'Upgrade-Insecure-Requests: 1' \
--data-binary $'{POST_DATA}' \
$'{LOGIN_ENDPOINT}' \
-w %{time_total};echo; done

