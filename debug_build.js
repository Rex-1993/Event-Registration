const { exec } = require('child_process');
exec('npm run build', { env: { ...process.env, CI: 'true' } }, (error, stdout, stderr) => {
  if (error) {
    console.log(`EXIT CODE: ${error.code}`);
  }
  console.log('--- STDOUT START ---');
  console.log(stdout);
  console.log('--- STDOUT END ---');
  console.log('--- STDERR START ---');
  console.log(stderr);
  console.log('--- STDERR END ---');
});
