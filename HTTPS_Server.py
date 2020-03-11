# Firstly, generate a certificate in the same folder:

# openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes

# Then, python HTTPS_Server.py

import BaseHTTPServer, SimpleHTTPServer
import ssl
httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 8080), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='./server.pem', server_side=True)
httpd.serve_forever()
