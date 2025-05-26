# Mileage Polling System

A Node.js-based blockchain polling system designed to monitor and store events from a mileage smart contract on the Kaia Network. The system regularly polls the blockchain for new events, processes them, and stores them in a MySQL database.

## 🌟 Features

- **Real-time Event Monitoring**: Polls the blockchain every 2 seconds for new blocks and events
- **Smart Contract Event Processing**: Tracks `MileageEarned` and `MileageSpent` events
- **Persistent Storage**: Stores transaction data and events in a MySQL database
- **REST API**: Provides endpoints for monitoring system status
- **Robust Error Handling**: Includes retry logic and graceful shutdowns
- **Comprehensive Logging**: Detailed logs for troubleshooting and monitoring

## 📋 Prerequisites

- Node.js (v14 or later)
- MySQL (v5.7 or later) running on port 13306
- Access to a Kaia Network node (RPC endpoint)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd mileage_polling
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and modify it with your specific configuration:

```bash
cp .env.example .env
```

Open the `.env` file and update the values according to your setup, particularly:
- MySQL database credentials
- Kaia Network RPC URL
- Contract address

### 4. Build the project

```bash
npm run build
```

## 💻 Usage

### Starting the service

To start the mileage polling system:

```bash
npm start
```

For development with automatic reloading:

```bash
npm run dev
```

### Available API Endpoints

The system provides the following REST API endpoints:

- **GET /health**: Health check endpoint to verify the service is running
  ```
  curl http://localhost:3000/health
  ```

- **GET /status**: Returns the current synchronization status
  ```
  curl http://localhost:3000/status
  ```

### Monitoring and Logging

Logs are stored in the `logs` directory:
- `combined.log`: Contains all log levels
- `error.log`: Contains only error logs

You can change the log level in the `.env` file by modifying the `LOG_LEVEL` variable.

## ⚙️ Configuration

### Key Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KAIA_RPC_URL` | Kaia Network RPC endpoint | https://rpc.kaiachain.io |
| `CONTRACT_ADDRESS` | Mileage contract address | 0x1234567890123456789012345678901234567890 |
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 13306 |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | password |
| `DB_NAME` | MySQL database name | mileage_db |
| `PORT` | HTTP server port | 3000 |
| `POLLING_INTERVAL_MS` | Blockchain polling interval (ms) | 2000 |

### Database Schema

The system automatically creates the following tables:
- `blockchain_data`: Stores transaction data
- `contract_events`: Stores contract events
- `sync_status`: Tracks the last processed block

### Blockchain Configuration

The system is configured to track the following events from the mileage contract:
- `MileageEarned`: When a user earns mileage points
- `MileageSpent`: When a user spends mileage points

## 🛠️ Development

### Project Structure

```
mileage_polling/
├── src/                      # Source files
│   ├── config/               # Configuration files
│   │   ├── blockchain.ts     # Blockchain connectivity
│   │   ├── database.ts       # Database connectivity
│   │   └── logger.ts         # Logging setup
│   ├── models/               # Data models
│   │   └── BlockchainData.ts # TypeScript interfaces
│   ├── repositories/         # Data access layer
│   │   └── BlockchainRepository.ts # Database operations
│   ├── services/             # Business logic
│   │   └── BlockchainService.ts    # Blockchain polling
│   └── index.ts              # Application entry point
├── dist/                     # Compiled JavaScript files
├── logs/                     # Log files
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Adding New Features

To add support for new contract events:

1. Update the contract ABI in `src/config/blockchain.ts`
2. Add new event processing methods in `src/services/BlockchainService.ts`
3. Create new interfaces in `src/models/BlockchainData.ts` if needed
4. Update database schema in `src/config/database.ts` if needed

### Testing

To run tests:

```bash
npm test
```

## 📝 License

[MIT](LICENSE)

