const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const app = express();
// Allow only specific origins
const allowedOrigins = [
  'https://designnova.onrender.com',
  'http://localhost:8080'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  }
}));

app.use(express.json());

// Sandbox constraints
const SANDBOX = {
  timeoutMs: 5000,  // 5 seconds max
  memoryMB: 256,    // 256 MB
};

app.post('/runCode', async (req, res) => {
  const { language, code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const config = {
    python: { ext: ".py", run: ["python3"] },
    cpp: { ext: ".cpp", compile: ["g++"], run: ["./SystemDesign"] }
  }[language];

  if (!config) return res.status(400).json({ error: 'Unsupported language.' });

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-'));
  const filename = `SystemDesign${config.ext}`;
  const filepath = path.join(tempDir, filename);
  fs.writeFileSync(filepath, code);

  let output = "";

  // Run process with sandbox (ulimit + timeout)
  const runWithLimits = (cmd, args, cwd, callback) => {
    const fullCmd = `ulimit -v ${SANDBOX.memoryMB * 1024} && ${cmd} ${args.join(" ")}`;
    const proc = spawn(fullCmd, { cwd, shell: true });

    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (data) => (output += data.toString()));

    const timeout = setTimeout(() => proc.kill("SIGKILL"), SANDBOX.timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      callback(code);
    });
  };

  // Step 1: compile if needed
  if (config.compile) {
    const compileArgs = [filename, "-o", "SystemDesign"];

    runWithLimits(config.compile[0], compileArgs, tempDir, (compileCode) => {
      if (compileCode !== 0) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        return res.json({ output: output.trim(), exitCode: compileCode });
      }

      // Step 2: run the program
      runWithLimits(config.run[0], config.run.slice(1), tempDir, (exitCode) => {
        fs.rmSync(tempDir, { recursive: true, force: true });
        res.json({ output: output.trim(), exitCode });
      });
    });
  } else {
    // Direct run (Python)
    runWithLimits(config.run[0], [filename], tempDir, (exitCode) => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      res.json({ output: output.trim(), exitCode });
    });
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`RunCode service listening on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Root Route working");
});
