# Nova Work - Guía de Testing

## Configuración de Testing

Nova Work usa Jest y React Testing Library para tests unitarios y de integración.

### Instalación

\`\`\`bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
\`\`\`

### Ejecutar Tests

\`\`\`bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar un test específico
npm test -- navigation.test.tsx
\`\`\`

## Estructura de Tests

\`\`\`
__tests__/
├── components/          # Tests de componentes UI
│   ├── navigation.test.tsx
│   ├── button.test.tsx
│   ├── global-search.test.tsx
│   └── ...
├── pages/              # Tests de páginas completas
│   ├── auth.test.tsx
│   └── ...
├── lib/                # Tests de utilidades
│   ├── auth.test.ts
│   └── ...
└── integration/        # Tests de integración
    └── ...
\`\`\`

## Tipos de Tests

### 1. Component Tests

Tests para componentes individuales de UI.

\`\`\`tsx
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
})
\`\`\`

### 2. Integration Tests

Tests que verifican la interacción entre múltiples componentes.

\`\`\`tsx
import { render, screen, fireEvent } from "@testing-library/react"
import AuthPage from "@/app/auth/page"

describe("Auth Flow", () => {
  it("allows user to login", async () => {
    render(<AuthPage />)
    // Simula el flujo completo de login
  })
})
\`\`\`

### 3. Utility Tests

Tests para funciones helper y utilidades.

\`\`\`tsx
import { isAuthenticated } from "@/lib/auth"

describe("Auth utilities", () => {
  it("returns false for unauthenticated user", () => {
    expect(isAuthenticated()).toBe(false)
  })
})
\`\`\`

## Mejores Prácticas

### 1. Usa data-testid solo cuando sea necesario
Prefiere selectores semánticos como `getByRole`, `getByLabelText`, `getByText`.

\`\`\`tsx
// ✅ Bueno
screen.getByRole("button", { name: /submit/i })

// ❌ Evitar
screen.getByTestId("submit-button")
\`\`\`

### 2. Mock solo lo necesario
No mockees todo el módulo si solo necesitas una función.

\`\`\`tsx
// ✅ Bueno
jest.spyOn(api, "fetchUser").mockResolvedValue(mockUser)

// ❌ Evitar mockear todo
jest.mock("@/lib/api")
\`\`\`

### 3. Usa async/await para operaciones asíncronas

\`\`\`tsx
it("loads data correctly", async () => {
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument()
  })
})
\`\`\`

### 4. Limpia después de cada test

\`\`\`tsx
afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})
\`\`\`

## Coverage Goals

- **Componentes UI críticos**: 80%+
- **Lógica de negocio**: 90%+
- **Utilidades**: 95%+
- **Páginas**: 70%+

## Tests Críticos Implementados

- ✅ Navigation component
- ✅ Button component
- ✅ Auth utilities
- ✅ Global Search
- ✅ Auth Page

## Tests Pendientes

- ⏳ Feed page filtering
- ⏳ Job posting form validation
- ⏳ Profile editing
- ⏳ Messaging system
- ⏳ Payment integration

## Debugging Tests

### Ver output detallado

\`\`\`bash
npm test -- --verbose
\`\`\`

### Debug en VS Code

Agrega esta configuración a `.vscode/launch.json`:

\`\`\`json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
\`\`\`

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
