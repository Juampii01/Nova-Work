"use client"

import React, { createContext, useContext, useState } from "react"

export type NavDropdownType = "notifications" | "theme" | "more" | null

type NavDropdownContextType = {
  open: NavDropdownType
  setOpen: (value: NavDropdownType) => void
}

const NavDropdownContext = createContext<NavDropdownContextType | undefined>(
  undefined
)

export function NavDropdownProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<NavDropdownType>(null)

  return (
    <NavDropdownContext.Provider value={{ open, setOpen }}>
      {children}
    </NavDropdownContext.Provider>
  )
}

export function useNavDropdown() {
  const context = useContext(NavDropdownContext)
  if (!context) {
    throw new Error(
      "useNavDropdown must be used within a NavDropdownProvider"
    )
  }
  return context
}