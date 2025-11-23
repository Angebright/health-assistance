# Health Assistance

## Table of Contents
1. Overview
2. Core Features
3. Demo
4. Technologies Used
5. API Integration
6. Local Development Setup
7. Deployment Setup
8. Challenges & Solutions
9. Credits & Acknowledgments

---

## 1. Overview
Health assistance  is an interactive web application designed to help users better understand their daily well-being by analyzing reported symptoms, lifestyle habits, and personal health information.

Instead of offering medical diagnoses, the tool provides general wellness insights, lifestyle recommendations, and gentle guidance for improving overall health.


## 2. Core Features

### 2.1 Guided Symptom & Wellness Input
* Symptoms grouped into intuitive categories (e.g., **cold**, **Headache**, **Dizziness**, **Body pain**, **cough**).
* Searchable symptom and wellness factor database.
* Visual feedback for selected symptoms.

### 2.2 Personal Health & Lifestyle Profile
* Collects basic demographic information (**age, gender, height, weight**).
* Allows users to add medical history tags.
* Tracks medications and allergies.
* Captures lifestyle elements including **activity level, sleep patterns, and diet habits**.

### 2.3 AI-Powered Wellness Insights
* Uses an **External AI API** to analyze provided information.
* Identifies possible wellness patterns such as **stress, fatigue, dehydration, or lifestyle imbalance**.
* Offers **non-medical insights** based on symptom-habit correlations.

### 2.4 Personalized Lifestyle Recommendations
* Suggests habits to improve **sleep, hydration, nutrition, and energy levels**.
* Provides reminders and general wellness tips.
* Highlights situations where a **medical professional should be consulted**.

### 2.5 Responsive, Accessible Interface
* **Mobile-first** user interface.
* Step-by-step workflow with clear progress indicators.
* Designed for easy use on all devices.


## 3. Demo
| Item | Link |
| :--- | :--- |
| **Demo Video** | [demo link](demolink) |
| **Live Application** | [https://www.4ng3.tech](https://www.4ng3.tech) |


## 4. Technologies Used
* **Frontend:** **HTML** (structure), **CSS** (styling), **JavaScript** (functionality)
* **API Usage:** External AI API for processing wellness and symptom data from [https://rapidapi.com/categories](https://rapidapi.com/bilgisamapi-api2/api/ai-medical-diagnosis-api-symptoms-to-results/playground)
* **Deployment:** Hosted on **Nginx** servers and **HAProxy** used for load balancing.


## 5. API Integration
The application communicates with an AI-powered API (via **RapidAPI**) to process user inputs and generate wellness-oriented analysis.

Instead of diagnosing diseases, the API is used to interpret symptoms and lifestyle patterns, returning insights related to:
* Possible **stress indicators**.
* **Hydration** or **fatigue** patterns.
* **Lifestyle-related** wellness trends.
* General **non-medical recommendations**.

**API Documentation:** [https://rapidapi.com/bilgisamapi-api2/api/ai-medical-diagnosis-api-symptoms-to-results](https://rapidapi.com/bilgisamapi-api2/api/ai-medical-diagnosis-api-symptoms-to-results)


## 6. Local Development Setup
This is a fully **frontend-based** application.

##### Step 1. Clone the Repository
```bash
git clone https://github.com/Angebright/health-assistance.git
cd health-assistance
```
##### Step 2. Run the Application
* Open **`index.html`** in any browser.
* No backend setup required.


## 7. Deployment Setup

### 7.1 Prerequisites
Two web servers:
* **Web-01** and **Web-02**: (where nginx is installed, and I configured /etc/nginx/sites_available/default, this file is where I hosted my application for instance: I put all my files used to make application including; HTML, CSS, and JS, all were put inside this /var/www/html so that it can be accessed by visiting the IP_Address 

* **Load Balancer (lb-01)**: Through lb-01 (where haproxy is installed to distribute the requests through those two servers. And those were done through configuring an haproxy config file ( /etc/haproxy/haproxy.cfg ), So you can access it through linking up to the IP_address of this lb-01)



### 7.2 Domain
A domain used, was created from DotTech domain where I used to link up with the IP_Address so if you vist my domain you will get the same by visiting via IP_Address.

### 7.3 SSL Certificate
From lb-01 , I created a certificate using certbot, issued by Letsencrypt and signed by it. So, it can be secure as it is.


## 8. Challenges & Solutions

| Challenge | Solution |
| :--- | :--- |
| **API Rate Limitation** | The Free API tier has strict request limits. **Solution:** Considered upgrading to a higher-tiscalability. |


## 9. Credits & Acknowledgments
* AI-based wellness analysis powered by an API available on **RapidAPI**.
* Full documentation available at: [https://rapidapi.com/bilgisamapi-api2/api/ai-medical-diagnosis-api-symptoms-to-results](https://rapidapi.com/bilgisamapi-api2/api/ai-medical-diagnosis-api-symptoms-to-results)Visit the link above for it's documentation.





