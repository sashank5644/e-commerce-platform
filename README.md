# [E-Shop](https://e-commerce-platform-sable.vercel.app/)

# Project Description

The Scalable Microservices E-Commerce Platform is a full-stack web application built with a microservices architecture to provide a seamless online shopping experience. 
The platform includes independently scalable services for product management, shopping cart, order processing, and payment handling. It enables users to browse products, 
manage their cart, place orders, and process payments securely while offering real-time inventory updates with Redis caching. With JWT-based authentication, users can 
securely sign up, log in, and manage their purchases, while an admin dashboard allows administrators to oversee products and orders. The frontend is deployed on Vercel, 
and the backend microservices run on Render, ensuring scalability and cost-effective deployment. This project demonstrates expertise in microservices architecture, real-time systems, and full-stack development.

# Tech Stack

* Frontend
  * React (Vite) – Component-based UI development

* Backend Microservices
  * Auth Service – Manages user authentication and JWT-based authorization
  * Cart Service – Handles shopping cart operations (add, update, remove items)
  * Order Service – Manages order creation, tracking, and status updates
  * Payment Service – Processes payments (mock payment gateway integration)
  * Product Service – Handles product catalog, details, and inventory

* Technologies Used:
  * Node.js with Express – RESTful API development
  * JWT – User authentication and session management
  * MongoDB (Atlas) – NoSQL database for users, products, and orders
  * Redis – Caching for real-time inventory updates

* Deployment:
  * Vercel – Frontend hosting
  * Render – Backend microservices deployment
