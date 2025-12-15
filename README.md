# KarigarAI: Empowering Indian Artisans

KarigarAI is a specialized digital platform designed to support Indian artisans (Karigars) by providing access to banking information, government schemes, and AI-powered tools for marketing and business growth.

## Project Overview

This application serves as a bridge between traditional craftsmanship and modern digital commerce, addressing key challenges such as financial literacy, market access, and storytelling.

### Key Features

1.  **AI Chat Assistant**
    *   **Hybrid Intelligence**: Combines a local Knowledge Base (KB) for instant answers on common topics (KYC, Loans, Government Schemes) with a powerful cloud-based AI (Meta Llama 3.2) for complex queries.
    *   **Multilingual Support**: Fully capable of conversing in both English and Hindi.
    *   **Voice Input**: Integrated speech-to-text functionality for accessible interaction.

2.  **AI Story Generator**
    *   **Automated Marketing**: Generates professional, emotional product descriptions based on artisan inputs (craft, material, inspiration).
    *   **Language Options**: Creates content in English or Hindi to suit target markets.

3.  **Knowledge Resource Center**
    *   **Banking**: Information on savings accounts, interest rates, and loan schemes.
    *   **Government Schemes**: Details on initiatives like PM Vishwakarma.
    *   **Compliance**: Guidance on GST registration and export procedures.

## Technical Architecture

*   **Frontend**: React (Vite)
*   **UI Framework**: Material UI (MUI)
*   **AI Integration**: HuggingFace Inference Router (Llama-3.2-3B-Instruct)
*   **Voice API**: Web Speech API
*   **Proxy Configuration**: Vite server proxy to handle API requests and avoid CORS issues.

## Setup Instructions

1.  **Prerequisites**
    *   Node.js (v18 or higher)
    *   npm

2.  **Installation**
    ```str
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your HuggingFace token:
    ```str
    VITE_HF_TOKEN=hf_your_token_here
    ```

4.  **Running the Application**
    ```str
    npm run dev
    ```
    The application will launch at `http://localhost:5173`.

## Usage Guide

*   **Chat**: Click on the 'Chat with AI' button to open the assistant. Use the language toggle to switch between English and Hindi. Click the microphone icon for voice input.
*   **Story Generator**: Navigate to the Story Generator tab. Fill in the details about your craft and click 'Generate AI Story'.

## License

This project is licensed for educational and developmental use.
