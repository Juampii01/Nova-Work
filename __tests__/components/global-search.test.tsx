import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { GlobalSearch } from "@/components/global-search"
import "@testing-library/jest-dom"

describe("GlobalSearch", () => {
  it("renders search input", () => {
    render(<GlobalSearch />)
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })

  it("shows keyboard shortcut hint", () => {
    render(<GlobalSearch />)
    expect(screen.getByText(/⌘K/i)).toBeInTheDocument()
  })

  it("opens search dialog on click", async () => {
    render(<GlobalSearch />)
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })
  })

  it("filters results based on search query", async () => {
    render(<GlobalSearch />)
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)

    const input = screen.getByRole("searchbox")
    fireEvent.change(input, { target: { value: "developer" } })

    await waitFor(() => {
      expect(screen.getByText(/resultados/i)).toBeInTheDocument()
    })
  })
})
