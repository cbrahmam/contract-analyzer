# Contributing to ContractIQ

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/cbrahmam/contract-analyzer.git
   cd contract-analyzer
   ```

2. **Backend**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   cp .env.example .env
   uvicorn backend.main:app --reload
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Run tests**
   ```bash
   python -m pytest backend/tests/ -v
   cd frontend && npm run lint
   ```

## Pull Request Process

1. Fork the repo and create a feature branch from `master`
2. Write tests for new functionality
3. Ensure all tests pass and linting is clean
4. Keep PRs focused on a single feature or fix
5. Write a clear PR description explaining what and why

## Code Style

- **Python**: Follow PEP 8, use type hints
- **JavaScript/React**: ESLint config is provided, use functional components
- **CSS**: Use Tailwind utility classes

## Reporting Issues

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS version if relevant
