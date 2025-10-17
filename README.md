# Quiz Builder Project

This project is a full-stack Quiz Builder application with a **Next.js frontend** and an **Express + SQLite backend**.  
It allows you to create quizzes with multiple question types, view quizzes, and delete them.

---

## **1. Project Structure**

- frontend/ - Next.js (App Router) + Tailwind CSS
- backend/ - Express server + SQLite + Prisma

---

## **2. Environment Configuration**

Both frontend and backend use environment variables.

### **Backend**

Create a `.env` file in `backend/`:

```env
DATABASE_URL="file:./dev.db"
```

DATABASE_URL → Path to SQLite database file.

### **Frontend**

Create a `.env` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

NEXT_PUBLIC_API_URL → Backend URL.

## **3. Running the Project**

### **Backend**

#### **1. Install dependencies:**

```bash
cd backend
npm install
```

#### **2. Set up database:**

```bash
npx prisma migrate dev --name init
```

#### **3. Start server in development:**

```bash
npm run dev
```

Backend will be available at http://localhost:4000/api

### **Frontend**

#### **1. Install dependencies:**

```bash
cd frontend
npm install
```

#### **2. Start development server:**

```bash
npm run dev
```

Frontend will be available at http://localhost:3000

## **4. Creating a Sample Quiz**

1. Open the frontend in your browser: http://localhost:3000.

2. Go to the Create Quiz page: /quizzes/create.

3. Fill out the form:

   - Quiz Title

   - Add one or more questions:

     - Boolean → True/False

     - Input → Short text answer

     - Checkbox → Multiple choice with several correct answers

4. Submit the form.

5. The quiz will now appear on the Quizzes List page (/quizzes).
