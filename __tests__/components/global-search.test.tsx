import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { GlobalSearch } from "@/components/global-search"
import "@testing-library/jest-dom"
import { act } from "react"

describe("GlobalSearch", () => {
  it("renders search input after opening dialog", () => {
    render(<GlobalSearch />)
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })

  it("shows keyboard shortcut hint", () => {
    render(<GlobalSearch />)
    // Buscar el elemento <kbd> con ⌘ y K
    const kbd = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === "kbd" && content.includes("K")
    })
    expect(kbd).toBeInTheDocument()
  })

  it("opens search dialog on click", async () => {
    render(<GlobalSearch />)
    const searchButton = screen.getByRole("button")
    await act(async () => {
      fireEvent.click(searchButton)
    })

    await waitFor(() => {
      // Buscar el modal por clase y contenido
      const modal = document.querySelector(".fixed.inset-0")
      expect(modal).toBeInTheDocument()
    })
  })

  it("filters results based on search query", async () => {
    render(<GlobalSearch />)
    const searchButton = screen.getByRole("button")
    await act(async () => {
      fireEvent.click(searchButton)
    })

    const input = screen.getByPlaceholderText(/buscar/i)
    await act(async () => {
      fireEvent.change(input, { target: { value: "desarrollador" } })
    })

    await waitFor(() => {
      expect(screen.getByText(/desarrollador frontend react/i)).toBeInTheDocument()
    })
  })
})
