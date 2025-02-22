# Doku document understanding

Provides endpoints for extracting information from documents and images using VLLMs, including text, tags and a brief summary. The intent is to consume this service with a web or app frontend that helps users organize their personal documents.

## Prerequisites
Built with Bun, Hono, and Drizzle ORM.

- [Bun](https://bun.sh/) runtime
- PostgreSQL database
- [Jobengine](https://github.com/nihiluis/jobengine)
- [Filestore](https://github.com/nihiluis/filestore)
- Minio

## Getting Started
The server will start on port 3000 by default (configurable via PORT env var).
```
bun install
bun run dev
```

```bash
# Build the Docker image
docker build -t documentunderstanding .

# Run the container
docker run -p 3000:3000 documentunderstanding
```

```bash
# Use packaged image
docker pull ghcr.io/nihiluis/documentunderstanding:latest
```

### Env variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JOB_ENGINE_API_URL=http://localhost:8080
FILESTORE_API_URL=http://localhost:8081
```

## Project Structure

- `/api` - API route handlers and OpenAPI specs
- `/db` - Database schema and configuration
- `/lib/document` - Storing document info in the database
- `/lib/imageunderstanding` - Wrapping LLMs for the image understanding logic
- `/migrations` - Database migration files
- `/openapi` - OpenAPI type definitions and clients

## Database Schema

The project uses Drizzle ORM with the following main tables:

- `documents` - Parent document records
- `images` - Image records linked to documents
- `image_text` - Extracted text and metadata from images

## OpenAPI

OpenAPI documentation is available at `/doc` when running the server.

Schemas can be regenerated with `bun run openapi-generate`.

## Working with Drizzle

Drizzle is the ORM used for this project and provides the database schema and migrations.

### Generating Migrations

When you make changes to the schema in `db/schema.ts`, generate new migrations:

```
bun drizzle-kit generate
```

### Executing Migrations

After generating migrations, execute them:

```
bun drizzle-kit migrate
```