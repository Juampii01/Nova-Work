import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AuthPage from "@/app/auth/page"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals" // Declare jest variable here

// Mock Supabase client
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
  it("renders login form by default", () => {
    render(<AuthPage />)
    expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it("toggles between login and signup", () => {
    render(<AuthPage />)
    const toggleButton = screen.getByText(/crear cuenta/i)
    fireEvent.click(toggleButton)
    expect(screen.getByRole("heading", { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it("displays OAuth providers", () => {
    render(<AuthPage />)
    expect(screen.getByText(/continuar con google/i)).toBeInTheDocument()
    expect(screen.getByText(/continuar con linkedin/i)).toBeInTheDocument()
    expect(screen.getByText(/continuar con github/i)).toBeInTheDocument()
  })

  it("validates email format", async () => {
    render(<AuthPage />)
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("type", "email")
    })
  })
})
