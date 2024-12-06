# CreatorSuite Frontend

This is the frontend application for CreatorSuite, an AI-powered content creation and analytics platform.

## Features

- Content Generation with A/B Testing
- Social Media Management
- Analytics Dashboard
- Multi-platform Support
- Scheduling and Automation

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- Next.js 14
- TypeScript
- Material-UI
- React Query
- React Hook Form
- Recharts for data visualization
- NextAuth.js for authentication

## Project Structure

```
src/
├── app/                # Next.js app directory
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── services/          # API service functions
└── types/             # TypeScript type definitions
```

## Development

- Run `npm run lint` to check for linting issues
- Run `npm run build` to create a production build
- Run `npm start` to start the production server
- Run `npm test` to run the test suite

## Testing

We use React Testing Library and Vitest for testing. For detailed testing guidelines and best practices, see [TESTING_GUIDELINES.md](docs/TESTING_GUIDELINES.md).

Common testing commands:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT
