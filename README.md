# Ronis

This is a simple Redis-like in-memory key-value store built using Node.js and TCP sockets.

## Features

- `PING`: Replies with `PONG`
- `ECHO`: Replies with the same message
- `SET key value`: Stores the key-value pair
- `SET key value PX milliseconds`: Stores the key-value pair with expiry
- `GET key`: Retrieves the value for the key (if not expired)

---

## 🛠 Setup

Make sure you have [Bun](https://bun.sh) installed.

```bash
bun install
bun run dev
```

This starts the TCP server on port 6379.

## 🧪 Test with nc (Netcat)

You can use netcat to send raw RESP (Redis Serialization Protocol) commands.

### 🔁 PING

```bash
echo -e '*1\r\n$4\r\nPING\r\n' | nc 127.0.0.1 6379
```

Response:

```bash
+PONG
```

### 🗣️ ECHO

```bash
echo -e '*2\r\n$4\r\nECHO\r\n$5\r\nHello\r\n' | nc 127.0.0.1 6379
```

Response:

```bash
$5
Hello
```

### 🗄️ SET

```bash
echo -e '*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n' | nc 127.0.0.1 6379
```

Response:

```bash
+OK
```

### 🗄️ SET with expiry

```bash
echo -e '*5\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n$2\r\nPX\r\n$4\r\n1000\r\n' | nc 127.0.0.1 6379
```

Response:

```bash
+OK
```

### 🗄️ GET

```bash
echo -e '*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n' | nc 127.0.0.1 6379
```

Response (if key exists):

```bash
$5
value
```

Response (if key does not exist):

```bash
$-1
```

## License

[MIT](LICENSE)
