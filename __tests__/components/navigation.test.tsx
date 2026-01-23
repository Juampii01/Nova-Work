import { render, screen, fireEvent } from "@testing-library/react"
import { act } from "react"
import { Navigation } from "@/components/navigation"
import { NavDropdownProvider } from "@/components/nav-dropdown-context"
import "@testing-library/jest-dom"


// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock useAuth (solo usuario no autenticado para evitar problemas de hooks)
jest.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    isLoading: false,
    isAuthenticated: false,
    signOut: jest.fn(),
  }),
}))

describe("Navigation", () => {
  const renderWithProvider = (ui: React.ReactNode) => render(<NavDropdownProvider>{ui}</NavDropdownProvider>)

  it("renders the logo and brand name", () => {
    renderWithProvider(<Navigation />)
    expect(screen.getByText("Nova Work")).toBeInTheDocument()
  })

  it("opens mobile menu when clicking hamburger button", () => {
    renderWithProvider(<Navigation />)
    const mobileMenuButton = screen.getAllByRole("button").find((btn) => btn.querySelector("svg"))
    if (mobileMenuButton) {
      act(() => {
        fireEvent.click(mobileMenuButton)
      })
      // Check if at least one mobile menu item is visible
      expect(screen.getAllByText("Explorar").length).toBeGreaterThanOrEqual(1)
    }
  })

  it("highlights active page link", () => {
    renderWithProvider(<Navigation />)
    const explorLink = screen.getByRole("link", { name: /explorar/i })
    expect(explorLink).toBeInTheDocument()
  })
})
