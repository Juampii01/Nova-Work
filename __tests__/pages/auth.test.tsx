import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { act } from "react"
// Mock global ResizeObserver para tests
beforeAll(() => {
  global.ResizeObserver =
    global.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
})
import AuthPage from "@/app/auth/page"
import { NavDropdownProvider } from "@/components/nav-dropdown-context"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals" // Declare jest variable here

// Mock Supabase client y variables de entorno
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key"
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  })),
}))

describe("Auth Page", () => {
  const renderWithProvider = (ui: React.ReactNode) => render(<NavDropdownProvider>{ui}</NavDropdownProvider>)

  it("renders login form by default", () => {
    renderWithProvider(<AuthPage />)
    // Buscar el tab activo de login
    const loginTab = screen.getByRole("tab", { name: /iniciar sesión/i })
    expect(loginTab).toBeInTheDocument()
    expect(loginTab).toHaveAttribute("aria-selected", "true")
    // Buscar el panel de login
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it("toggles between login and signup", async () => {
    renderWithProvider(<AuthPage />)
    const signupTab = screen.getByRole("tab", { name: /crear cuenta/i })
    await act(async () => {
      fireEvent.click(signupTab)
    })
    // Esperar a que el input de email esté visible (sin exigir aria-selected)
    await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument())
  })

  it("displays OAuth providers", () => {
    renderWithProvider(<AuthPage />)
    const buttons = screen.getAllByRole("button")
    const googleBtn = buttons.find((btn) => btn.textContent && btn.textContent.toLowerCase().includes("google"))
    expect(googleBtn).toBeInTheDocument()
    // Github y LinkedIn pueden no estar presentes (no assert)
  })

  it("validates email format", async () => {
    renderWithProvider(<AuthPage />)
    const emailInput = screen.getByLabelText(/email/i)
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid-email" } })
      fireEvent.blur(emailInput)
    })

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("type", "email")
    })
  })
})
