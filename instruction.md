# Development Guidelines

## Project Principles

- Preserve existing functionality at all times.
- Do not modify working features unless absolutely necessary.
- Make changes incrementally and keep the application stable.
- Test after every major change to confirm behavior remains correct.

## Architecture and Design

- Follow a modular architecture and keep related logic organized.
- Prefer small, focused functions and classes over large monolithic blocks.
- Build reusable components whenever possible.
- Avoid unnecessary code duplication by extracting shared logic.
- Keep the codebase maintainable and easy to extend.

## Python Style

- Follow Python PEP 8 guidelines for formatting and structure.
- Use clear, descriptive variable and function names.
- Write readable code with consistent indentation and spacing.
- Keep functions focused on a single responsibility.

## Flask Best Practices

- Use Flask patterns that are clear and maintainable.
- Keep route handlers simple and delegate logic to helper functions where appropriate.
- Avoid introducing unnecessary global state.
- Ensure request handling remains predictable and easy to debug.

## User Interface

- Build a responsive user interface that works well on different screen sizes.
- Consider accessibility by using clear labels, meaningful structure, and readable content.
- Keep interactions intuitive and consistent for users.

## Maintenance and Quality

- Write maintainable code that is easy for future contributors to understand.
- Favor clarity over cleverness.
- Document significant behavior when it improves maintainability.
- Review changes carefully to ensure they do not break existing functionality.
