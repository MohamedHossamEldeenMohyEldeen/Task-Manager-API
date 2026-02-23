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

const getByIdRequest = (req, res) =>
{
  const id = req.url.split('/')[2];
  const task = tasks.find(task => task.id === parseInt(id));

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify(task));
};

const getrequest = (req, res) => 
{
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(tasks))
};

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

      const newTask = { id: tasks.length + 1, task: parsedData.task, complete: parsedData.complete};
      console.log("parsed Data:", newTask);

      if(typeof parsedData.task !== 'string' ||
        typeof parsedData.complete !== 'boolean') 
      {
        throw new Error("invalid data types");
      } else if (req.headers['content-type'] !== 'application/json')
      {
        res.writeHead(415);
        return res.end(JSON.stringify({ error: "Content-Type must be application/json" }))
      }
      console.log("tasks array before POST:", tasks);
      tasks.push(newTask);
      console.log("tasks array after POST:", tasks);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsedData));
    } catch (error)
    {
      res.writeHead(400);
      res.end(JSON.stringify({ error: error.message })); 
    }
  });
};

const deleteItemById = (req, res) => 
{
  const id = Number(req.url.split('/')[2]);
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if(taskIndex === -1)
  {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end("Item ID Not Found");
  } else 
  {
    tasks.splice(taskIndex, 1);
    console.log(tasks);
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(tasks));
  };
};

const putRequest = (req, res) =>
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
      const id = Number(req.url.split('/')[2]);
      const task = tasks.find(task => task.id === parseInt(id));

      if(typeof parsedData.task !== 'string' ||
        typeof parsedData.complete !== 'boolean') 
      {
        throw new Error("invalid data types");
      } else if (req.headers['content-type'] !== 'application/json')
      {
        res.writeHead(415);
        return res.end(JSON.stringify({ error: "Content-Type must be application/json" }))
      };
      
      task.task = parsedData.task;
      task.complete = parsedData.complete;
      
      console.log("task after update:", task);

      console.log("tasks after update:", tasks);
      res.writeHead(200)
      res.end('array has been updated successfully')
    } catch (error)
    {
      res.writeHead(400)
      res.end(JSON.stringify({ error: error.message }))
    };
  });
};

const server = http.createServer((req, res) =>
{
  if(req.method === 'GET' && req.url === '/tasks')
  {
    getrequest(req, res);
  }else if(req.method === 'GET' && req.url.match(/\/tasks\/([0-9]+)/))
  {
    getByIdRequest(req, res);
  } else if(req.method === 'POST' && req.url === '/tasks') 
  {
    postRequest(req, res);
  } else if (req.method === 'DELETE' && req.url.match(/\/tasks\/([0-9]+)/))
  {
    deleteItemById(req, res);
  } else if (req.method === 'PUT' && req.url.match(/\/tasks\/([0-9]+)/))
  {
    putRequest(req, res);
  } else 
  {
    res.writeHead(400, {'content-type' : 'application/json'});
    res.end('invalid URL');
  };
});

server.listen(PORT,() => 
{
  console.log(`Server Started On Port ${PORT}`)
});
