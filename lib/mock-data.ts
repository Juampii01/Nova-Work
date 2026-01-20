// Mock data for Nova Work

export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  category: string
  modality: "presencial" | "remoto" | "mixto"
  type: "full-time" | "part-time" | "freelance"
  salary?: string
  location: string
  distance: number
  isVerified: boolean
  postedAt: string
  authorId: string
}

export interface Candidate {
  id: string
  name: string
  handle: string
  title: string
  bio: string
  skills: string[]
  experience: string
  location: string
  distance: number
  isVerified: boolean
  isAvailable: boolean
  rating: number
  avatar?: string
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Desarrollador Frontend React",
    company: "TechStart Buenos Aires",
    description:
      "Buscamos desarrollador Frontend con experiencia en React y TypeScript para proyecto de e-commerce. Trabajo en equipo ágil, ambiente colaborativo.",
    requirements: ["React", "TypeScript", "CSS", "Git"],
    category: "tech",
    modality: "mixto",
    type: "full-time",
    salary: "$180.000 - $250.000",
    location: "Palermo, CABA",
    distance: 2.3,
    isVerified: true,
    postedAt: "hace 2 horas",
    authorId: "company1",
  },
  {
    id: "2",
    title: "Carpintero para muebles a medida",
    company: "Mueblería San Telmo",
    description:
      "Se necesita carpintero con experiencia en muebles a medida. Trabajo de lunes a viernes, ambiente familiar.",
    requirements: ["Experiencia en carpintería", "Herramientas propias", "Responsabilidad"],
    category: "oficios",
    modality: "presencial",
    type: "full-time",
    salary: "$120.000 - $150.000",
    location: "San Telmo, CABA",
    distance: 1.8,
    isVerified: true,
    postedAt: "hace 4 horas",
    authorId: "company2",
  },
  {
    id: "3",
    title: "Vendedor/a para local de ropa",
    company: "Fashion Store",
    description:
      "Buscamos vendedor/a con experiencia en atención al cliente para local de ropa en shopping. Horarios rotativos.",
    requirements: ["Experiencia en ventas", "Buena presencia", "Disponibilidad horaria"],
    category: "ventas",
    modality: "presencial",
    type: "part-time",
    location: "Villa Crespo, CABA",
    distance: 3.1,
    isVerified: false,
    postedAt: "hace 1 día",
    authorId: "company3",
  },
  {
    id: "4",
    title: "Chef de cocina",
    company: "Restaurante La Esquina",
    description:
      "Restaurante busca chef con experiencia en cocina argentina e internacional. Ambiente dinámico, equipo joven.",
    requirements: ["Experiencia como chef", "Conocimiento de cocina argentina", "Liderazgo"],
    category: "gastronomia",
    modality: "presencial",
    type: "full-time",
    salary: "$200.000 - $280.000",
    location: "Recoleta, CABA",
    distance: 4.2,
    isVerified: true,
    postedAt: "hace 3 días",
    authorId: "company4",
  },
  {
    id: "5",
    title: "Diseñador Gráfico Freelance",
    company: "Agencia Creativa",
    description:
      "Proyectos de diseño gráfico para marcas locales. Trabajo remoto con reuniones presenciales ocasionales.",
    requirements: ["Adobe Creative Suite", "Portfolio", "Creatividad"],
    category: "tech",
    modality: "remoto",
    type: "freelance",
    salary: "$80.000 - $120.000",
    location: "Barracas, CABA",
    distance: 5.7,
    isVerified: true,
    postedAt: "hace 1 semana",
    authorId: "company5",
  },
]

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Miguel Rodríguez",
    handle: "miguel-rodriguez",
    title: "Carpintero especializado",
    bio: "15 años de experiencia en carpintería y muebles a medida. Trabajo prolijo y responsable.",
    skills: ["Carpintería", "Muebles a medida", "Restauración", "Herramientas eléctricas"],
    experience: "15 años",
    location: "San Telmo, CABA",
    distance: 1.2,
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Ana López",
    handle: "ana-lopez",
    title: "Chef y propietaria de restaurante",
    bio: "Chef con 10 años de experiencia. Especializada en cocina argentina y mediterránea.",
    skills: ["Cocina argentina", "Gestión de cocina", "Menús", "Liderazgo"],
    experience: "10 años",
    location: "Recoleta, CABA",
    distance: 2.8,
    isVerified: true,
    isAvailable: false,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Carla Martínez",
    handle: "carla-martinez",
    title: "Diseñadora Gráfica Freelance",
    bio: "Diseñadora especializada en branding e identidad visual. Trabajo con marcas locales y startups.",
    skills: ["Diseño gráfico", "Branding", "Adobe Creative", "Ilustración"],
    experience: "7 años",
    location: "Palermo, CABA",
    distance: 3.5,
    isVerified: true,
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Roberto Silva",
    handle: "roberto-silva",
    title: "Vendedor senior",
    bio: "Vendedor con amplia experiencia en retail y atención al cliente. Orientado a resultados.",
    skills: ["Ventas", "Atención al cliente", "Retail", "Negociación"],
    experience: "12 años",
    location: "Villa Crespo, CABA",
    distance: 4.1,
    isVerified: false,
    isAvailable: true,
    rating: 4.5,
  },
  {
    id: "5",
    name: "Lucía Fernández",
    handle: "lucia-fernandez",
    title: "Desarrolladora Full Stack",
    bio: "Desarrolladora con experiencia en React, Node.js y bases de datos. Apasionada por la tecnología.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Git"],
    experience: "5 años",
    location: "Barracas, CABA",
    distance: 6.2,
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
  },
]

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
