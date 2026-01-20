import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <span className="font-heading font-bold text-xl">Nova Work</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Trabajo real, cerca tuyo. Conectamos personas que buscan y ofrecen trabajo en la misma zona.
            </p>
          </div>

          {/* Producto */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explorar empleos
                </Link>
              </li>
              <li>
                <Link href="/post" className="text-muted-foreground hover:text-foreground transition-colors">
                  Publicar oferta
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors">
                  Verificación
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Planes
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trabajá con nosotros
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                  Prensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 Nova Work. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link
              href="mailto:hola@novawork.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
            </Link>
            <Link href="tel:+5491123456789" className="text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </Link>
            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
              <MapPin className="w-3 h-3" />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
