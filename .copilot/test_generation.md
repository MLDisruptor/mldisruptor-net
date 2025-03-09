# Test Generation Instructions

## General Guidelines
- Follow the principles of shift-left testing to identify and address issues early in the development process.
- Use ubiquitous language in plain language and describe the behavior of the system reflecting the domain model and business logic.
- Write tests that are clear, concise, and self-explanatory.
- Ensure that tests are repeatable and produce consistent results.
- Organize tests in a logical and maintainable structure.
- Follow the Four-Layer Model for testing (Specification, DSL, Protocol Drivers / System Stubs, System Under Test)
- Ensure that tests are isolated and do not depend on external systems or state.
- Prefer fast integration tests over end-to-end and unit tests.
- Write tests that include an internal DSL using a Given-When-Then format in the given programming language.
- Ensure that tests cover domain entities, value objects, aggregates, and repositories.
- Follow the Red-Green-Refactor cycle to write tests before implementing code.
- Refactor code to improve design and maintainability while keeping tests green.
- Use xUnit and FakeItEasy for writing unit tests for C#.
- Use Jest for writing unit tests for Node.js and TypeScript.

## GitHub Actions
- Write tests for custom GitHub Actions to ensure they behave as expected.
- Use the `act` tool to run GitHub Actions locally for testing.
- Ensure that workflows include steps for running tests and reporting results.