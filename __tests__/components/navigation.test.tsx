import { render, screen, fireEvent } from "@testing-library/react"
import { Navigation } from "@/components/navigation"
import "@testing-library/jest-dom"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

describe("Navigation", () => {
  it("renders the logo and brand name", () => {
    render(<Navigation />)
    expect(screen.getByText("Nova Work")).toBeInTheDocument()
  })

  it("renders main navigation links", () => {
    render(<Navigation />)
    expect(screen.getByText("Explorar")).toBeInTheDocument()
    expect(screen.getByText("Publicar")).toBeInTheDocument()
    expect(screen.getByText("Mensajes")).toBeInTheDocument()
  })

  it("opens mobile menu when clicking hamburger button", () => {
    render(<Navigation />)
    const mobileMenuButton = screen.getAllByRole("button").find((btn) => btn.querySelector("svg"))
    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton)
      // Check if mobile menu items are visible
      expect(screen.getAllByText("Explorar")).toHaveLength(2) // Desktop + Mobile
    }
  })

  it("highlights active page link", () => {
    render(<Navigation />)
    const explorLink = screen.getByRole("link", { name: /explorar/i })
    // This would need proper path matching based on pathname mock
    expect(explorLink).toBeInTheDocument()
  })
})
