## Development

### Environment variables

In order to run the project, the following environment variables need to be set:  
📌 **Note:** You can use the [.example.env](./.example.env) file as a starting point. Copy it into `.env` file.

```bash
touch .env
cat .env.example > .env
```

### Installation

```bash
yarn
```

### Running the app

Development

```bash
yarn run dev
```

Locally with docker compose

```bash
yarn run docker:up
```

Rebuild docker

```bash
yarn run docker:up-rebuild
```

## API Documentation

We use swagger to document our API.
Swagger documentation is available on:

```bash
http://localhost:8000/api-docs
```
