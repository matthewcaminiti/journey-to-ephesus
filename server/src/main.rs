use anyhow::Result;
use axum::{
    Router,
    routing::get,
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use std::{sync::Arc, path::PathBuf};
use tokio::fs;
use tower_http::{
    cors::{CorsLayer, Any},
    services::ServeDir,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// ============================================================================
// Types
// ============================================================================

#[derive(Debug, Clone)]
struct AppState {
    coins: Vec<Coin>,
    models_dir: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Coin {
    id: String,
    name: String,
    description: String,
    year: Option<String>,
    mint: Option<String>,
    denomination: Option<String>,
    metal: Option<String>,
    weight_grams: Option<f64>,
    diameter_mm: Option<f64>,
    model_url: String,
    thumbnail_url: Option<String>,
    // Numismatic grading and reference fields
    grade: Option<String>,
    catalog_reference: Option<String>,
    ruler: Option<String>,
    obverse_description: Option<String>,
    reverse_description: Option<String>,
    obverse_legend: Option<String>,
    reverse_legend: Option<String>,
}

#[derive(Debug, Serialize)]
struct ApiError {
    error: String,
}

// ============================================================================
// Routes
// ============================================================================

/// List all coins
async fn list_coins(State(state): State<Arc<AppState>>) -> Json<Vec<Coin>> {
    Json(state.coins.clone())
}

/// Get a single coin by ID
async fn get_coin(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<Coin>, (StatusCode, Json<ApiError>)> {
    state
        .coins
        .iter()
        .find(|c| c.id == id)
        .cloned()
        .map(Json)
        .ok_or_else(|| {
            (
                StatusCode::NOT_FOUND,
                Json(ApiError {
                    error: "Coin not found".to_string(),
                }),
            )
        })
}

/// Health check endpoint
async fn health() -> &'static str {
    "OK"
}

// ============================================================================
// Data Loading
// ============================================================================

async fn load_coins(data_dir: &PathBuf) -> Result<Vec<Coin>> {
    let coins_path = data_dir.join("coins.json");
    
    if coins_path.exists() {
        let contents = fs::read_to_string(&coins_path).await?;
        let coins: Vec<Coin> = serde_json::from_str(&contents)?;
        tracing::info!("Loaded {} coins from {}", coins.len(), coins_path.display());
        Ok(coins)
    } else {
        tracing::warn!("No coins.json found at {}, starting with empty collection", coins_path.display());
        Ok(Vec::new())
    }
}

// ============================================================================
// Main
// ============================================================================

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "ephesus_server=debug,tower_http=debug".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    // Setup paths - use DATA_DIR env var or default to ./data
    let data_dir = std::env::var("DATA_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("./data"));
    let models_dir = data_dir.join("models");
    
    tracing::info!("Using data directory: {}", data_dir.display());
    
    // Ensure directories exist
    fs::create_dir_all(&models_dir).await?;
    
    // Load coins from JSON
    let coins = load_coins(&data_dir).await?;
    
    // Create app state
    let state = Arc::new(AppState {
        coins,
        models_dir: models_dir.clone(),
    });
    
    // Setup CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);
    
    // Build router
    let api_routes = Router::new()
        .route("/coins", get(list_coins))
        .route("/coins/{id}", get(get_coin))
        .route("/health", get(health));
    
    let app = Router::new()
        .nest("/api", api_routes)
        .nest_service("/api/models", ServeDir::new(&models_dir))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state);
    
    // Run server
    let addr = "0.0.0.0:3002";
    tracing::info!("Starting server on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    
    Ok(())
}
