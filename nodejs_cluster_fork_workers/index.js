const express = require("express")
const os = require("os")
const cluster = require("cluster")

const PORT = process.env.PORT || 5000

// Dynamic get all CPUs and set then as Worker Size.
const clusterWorkerSize = os.cpus().length

if (clusterWorkerSize > 1) {
  // If that is the first process that has run, we use cluster.fork() to spawn a new worker process for each of the CPU's
  // round-robin approach or master process creates the listen socket and sends it to interested workers 
  if (cluster.isMaster) {
    for (let i=0; i < clusterWorkerSize; i++) {
      cluster.fork()
    }

    cluster.on("exit", function(worker) {
      console.log("Worker", worker.id, " has exitted.")
    })
  } else {
    const app = express()

    app.listen(PORT, function () {
      console.log(`Express server listening on port ${PORT} and worker ${process.pid}`)
    })
  }
} else {
  const app = express()

  app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT} with the single worker ${process.pid}`)
  })
}