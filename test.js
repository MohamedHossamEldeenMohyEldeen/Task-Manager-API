import http from 'http';
const PORT = process.env.PORT || 3000;

const postRequest = (req, res) =>
{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => 
  {
    try
    {
      const parsedData = JSON.parse(body);
      
      console.log(parsedData);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Data received', data: parsedData }));
    } catch (error)
    {
      res.writeHead(400);
      res.end('Invalid JSON'); 
    }
  });
};

const server = http.createServer((req, res) =>
{
  if (req.method === 'POST')
  {
    postRequest(req, res);
  };
});

server.listen(PORT, () => 
{
  console.log(`server is running on port ${PORT}`);
});