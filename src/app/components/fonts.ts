import { Roboto } from 'next/font/google'
import { Honk } from 'next/font/google'
import { Cinzel } from 'next/font/google'
import { Acme } from 'next/font/google'
import { Audiowide } from 'next/font/google'
import { Eater } from 'next/font/google'
import { Angkor } from 'next/font/google'
import { Caveat } from 'next/font/google'
import { Merienda } from 'next/font/google'

export const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const honk = Honk({
    subsets: ['latin'],
})

export const caveat = Caveat({
    weight: '400',
    subsets: ['latin'],
})

export const merienda = Merienda({
    weight: '400',
    subsets: ['latin'],
})


export const audiowide = Audiowide({
    weight: '400',
    subsets: ['latin']
})

export const cinzel = Cinzel({
    subsets: ['latin'],
})

export const acme = Acme({
    weight: '400',
    subsets: ['latin']
})

export const eater = Eater({
    weight: '400',
    subsets: ['latin']
})

export const angkor = Angkor({
    weight: '400',
    subsets: ['latin']
})
