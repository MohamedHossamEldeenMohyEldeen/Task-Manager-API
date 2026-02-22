import http from 'http';

const PORT = process.env.PORT || 3000;

let tasks = [
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

      console.log("parsed Data:", parsedData);

      if(typeof parsedData.id !== 'number' || 
        typeof parsedData.task !== 'string' ||
        typeof parsedData.complete !== 'boolean') 
      {
        throw new Error("invalid data types");
      } else
      {
        console.log("tasks array before POST:", tasks);
        tasks.push(parsedData);
        console.log("tasks array after POST:", tasks);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsedData));
      };
    } catch (error)
    {
      res.writeHead(400);
      res.end(JSON.stringify({ error: error.message })); 
    }
  });
};

const deleteItemById = (req, res) => 
{
  tasks = newTasks;
  console.log(newTasks);
  res.end();
}

const server = http.createServer((req, res) =>
{
  if(req.method === 'GET' && req.url === '/tasks')
  {
    const allTasks = JSON.stringify(tasks);
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(allTasks);
  } else if(req.method === 'POST' && req.url === '/tasks') 
  {
    postRequest(req, res);
    // console.log(tasks);
  } else if (req.method === 'DELETE')
  {
    deleteItemById(req, res);
  } else if (req.method === 'PUT')
  {

  } else 
  {
    res.writeHead(400, {'content-type' : 'application/json'});
    res.end('ERROR');
  };
});

server.listen(PORT,() => 
{
  console.log(`Server Started On Port ${PORT}`)
});
