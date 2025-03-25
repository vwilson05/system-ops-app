# Grocery Inventory System

A full-stack web application for managing grocery inventory, sales, and orders. This app is built with a FastAPI back end, a Vite/React front end, and PostgreSQL as the database. The application includes features such as inventory tracking, sales analytics, pricing adjustments, and demand predictions.

This repository also contains configurations for dockerizing the app for local development and cloud deployment.

## Features

- **Inventory Management:** Track products, quantities, shelf life, and reorder points across multiple locations.
- **Sales & Order Tracking:** Record sales transactions and purchase orders, and analyze sales trends.
- **Pricing Adjustments & Demand Prediction:** Generate recommendations for pricing adjustments and predict demand based on historical data and simulated external events.
- **Responsive UI:** A modern, responsive interface built with React and Ant Design.
- **Containerization:** Docker and Docker Compose configurations for seamless deployment to cloud infrastructure.

---

## Architecture

- **Back End:** Built with [FastAPI](https://fastapi.tiangolo.com/) and SQLAlchemy for ORM. Exposes RESTful endpoints for products, inventory, sales, orders, etc.
- **Front End:** Developed with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/), using Ant Design for UI components.
- **Database:** PostgreSQL is used for persistent storage.
- **Containerization:** Docker is used for containerizing the application, with Docker Compose orchestrating multi-container deployments.
