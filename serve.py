import http.server
import socketserver
import os

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class VercelDevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        url_path = self.path.split('?')[0].rstrip('/')
        
        # Emulate Vercel Clean URLs routing from vercel.json
        if url_path == '' or url_path == '/':
            self.path = '/index.html'
        elif url_path == '/admin':
            self.path = '/admin.html'
        elif url_path == '/client':
            self.path = '/client.html'
        elif not os.path.splitext(url_path)[1]:
            # If no extension and .html file exists, route to it
            potential_file = os.path.join(BASE_DIR, url_path.lstrip('/') + '.html')
            if os.path.exists(potential_file):
                self.path = url_path + '.html'

        return super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), VercelDevHandler) as httpd:
        print(f"Vercel Local Dev Server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
