 const products = [
    { id: 1, name: 'Shirt', price: 100 },
    { id: 2, name: 'Pants', price: 150 }
  ];
function handleRoutes(req, res) {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to my website!');
  } 
  else if (req.url === '/profile') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Here you can see your profile');
  }
  else if (req.url === '/api/products' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
      body += chunk.toString();
      });
      req.on('end', () => {
      try 
      {
        const product = JSON.parse(body);
        const exists = products.some(p => p.id === product.id);
        if(!exists)
        {
          products.push(product);
          console.log('New product:', product);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Product created!', product }));
        }
        else
        {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('ID ARE Exists');
        }
  
      } 
      catch (err) 
      {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
   
  }

  else if (req.url === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
  }
  else if(req.url.startsWith('/api/products/') && req.method === 'PUT')
  {
    const parts = req.url.split('/');
    const id = parts[3];
    const productId = Number(id);
    const index = products.findIndex(p => p.id === productId);
    const product = products.find(p => p.id === productId);
    if(product)
    {
      let body = '';
      req.on('data', chunk => {
      body += chunk.toString();
      });
      req.on('end', () => {
      try 
      {
        const updatedProduct = JSON.parse(body);
        const exists = products.some(p => p.id === updatedProduct.id);
        if(!(exists))
        {
          products[index] = { ...products[index], ...updatedProduct };
          console.log('Update product:', updatedProduct);
          console.log(products)
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Product Updated!', product: products[index] }));
        }
        else
        {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('ID ARE Exists');
        }
    
      } 
      catch (err) 
      {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
    }
    else
    {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 - Page not found');
    }
  }

  else if (req.url.startsWith('/api/products/')) {
    const parts = req.url.split('/');
    const id = parts[3];
    const productId = Number(id);
    const product = products.find(p => p.id === productId);
    
    if(product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Product not found');
    }
  } 
  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page not found');
    
  }
}

module.exports = handleRoutes;
