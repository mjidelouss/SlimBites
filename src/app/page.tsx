import { ThemeProvider } from 'next-themes'
import ThemeToggle from './components/ThemeToggle'
import WeightLossCalculator from './components/WeightLossCalculator'

export default function Home() {
  return (
    <ThemeProvider attribute="class">
      <main className="min-h-screen dark:bg-black bg-white flex flex-col items-center justify-center p-4">
        <ThemeToggle />
        <WeightLossCalculator />
      </main>
    </ThemeProvider>
  )
}