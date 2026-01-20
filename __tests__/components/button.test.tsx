"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("handles click events", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="outline">Button</Button>)
    expect(screen.getByText("Button")).toHaveClass("border")

    rerender(<Button variant="ghost">Button</Button>)
    expect(screen.getByText("Button")).toHaveClass("hover:bg-accent")
  })

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText("Disabled")).toBeDisabled()
  })
})
