# Full-Stack Evaluator Submission

## Backend

- Add Database connection
- Migrate database
- User Controller
  - POST `/users` : create user
- Task Controller
  - POST `/tasks` : create task
  - GET `/tasks` : list tasks with user info
  - PATCH `/tasks/{id}` : update `isDone` status

## Frontend

- Axios configured with `.env` API base URL
- Display list of tasks with user email, title, and status
- Select user email
- Add task input and button
- Checkbox updates task status in real-time
- Add delete Button

## Known Limitations / Missing

= Redux not implemented
