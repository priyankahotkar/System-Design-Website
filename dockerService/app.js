const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(cors()); // Allow your frontend or main backend

// Sandbox constraints
const SANDBOX = {
  timeoutMs: 5000,  // 5 seconds max
  memoryMB: 256,    // 256 MB
};

app.post('/runCode', async (req, res) => {
  const { language, code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const config = {
    javascript: { ext: ".js", run: ["node"] },
    python: { ext: ".py", run: ["python3"] },
    java: { ext: ".java", compile: ["javac"], run: ["java", "-XX:ReservedCodeCacheSize=64m", "-Xmx128m", "SystemDesign"] },
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
    // Wrap the command in a shell that sets memory limits
    const fullCmd = `ulimit -v ${SANDBOX.memoryMB * 1024} && ${cmd} ${args.join(" ")}`;
    const proc = spawn(fullCmd, { cwd, shell: true });

    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (data) => (output += data.toString()));

    // Timeout protection
    const timeout = setTimeout(() => proc.kill("SIGKILL"), SANDBOX.timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      callback(code);
    });
  };

  // Step 1: compile if needed
  if (config.compile) {
    const compileArgs =
      language === "cpp" ? [filename, "-o", "SystemDesign"] : [filename];

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
    // Direct run (no compile step)
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
