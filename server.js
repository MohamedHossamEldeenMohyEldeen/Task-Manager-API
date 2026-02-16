import http from 'http';

const PORT = process.env.PORT;
const tasks = [
  {
    id: 1,
    task: 'doing something',
    complete: true
  },
  {
    id: 2,
    task: 'killing something',
    complete: true
  },
  {
    id: 3,
    task: 'playing lol',
    complete: false 
  }
];

const postPuller = (req, res) => 
{
  const myURL = new URL(req.url, 'http://localhost:3000/');
  const data = myURL.searchParams;
  console.log(data);
  res.end();
}

const server = http.createServer((req, res) =>
{
  if(req.method === 'GET' && req.url === '/tasks')
  {
    const allTasks = JSON.stringify(tasks);
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(allTasks);
  } else if(req.method === 'POST' ) 
  {
    postPuller(req, res);
  } else 
  {
    res.writeHead(400, {'content-type' : 'application/json'});
    res.end('ERROR');
  } 
});

server.listen(PORT,() => 
{
  console.log(`Server Started On Port ${PORT}`)
});
