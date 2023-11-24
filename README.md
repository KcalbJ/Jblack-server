# Northcoders News API




## Getting Started

1. **Clone this repository to your local machine.**

   ```bash
   git clone https://github.com/KcalbJ/Nc-news.git
   ```

2. **Navigate to the project directory.**

   ```bash
   cd Nc-news
   ```

3. **Install dependencies.**

   ```bash
   npm install
   ```

4. **Create the necessary environment files.**

   ```bash
   touch .env.test .env.development
   ```

5. **Open each `.env` file and add the following:**

   ```env
   PGDATABASE=database_name
   ```

   Make sure to replace `database_name` with the correct database name for the corresponding environment. (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

6. **Seed the local database.**

   ```bash
   npm run seed
   ```

7. **Run tests to ensure everything is set up correctly.**

   ```bash
   npm test
   ```

8. **Start the development server.**

   ```bash
   npm start
   ```

## API Endpoints
- **GET /api**: Get all endpoints.
- **GET /api/topics**: Get all topics.
- **GET /api/articles/:article_id**: Get an article by its ID.
- **GET /api/articles**: Get all articles.
- **PATCH /api/articles/:article_id**: Update an article's details.
- **GET /api/articles/:article_id/comments**: Get comments for a specific article.
- **POST /api/articles/:article_id/comments**: Post a new comment for an article.
- **DELETE /api/comments/:comment_id**: Delete a comment by its ID.
- **PATCH /api/comments/:comment_id**: Update a comment's votes.
- **GET /api/users**: Get all users.
- **GET /api/users/:username**: Get a user by their username.
- **PATCH /api/users/:username**: Update a user's votes.

## Minimum Requirements

- Node.js version 20.6.1
- PostgreSQL version 14.9
```

