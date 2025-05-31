import { Header } from "@/components/layout/header"
import { MainSection } from "@/components/sections/main-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <main>
        <MainSection />
      </main>
      <Footer />
    </div>
  )
}
