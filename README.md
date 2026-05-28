# LinkedIn Automation System

> AI-powered LinkedIn data collection, NLP annotation, lead scoring, and ad targeting dashboard.

Built as an assignment demo showcasing a full LinkedIn automation workflow — from raw post extraction to audience segmentation for marketing campaigns.

---

## Features

| Module | Description |
|--------|-------------|
| 📊 Dashboard | Weekly engagement trends, intent distribution, lead metrics |
| 📝 Posts | Extracted LinkedIn posts with NLP labels (intent, sentiment, industry) |
| 👤 Lead Profiles | Scored and ranked profiles ready for outreach |
| 🤖 NLP Annotations | Full annotation pipeline explanation with taxonomy |
| 🎯 Ad Targeting | Campaign manager with audience segment builder |

## Tech Stack

- **React 18** — UI framework
- **Recharts** — Data visualization (area, pie, bar charts)
- **Lucide React** — Icon system
- **GitHub Pages** — Deployment

---

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/linkedin-automation-system.git
cd linkedin-automation-system

# Install dependencies
npm install

# Start development server
npm start
```

App runs at `http://localhost:3000`

---

## Deployment to GitHub Pages

### 1. Update `package.json`

Set the `homepage` field to your GitHub Pages URL:

```json
"homepage": "https://YOUR_USERNAME.github.io/linkedin-automation-system"
```

### 2. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Add deploy scripts (already in package.json)

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Enable GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Set source to **`gh-pages` branch**
3. Your app will be live at `https://YOUR_USERNAME.github.io/linkedin-automation-system`

---

## Project Structure

```
src/
├── App.js              # Root component with navigation
├── index.js            # React entry point
├── data.js             # Mock data (posts, profiles, charts)
└── components/
    ├── Dashboard.js    # Analytics overview with charts
    ├── Posts.js        # Post feed with NLP tags + filters
    ├── Profiles.js     # Lead profiles table with scoring
    ├── Annotations.js  # NLP pipeline + taxonomy
    └── AdTargeting.js  # Campaign manager + audience segments
```

---

## System Architecture

```
LinkedIn Data Sources
        ↓
  Data Extraction Layer (API / Scraper)
        ↓
  Preprocessing (Tokenization, Cleaning)
        ↓
  NLP Engine (Intent · Sentiment · Industry)
        ↓
  Relevance Scoring (0–100)
        ↓
  Dashboard / CRM Export / Ad Targeting
```

---

## License

MIT — free to use for educational purposes.
