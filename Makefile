.PHONY: help server client dev build clean install

# Default target
help:
	@echo "Journey to Ephesus - Ancient Coin Museum"
	@echo ""
	@echo "🏛️  Development:"
	@echo "  make server         - Run the Rust backend server"
	@echo "  make client         - Run the Svelte frontend (port 5173)"
	@echo "  make dev            - Run both server and client"
	@echo ""
	@echo "🔨 Build & Deploy:"
	@echo "  make build          - Build server and client for production"
	@echo "  make build-babylon  - Build for Babylon deployment (aarch64)"
	@echo "  make install        - Install all dependencies"
	@echo "  make clean          - Clean all build artifacts"
	@echo "  make test           - Run all tests"

# Run the server (from server directory where data/ lives)
server:
	@echo "Starting Ephesus server..."
	cd server && cargo run

# Run the client
client:
	@echo "Starting Ephesus client..."
	cd client && npm run dev

# Run both server and client (requires two terminals or use &)
dev:
	@echo "Starting development environment..."
	@echo "Run 'make server' and 'make client' in separate terminals"

# Build all for production (native)
build:
	@echo "Building server..."
	cd server && cargo build --release
	@echo "Building client..."
	cd client && npm run build
	@echo "✅ Build complete!"
	@echo "  Server binary: server/target/release/ephesus-server"
	@echo "  Client dist: client/dist/"

# Build for Babylon (aarch64-unknown-linux-gnu)
build-babylon:
	@echo "Building server for aarch64-unknown-linux-gnu..."
	cd server && cargo build --release --target aarch64-unknown-linux-gnu
	@echo "Building client..."
	cd client && npm run build
	@echo "✅ Build complete!"
	@echo "  Server binary: server/target/aarch64-unknown-linux-gnu/release/ephesus-server"
	@echo "  Client dist: client/dist/"

# Build server only
build-server:
	@echo "Building server..."
	cd server && cargo build --release
	@echo "✅ Server build complete!"
	@echo "  Server binary: server/target/release/ephesus-server"

# Build server for Babylon only
build-server-babylon:
	@echo "Building server for aarch64-unknown-linux-gnu..."
	cd server && cargo build --release --target aarch64-unknown-linux-gnu
	@echo "✅ Server build complete!"
	@echo "  Server binary: server/target/aarch64-unknown-linux-gnu/release/ephesus-server"

# Build client only
build-client:
	@echo "Building client..."
	cd client && npm run build
	@echo "✅ Client build complete!"
	@echo "  Client dist: client/dist/"

# Format server code
format-server:
	@echo "Formatting server..."
	cd server && cargo fmt
	@echo "✅ Format complete!"

# Lint server code
lint-server:
	@echo "Linting server..."
	cd server && cargo clippy -- -D warnings
	@echo "✅ Lint complete!"

# Type check client
check-client:
	@echo "Type checking client..."
	cd client && npm run check
	@echo "✅ Type check complete!"

# Install dependencies
install:
	@echo "Installing server dependencies..."
	cd server && cargo fetch
	@echo "Installing client dependencies..."
	cd client && npm install
	@echo "✅ All dependencies installed!"

# Clean build artifacts
clean:
	@echo "Cleaning server build..."
	cd server && cargo clean
	@echo "Cleaning client build..."
	cd client && rm -rf dist node_modules/.vite
	@echo "✅ Clean complete!"

# Run tests
test:
	@echo "Running server tests..."
	cd server && cargo test

