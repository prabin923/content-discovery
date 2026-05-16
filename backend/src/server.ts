import './config/env';
import { createApp } from './app';
import { startContentSyncJob } from './jobs/contentSync';

const app = createApp();
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`✓ Server is running on http://localhost:${port}`);
  console.log(`✓ Health check available at http://localhost:${port}/health`);
  startContentSyncJob();
});
