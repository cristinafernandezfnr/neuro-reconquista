// Deterministic seed from query string so same query = same image
function querySeed(query: string): number {
  return Math.abs(query.split('').reduce((a, c) => a + c.charCodeAt(0), 0))
}

export const getImage = (query: string, w = 800, h = 500) =>
  `https://picsum.photos/${w}/${h}?random=${querySeed(query)}`

export const IMAGES = {
  homeHero: getImage('confidence transformation dark aesthetic', 800, 400),
  week1: getImage('man alone walking road night cinematic', 800, 400),
  week2: getImage('man gym training dark aesthetic', 800, 400),
  week3: getImage('couple tension attraction cinematic dark', 800, 400),
  week4: getImage('romantic reconnection couple elegant', 800, 400),
  psychologyFemale: getImage('brain neural psychology dark blue', 800, 400),
  psychologyMale: getImage('man thinking psychology dark', 800, 400),
  styleMale: getImage('stylish man fashion dark minimal', 800, 400),
  styleFemale: getImage('elegant woman fashion confident dark', 800, 400),
  seductionFemale: getImage('attractive woman confident mysterious', 800, 400),
  seductionMale: getImage('attractive man confident mysterious', 800, 400),
  cristina: getImage('woman professional coach mentor', 400, 400),
  sos: getImage('man sitting alone contemplating night city', 800, 400),
  auth: getImage('silhouette person transformation night', 800, 600),
}

export const heroStyle = (query: string, h = 200): React.CSSProperties => ({
  backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.2) 0%, rgba(17,17,17,0.95) 85%), url(${getImage(query, 800, h * 2)})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: `${h}px`,
  borderRadius: '20px',
})

// Need to import React for CSSProperties
import type React from 'react'
