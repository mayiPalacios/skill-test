# Real-Time Stock Tracker

## steps installation
- npm install
- npm run dev

# Project Description
### Objective: Develop a React (TypeScript) application that interfaces with Finnhub Stock APIs to display real-time stock information.

## Key Components

### Left Form:
- A user interface for stock selection via a dropdown menu.
An input field to set up price alerts for individual stocks.
### Top Cards:
Display widgets that present the stock's current value and its percentage change.
Visual indicators that change color based on the stock's performance relative to the alert price: red for below and green for above.
### Stock Value Graph:
A graphical component plotting the value of monitored stocks in USD.
Advanced Implementation for PWA:
Transition the application to a Progressive Web App for enhanced performance and offline capabilities.
Manage WebSocket connections in the background, storing data in local storage for quick retrieval.
Integrate web push notifications to alert users when stock prices drop below set thresholds.

### View Project on Vercel
https://skill-test-xi.vercel.app/

## Project Architecture
Folder Structure

The project follows a feature-centric modular structure that facilitates scalability and maintenance.

    src: Contains all the source code of the application.
        api: Functions for communication with WebSockets and the Finnhub API, managing real-time data subscriptions.
        assets: Static resources such as images and global styles.
        components: Reusable React components.
            cards: Specific components for displaying stock information cards (TopCards).
            form: Components related to user forms.
            graph: Components for data visualization, such as stock charts (StockChart).
        context: React contexts for managing global application state.
        firebase: Configuration and utilities for Firebase integration in the application.
        interfaces: TypeScript definitions for typing throughout the application.
        pages: Page components that use other components to form complete screens.
        style: Style sheets for the application.

Core Components

    LeftForm: Acts as the input form for stock data subscriptions. Uses context to manage global state and persists data in localStorage.
    TopCards: Displays key information of subscribed stocks. Performs calculations and manages local state.
    StockChart: Visualizes historical and current stock data in a chart format.

State and Data

Global state is managed through the React Context API, providing centralized and reactive access to form data throughout the application. Local persistence is achieved using localStorage, ensuring user state is maintained between sessions.
Real-Time Communication

WebSockets are used for real-time bidirectional communication with the Finnhub API, allowing dynamic subscriptions and unsubscriptions to stock market data.
Types and Interfaces

TypeScript is used to define types and ensure code consistency and safety. Interfaces define data structures for API responses, form data, and stock data, facilitating integration and error handling.
Styles

Styles are managed at the component level for encapsulation and are complemented by global stylesheets for application-wide consistency.
Notifications

The project integrates Firebase for sending notifications, alerting users to significant changes in stock prices.
Security and Environment

Environment variables and security configurations are managed through .env files and Firebase configuration, ensuring that credentials and API keys are not exposed in the source code.

## Implemented Design Patterns

In this project, we have applied a variety of design patterns to achieve an efficient and maintainable code structure:

- **Module Pattern**: Each folder within `src` acts as a module, encapsulating related functionalities such as components, API connections, and state management. This promotes high cohesion and low coupling among the various parts of the project.

- **Observer Pattern**: WebSockets are utilized to implement the Observer Pattern, enabling our components to subscribe to and react to real-time stock market data. The component state is updated in response to new data streams.

- **Container/Presentational Components Pattern**: Components that handle state and logic (`LeftForm`) are separated from those dedicated to presentation (`TopCards`, `StockChart`). This division enhances the reusability and testability of the presentational components and ensures a more predictable state management.

- **Context API Pattern**: React's Context API is used to manage global state across the application, eliminating the need for prop drilling. This simplifies data flow and enhances component performance by reducing unnecessary renders.

- **Singleton Pattern**: A unique setup for Firebase and WebSocket ensures a single instance of each, essential for preventing multiple unwanted instances and streamlining connection management.

- **State Pattern**: React's state hooks enable components to alter their behavior in response to internal state changes, showcasing the State Pattern in managing component lifecycles and rendering logic.

These patterns are intentionally utilized to enhance the clarity of the codebase, the scalability of the application, and its maintainability over time.
