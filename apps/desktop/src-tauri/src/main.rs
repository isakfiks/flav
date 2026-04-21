#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{Client, Method};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Instant;
use tauri::Window;
use url::Url;

const NETWORK_ERROR_FALLBACK: &str = "Could not send request.";

#[derive(Debug, Deserialize)]
struct ArcDesktopRequestPayload {
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: Option<String>,
}

#[derive(Debug, Serialize)]
struct ArcDesktopResponsePayload {
    ok: bool,
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
    body: String,
    time: u64,
    size: u64,
    error: Option<String>,
}

impl ArcDesktopResponsePayload {
    fn error(started_at: Instant, message: String) -> Self {
        Self {
            ok: false,
            status: 0,
            status_text: "Error".to_string(),
            headers: HashMap::new(),
            body: String::new(),
            time: started_at.elapsed().as_millis() as u64,
            size: 0,
            error: Some(message),
        }
    }
}

fn has_protocol(value: &str) -> bool {
    let mut chars = value.chars();
    let Some(first) = chars.next() else {
        return false;
    };

    if !first.is_ascii_alphabetic() {
        return false;
    }

    for ch in chars {
        if ch == ':' {
            return true;
        }

        if matches!(ch, '/' | '?' | '#') {
            return false;
        }

        if !(ch.is_ascii_alphanumeric() || matches!(ch, '+' | '-' | '.')) {
            return false;
        }
    }

    false
}

fn is_localhost_url(value: &str) -> bool {
    let authority = value.split('/').next().unwrap_or(value);

    if authority.starts_with("[::1]") {
        return true;
    }

    let host = authority.split(':').next().unwrap_or(authority).to_ascii_lowercase();

    matches!(host.as_str(), "localhost" | "127.0.0.1" | "0.0.0.0")
}

fn normalize_request_url(raw_url: &str) -> Result<String, String> {
    let value = raw_url.trim();

    if value.is_empty() {
        return Err("Request URL is required.".to_string());
    }

    if has_protocol(value) {
        return Url::parse(value)
            .map(|url| url.to_string())
            .map_err(|error| error.to_string());
    }

    if is_localhost_url(value) {
        return Url::parse(&format!("http://{value}"))
            .map(|url| url.to_string())
            .map_err(|error| error.to_string());
    }

    Url::parse(&format!("https://{value}"))
        .map(|url| url.to_string())
        .map_err(|error| error.to_string())
}

fn get_network_error_message(message: &str) -> String {
    let normalized = message.to_ascii_lowercase();

    if normalized.contains("fetch failed")
        || normalized.contains("failed to fetch")
        || normalized.contains("networkerror")
        || normalized.contains("econn")
        || normalized.contains("enotfound")
        || normalized.contains("eai_again")
        || normalized.contains("timed out")
        || normalized.contains("socket hang up")
    {
        return NETWORK_ERROR_FALLBACK.to_string();
    }

    message.to_string()
}

#[tauri::command]
async fn send_request(payload: ArcDesktopRequestPayload) -> ArcDesktopResponsePayload {
    let started_at = Instant::now();

    let target_url = match normalize_request_url(&payload.url) {
        Ok(url) => url,
        Err(message) => return ArcDesktopResponsePayload::error(started_at, message),
    };

    let method = match Method::from_bytes(payload.method.as_bytes()) {
        Ok(method) => method,
        Err(_) => {
            return ArcDesktopResponsePayload::error(
                started_at,
                "Unsupported HTTP method.".to_string(),
            )
        }
    };

    let client = Client::new();
    let mut request = client.request(method.clone(), target_url);

    for (key, value) in &payload.headers {
        request = request.header(key, value);
    }

    if let Some(body) = payload.body {
        if !body.is_empty() && !matches!(method, Method::GET | Method::HEAD) {
            request = request.body(body);
        }
    }

    let response = match request.send().await {
        Ok(response) => response,
        Err(error) => {
            let message = get_network_error_message(&error.to_string());
            return ArcDesktopResponsePayload::error(started_at, message);
        }
    };

    let status = response.status();
    let status_code = status.as_u16();
    let status_text = status.canonical_reason().unwrap_or("").to_string();

    let headers = response
        .headers()
        .iter()
        .filter_map(|(key, value)| {
            value
                .to_str()
                .ok()
                .map(|header_value| (key.to_string(), header_value.to_string()))
        })
        .collect::<HashMap<_, _>>();

    let body = match response.text().await {
        Ok(text) => text,
        Err(error) => {
            return ArcDesktopResponsePayload::error(started_at, error.to_string());
        }
    };

    ArcDesktopResponsePayload {
        ok: true,
        status: status_code,
        status_text,
        headers,
        size: body.as_bytes().len() as u64,
        body,
        time: started_at.elapsed().as_millis() as u64,
        error: None,
    }
}

#[tauri::command]
fn window_minimize(window: Window) -> Result<(), String> {
    window.minimize().map_err(|error| error.to_string())
}

#[tauri::command]
fn window_maximize_toggle(window: Window) -> Result<bool, String> {
    let is_maximized = window.is_maximized().map_err(|error| error.to_string())?;

    if is_maximized {
        window.unmaximize().map_err(|error| error.to_string())?;
    } else {
        window.maximize().map_err(|error| error.to_string())?;
    }

    window.is_maximized().map_err(|error| error.to_string())
}

#[tauri::command]
fn window_is_maximized(window: Window) -> Result<bool, String> {
    window.is_maximized().map_err(|error| error.to_string())
}

#[tauri::command]
fn window_close(window: Window) -> Result<(), String> {
    window.close().map_err(|error| error.to_string())
}

#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    let trimmed = url.trim();

    if trimmed.is_empty() {
        return Err("URL is required.".to_string());
    }

    webbrowser::open(trimmed)
        .map(|_| ())
        .map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_request,
            window_minimize,
            window_maximize_toggle,
            window_is_maximized,
            window_close,
            open_external
        ])
        .run(tauri::generate_context!())
        .expect("error while running flav desktop app");
}
