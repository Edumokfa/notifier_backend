const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const { notificationQueue } = require('./controllers/cronController'); 

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues } = createBullBoard({
  queues: [new BullMQAdapter(notificationQueue)],
  serverAdapter: serverAdapter,
});

module.exports = { serverAdapter, addQueue, removeQueue, setQueues };
