function start_html_server() {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const hostname = '0.0.0.0';
    const port = 8080;
    const server = http.createServer((request, response) => {
        let filePath = request.url === '/' ? '/index.html' : request.url;
        
        // Normalize the path and avoid directory traversal
        filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
        const extname = path.extname(filePath).toLowerCase();
    
        // handle HTML, CSS, JS, images, and MP3 files
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.ogg': 'audio/mpeg',
            '.wav': 'audio/mpeg',

        };
    
        const contentType = contentTypes[extname] || 'text/plain';  // Default content-type
    
        // Read and serve the requested file
        fs.readFile(path.join(__dirname, filePath), (error, content) => {
            if (error) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('404 Not Found');
            } else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf8');
            }
        });
    });
    
    server.listen(port, hostname, () => {
        console.log(`Server running at https://web-s5aeae52a-d0cc.docode.us.qwasar.io/`);
    });
};
start_html_server();