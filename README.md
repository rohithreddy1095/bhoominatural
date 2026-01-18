# Bhoomi Natural Farms - Website Prototype

This repository contains a **minimalistic, single-page website prototype** for Bhoomi Natural Farms, built to showcase their sustainable farming projects across India.

## 🚀 Quick Start

This is a static HTML website with no complex build steps.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/bhoominatural/bhoominatural.git
    cd bhoominatural
    ```

2.  **Open the website**:
    Simply open the `index.html` file in your modern web browser.
    *   **Mac**: `open index.html`
    *   **Linux**: `xdg-open index.html`
    *   **Windows**: Double-click `index.html`

## 🏗️ Architecture

-   **Frontend**: Plain HTML5, CSS (via Tailwind CSS CDN for prototyping speed), and Vanilla JavaScript.
-   **Data Source**: The website dynamically loads project data from `refs/youtube/analysis/locations.json`.
-   **Design**: Minimalistic aesthetic focused on readability and "Earth" tones (Green, Stone, Amber).
-   **Icons**: [Lucide Icons](https://lucide.dev/) (via CDN).

## 📂 Key Files

-   `index.html`: The main entry point containing structure, styles, and logic.
-   `refs/youtube/analysis/locations.json`: The "database" file containing grouped video projects.
-   `refs/youtube/analysis/refine_data.py`: A Python utility script used to clean and structure the raw YouTube data for the website.

## 🛠️ Data Pipeline

To update the website content with new videos:

1.  Update `refs/youtube/videos.json` (Raw data).
2.  Run the analysis scripts (if applicable) to re-generate `locations.json`.
3.  Refresh `index.html` to see changes immediately.
