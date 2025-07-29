# Barbershop Schedule Microservice

The Barbershop Schedule Microservice is a core component of the Barbershop platform, responsible for managing schedules. This microservice provides a secure and reliable way to handle user data, authentication, and authorization.

## Main Features

*   **Schedule Management:** Create, retrieve, update, and delete schedules.
*   **Service Management:** Create, retrieve, update, and delete services.
*   **Work Schedule Management:** Create, retrieve, update, and delete work schedules.
*   **Available Slots:** Get all available slots for a given employee, day, and list of services.
*   **Event-Driven Architecture:** Communicates with other microservices through RabbitMQ to ensure loose coupling and scalability.
*   **Domain-Driven Design (DDD):** Built with a clean and maintainable architecture that separates business logic from infrastructure concerns.

## Technology Stack

*   **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **[Express](https://expressjs.com/)**: A fast, unopinionated, minimalist web framework for Node.js.
*   **[MongoDB](https://www.mongodb.com/)**: A general-purpose, document-based, distributed database.
*   **[RabbitMQ](https://www.rabbitmq.com/)**: An open-source message broker.
*   **[Docker](https.docker.com)**: A platform for developing, shipping, and running applications in containers.
*   **[InversifyJS](http://inversify.io/)**: A powerful and lightweight inversion of control (IoC) container for TypeScript and JavaScript.

## Architecture

This microservice is built using the principles of **Domain-Driven Design (DDD)**. The code is organized into four main layers:

*   **`ui`**: The presentation layer, responsible for handling HTTP requests and responses. It contains the Express controllers.
*   **`application`**: The application layer, which orchestrates the business logic. It contains the application services and interfaces.
*   **`domain`**: The domain layer, which contains the core business logic and data models.
*   **`infrastructure`**: The infrastructure layer, which handles external concerns like database connections, message queues, and other third-party integrations.

Here is a high-level diagram of the architecture:

```
+-----------------+      +-----------------+      +--------------------+
|   UI Layer      |----->| Application Layer |----->|   Domain Layer     |
| (Controllers)   |      | (Services)      |      | (Models, Entities) |
+-----------------+      +-----------------+      +--------------------+
        |                      |                      |
        |                      |                      |
        v                      v                      v
+----------------------------------------------------------------------+
|                        Infrastructure Layer                            |
| (MongoDB, RabbitMQ, etc.)                                            |
+----------------------------------------------------------------------+
```

## API Endpoints

Here is a list of the available API endpoints:

### Schedules

| Method   | Endpoint                 | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `POST`   | `/v1/schedules`            | Create a new schedule       |
| `GET`    | `/v1/schedules`            | Get all schedules           |
| `GET`    | `/v1/schedules/:schedule_id` | Get a schedule by ID        |
| `PATCH`  | `/v1/schedules/:schedule_id` | Update a schedule by ID     |
| `DELETE` | `/v1/schedules/:schedule_id` | Delete a schedule by ID     |

### Available Slots

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `POST`  | `/v1/schedules/availableslots` | Get all available slots for a given employee, day, and list of services |

### Services

| Method   | Endpoint                 | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `POST`   | `/v1/services`            | Create a new service       |
| `GET`    | `/v1/services`            | Get all services           |
| `GET`    | `/v1/services/:service_id` | Get a service by ID        |
| `PATCH`  | `/v1/services/:service_id` | Update a service by ID     |
| `DELETE` | `/v1/services/:service_id` | Delete a service by ID     |

### Work Schedules

| Method   | Endpoint                 | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `POST`   | `/v1/work-schedules`            | Create a new work schedule       |
| `GET`    | `/v1/work-schedules`            | Get all work schedules           |
| `GET`    | `/v1/work-schedules/:work_schedule_id` | Get a work schedule by ID        |
| `PATCH`  | `/v1/work-schedules/:work_schedule_id` | Update a work schedule by ID     |
| `DELETE` | `/v1/work-schedules/:work_schedule_id` | Delete a work schedule by ID     |

## Getting Started

To get the project up and running on your local machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (v14.16.0 or higher)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

## Generate Certificates and Keys
1. For development and testing environments the easiest and fastest way is to generate your own self-signed certificates. To do this, run the `generate-dev-certs.sh` script in the root of the repository.
```sh
chmod +x ./generate-dev-certs.sh
```

```sh
./generate-dev-certs.sh
```
The following files will be created: `ca_cert.pem`, `jwt.key`, `jwt.key.pub`, `server_cert.pem` and `server_key.pem`.

2. For generation mongodb encrypt key run: 
```sh
chmod +x ./generate-db-keys.sh
```

```sh
./generate-db-keys.sh
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/KaiqueIvo04/barbershop-schedule-management.git
    cd barbershop-schedule-management
    ```

2.  **Create a `.env` file:**

    Copy the `.env.example` file to a new file named `.env`.

    ```bash
    cp .env.example .env
    ```

    Update the environment variables in the `.env` file as needed.

3.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

You can run the application using Docker Compose, which will start the microservice along with its dependencies (MongoDB and RabbitMQ).

```bash
docker-compose up --build -d
```

The microservice will be available at `http://localhost:3002`.

## Running Tests

To run the test suite, use the following command:

*   **Unit Tests:** `npm run test:unit`
*   **Integration Tests:** `npm run test:integration`

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Create a pull request to the `master` branch of the original repository.

Please make sure that your code follows the existing coding style and that all tests pass before submitting a pull request.
