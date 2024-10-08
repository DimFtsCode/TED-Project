
# Professional Networking Application

This project is a professional networking web application designed to help professionals manage their profiles, connect with others who share similar interests, and engage through articles, advertisements, and discussions. The application offers distinct interfaces and functionalities for two types of users: **Administrators** and  **Professionals** .

## Key Features

### User Roles:

* **Administrator** : Manages users and roles, and exports user information.
* **Professional** : Manages their professional profile, connects with other users, posts and interacts with articles, and applies for job opportunities.

### Professional Features:

* Create and manage articles.
* Post professional experience, education, and skills.
* Make and accept connection requests.
* Post and respond to job advertisements.
* View and comment on articles posted by connected professionals.
* Chat with their network through prvate discussions.
* Receive personalized job and article recommendations.

### Real-Time Communication:

* Built using **SignalR** to support real-time chat, notifications, and interactions with articles and friend requests.

### Personalized Recommendations:

* Utilizes a **Matrix Factorization** algorithm to deliver personalized job advertisements and article recommendations based on the user’s interaction history.

## Technologies Used

### Backend:

* Developed in **C#** using controllers and services for business logic.
* Core data entities include users, jobs, articles, advertisements, and connections.

### Frontend:

* Built using **React** to create a responsive and dynamic user interface tailored for both administrators and professionals.
* Supports real-time updates and notifications.

### Database:

* Built with **EntityFrameworkCore**, which manages the database schema and interactions with the application's data models.

* Stores data for user profiles, connections, connection requests, articles, jobs, messages, interactions, notifications, and the vectors required for the recommendation system.
* A population script is available to simulate realistic data for testing and development.
