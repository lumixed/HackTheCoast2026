# AwardScope

AwardScope is a technical financial aid intelligence platform designed to connect students with non-dilutive academic funding. By leveraging proprietary matching logic and generative AI architecture, AwardScope identifies high-probability scholarships and bursaries, streamlining the application process from discovery to submission.

## Core Features

### Precision Matching Engine
- **Real-Time Eligibility**: Instantly filters award databases based on GPA, faculty, academic year, and demographic profiles.
- **Probabilistic Scoring**: Categorizes opportunities into Optimal, High Probability, and Potential matches.
- **Noise Reduction**: Eliminates ineligible opportunities to focus on actionable funding.

### Essay Neural-Architect
- **Draft Blueprints**: Generates personalized essay structures, semantic hooks, and talking points.
- **Rubric Optimization**: Analyzes award criteria to suggest the most impactful narrative angles.
- **Zero Hallucination**: Grounded in student profile data and specific institutional requirements.

### Technical Editorial UI
- **Monochrome Aesthetic**: A high-contrast "Ink & Paper" design system optimized for clarity and reduced eye strain.
- **Data-Dense Layout**: A compact, efficient interface designed to present maximum context without excessive scrolling.
- **Fluent Interactions**: High-performance transitions and state management powered by Framer Motion.

---

## Technical Stack

### Frontend
- **React 18** (TypeScript)
- **Tailwind CSS** (Utility-first Design System)
- **Framer Motion** (Motion Orchestration)
- **Lucide React** (Vector Iconography)
- **Vite** (Build Infrastructure)

### Backend
- **Node.js & Express**
- **MongoDB** (Persistence Layer)
- **Google Gemini API** (Neural Processing)

### DevOps
- **Docker & Docker Compose** (Containerization & Orchestration)

---

## Deployment

### Prerequisites
- Docker Engine and Docker Compose installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tjindl/AwardScope.git
   cd AwardScope
   ```

2. **Configure Environment:**
   Create a `.env` file in the `Backend` directory with the following parameters:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Initialize Services:**
   ```bash
   docker-compose up --build
   ```

4. **Access Points:**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:3001`

---

## Methodology

1. **Source Selection**: Identify the target institution via the secure portal.
2. **Profile Ingestion**: Define academic and demographic parameters.
3. **Registry Match**: Real-time cross-referencing against the BC Student Awards Database.
4. **Execution Strategy**: Deploy AI-assisted blueprints for application drafting.

---

## Roadmap

- **Extended Registry**: Deployment pending for SFU, UVic, BCIT, and other institutions.
- **Persistence Layer**: Implementation of secure user vaults for profile persistence.
- **Chronos Engine**: Automated tracking and notification system for application windows.

---

## License
This project is open-source and available under the [MIT License](LICENSE).

---
Copyright © 2026 AwardScope Technical Resources
