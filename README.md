## Home Task

### Getting Started Locally

##### Prerequisites

- Node.js 22.x
- Yarn 1.22.x

##### Install dependencies

```bash
yarn install
```

##### Start the dev server

```bash
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

##### Run tests

```bash
yarn test
```

---

### Running with Docker

You can run the project inside a Node 22 container using Docker Compose:

```bash
docker-compose up
```

The Vite dev server will be available at [http://localhost:5173](http://localhost:5173). Changes made in the local workspace are reflected automatically inside the container.

### Environment variables
| Variable        | Description                                                | Default        |
| --------------- | ---------------------------------------------------------- | -------------- |
| `VITE_API_BASE` | Base URL for the World of Warships encyclopedia endpoints. | `/wows/` (dev) |

- In local/dev the default `/wows/` works because Vite proxies requests to the WG API.
- In production set `VITE_API_BASE=/api/wows/` to use the bundled serverless proxy (`api/wows/[...path].ts`), which forwards requests to the public API and adds CORS headers.
