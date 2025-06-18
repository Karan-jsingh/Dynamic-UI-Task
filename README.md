# Dynamic UI Angular App

This project dynamically generates a tabbed user interface from JSON configuration. It includes a list view and multiple form views across tabs, with user data stored in session storage. Designed for professional-level structure, testability, and modularity.

# Features

-  Dynamic tabset based on JSON schema
-  Tab 1: User list in a table
-  Tab 2+: Editable forms per user
-  Save data to `sessionStorage`
-  Toggle to show/hide empty fields
-  Unit tests included for key services and components
-  Modular structure using services and models


#  Prerequisites

- **Node.js** (LTS recommended): [Download](https://nodejs.org/)
- **Angular CLI**: Install via  
  ```bash
  npm install -g @angular/cli
  ```
- **Recommended Node Version**: Even-numbered LTS version (e.g. `v20.x.x`)
- **Package Manager**: `npm` (comes with Node.js)


# Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd dynamic-ui
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Mock Data**
   Ensure your `assets` folder contains:
   - `user-schema.json`: Defines form layout and table columns
   - `mock-users.json`: Example user list data


#  Run the Application

```bash
ng serve
```

Then navigate to:  
`http://localhost:4200/`

---

#  Run Tests

```bash
ng test
```

This will open a browser running Karma test runner.

# Styling

The app uses clean SCSS styles with a modern UI feel. Material styling is **not** required — buttons, inputs, and layout are all styled using CSS classes.

# What's Included

- Angular standalone components
- JSON-driven schema parsing
- Session storage persistence
- Table interaction (select row → populate form)
- Toggle for hiding/showing empty fields
- `user.service.spec.ts` and `user-manager.component.spec.ts` with 15+ unit tests
- Fully modular and scalable architecture

#  Notes

- This app is designed for frontend-only operation (no backend required).
- Switching out the `user-schema.json` or `mock-users.json` lets you reuse the UI with different form layouts or data.


