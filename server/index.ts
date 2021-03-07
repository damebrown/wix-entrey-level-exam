import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath, sort } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  let tempDataToSort: Ticket[] = tempData.slice();

  switch (req.params.sortBy) {
    case sort.unsorted:
      break;
    case sort.date:
      tempDataToSort.sort((a, b) => a.creationTime - b.creationTime);
      break;
    case sort.email:
      tempDataToSort.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
      break;
    case sort.title:
      tempDataToSort.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  const paginatedData = tempDataToSort.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

