# Frontend Testing Guidelines

## UI Component Testing Best Practices

### Material-UI Component Testing

#### 1. Component Text and Labels
- Always use the **exact** text content as defined in the component
- For dynamic text that appears multiple times, use `getAllByText` instead of `getByText`
- Example:
  ```typescript
  // ❌ Bad - Using outdated or approximate text
  getByText('Dashboard')
  
  // ✅ Good - Using exact component text
  getByText('Overview')
  
  // ✅ Good - Handling multiple instances
  getAllByText('CreatorSuite')
  ```

#### 2. Material-UI Class Names and Selectors
- Check Material-UI class names on the correct DOM elements
- Pay attention to the component hierarchy when testing styled elements
- Example:
  ```typescript
  // ❌ Bad - Wrong element
  expect(getByRole('listitem')).toHaveClass('Mui-selected')
  
  // ✅ Good - Correct element
  expect(within(getByRole('listitem')).getByRole('button')).toHaveClass('Mui-selected')
  ```

#### 3. Hook Mocking
- Always mock Material-UI hooks that affect rendering logic
- Common hooks that need mocking:
  - `useMediaQuery` for responsive design
  - `useTheme` for theme-dependent components
- Example:
  ```typescript
  // In test-utils.tsx
  vi.mock('@mui/material/useMediaQuery', () => ({
    default: () => false, // or true based on test needs
  }))
  ```

#### 4. Query Methods
Choose the appropriate query method based on the use case:
- `getByText` - When element must exist and is unique
- `getAllByText` - When multiple elements may exist
- `queryByText` - When element might not exist
- `findByText` - When element may appear asynchronously

### Test Setup

#### 1. Using test-utils.tsx
Always use the custom render function from test-utils.tsx which provides:
- Material-UI theme provider
- Proper component mocking
- Common test utilities

```typescript
import { render } from '../../test/test-utils'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<MyComponent />)
    // ... test assertions
  })
})
```

#### 2. Component Mocking
When mocking Material-UI components:
- Mock only what's necessary
- Preserve essential props and behaviors
- Handle common props like `selected`, `disabled`, etc.

Example in test-utils.tsx:
```typescript
vi.mock('@mui/material', () => ({
  ListItemButton: ({ children, selected, ...props }) => (
    <button
      className={selected ? 'Mui-selected' : ''}
      {...props}
    >
      {children}
    </button>
  ),
  // ... other component mocks
}))
```

### Common Pitfalls to Avoid

1. **Prop Validation**
   - Don't ignore prop-type warnings in tests
   - Mock all required props for components

2. **Async Operations**
   - Use `findBy` queries for elements that appear after data loading
   - Properly wait for state updates

3. **Event Handling**
   - Use `userEvent` over `fireEvent` for better interaction simulation
   - Wait for all effects and state updates after events

4. **Theme Dependencies**
   - Don't assume theme values in tests
   - Mock theme consistently across all tests

## Utility Testing

### API Service Tests
- Mock external API calls
- Test error handling scenarios
- Validate request/response formats

### State Management Tests
- Test state transitions
- Verify action creators and reducers
- Mock external dependencies

## Best Practices for All Tests

1. **Isolation**
   - Each test should be independent
   - Clean up after each test
   - Don't share state between tests

2. **Readability**
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern
   - Keep tests focused and simple

3. **Maintenance**
   - Update tests when component behavior changes
   - Remove obsolete tests
   - Keep test files organized and well-documented

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Contributing New Tests

When adding new tests:
1. Follow the patterns in existing test files
2. Use the custom render function from test-utils.tsx
3. Add comments for complex test scenarios
4. Update this guide if you discover new patterns or issues
