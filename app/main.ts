import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const store = new Map<string, string>();
const expiryStore = new Map<string, number>();

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  //connection.write("+PONG\r\n");
  connection.on("data", (data) => {
    const request = data.toString();
    const parts = request.split("\r\n");
    let index = 1;
    let result: Array<string> = []; // this array will look like ["ECHO", "YOUR MESSAGE"]
    while (index < parts.length) {
      if (parts[index].startsWith("$")) {
        result.push(parts[index + 1]);
      }
      index = index + 2;
    }

    if (result[0].toUpperCase() === "PING") {
      connection.write("+PONG\r\n");
    } else if (result[0].toUpperCase() === "ECHO") {
      connection.write(`$${result[1].length}\r\n${result[1]}\r\n`);
    } else if (result[0].toUpperCase() === "SET") {
      const key = result[1];
      const value = result[2];
      store.set(key, value);

      const pxIndex = result.findIndex((item) => item.toUpperCase() === "PX");
      if (pxIndex !== -1 && result[pxIndex + 1]) {
        const expiryInMs = parseInt(result[pxIndex + 1], 10);
        const expiryTime = Date.now() + expiryInMs;
        expiryStore.set(key, expiryTime);
      }
      connection.write("+OK\r\n");
    } else if (result[0].toUpperCase() === "GET") {
      const getData = store.get(result[1]);
      if (!getData) {
        connection.write("$-1\r\n");
      }
      const key = result[1];
      const expiry = expiryStore.get(key!);
      if (expiry !== undefined && expiry < Date.now()) {
        store.delete(key!);
        expiryStore.delete(key!);
        connection.write("$-1\r\n");
        return;
      }
      connection.write(`$${getData!.length}\r\n${getData}\r\n`);
    }
  });
});

server.listen(6379, "127.0.0.1");
