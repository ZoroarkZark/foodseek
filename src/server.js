const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Food Seek!\n');
  
  req.on('error', (err) => {
	  console.error(err);
	  res.statusCode = 400;
	  res.end();
  });
  
  res.on('error', (err) => {
	  console.error(err);
  });
  
  if( req.method === "POST" && req.url === "/signup"){
	  // put sql code
  }
  else{
	  res.statusCode = 404;
	  res.end();
  }
}).listen(port);
