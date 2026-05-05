# LassieSoul — Contexto para Claude Code

## ¿Qué es este proyecto?

LassieSoul es una plataforma web de adopción de animales en España. Un buscador centralizado donde cualquier persona puede encontrar animales en adopción de todas las protectoras del país en un solo lugar.

El nombre es en honor a Lassie, una perra rescatada de la calle que falleció hace un año. Ese es el alma del proyecto.

## Stack técnico

- **Frontend:** React + Vite (JavaScript)
- **Backend / Base de datos:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deploy:** Vercel
- **Control de versiones:** GitHub
- **Futuro:** Next.js para SEO, Docker para entorno local reproducible, Azure para escala

## Estructura del proyecto

```
lassiesoul/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas principales
│   ├── lib/              # Configuración de Supabase y utilidades
│   ├── hooks/            # Custom hooks
│   └── assets/           # Imágenes y recursos estáticos
├── public/
├── CLAUDE.md             # Este archivo
├── .env.local            # Variables de entorno (no subir a GitHub)
└── vite.config.js
```

## Base de datos — Schema Supabase

### Tabla: shelters (protectoras)
```sql
CREATE TABLE shelters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: animals (animales)
```sql
CREATE TABLE animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,       -- perro, gato, otro
  breed VARCHAR(100),
  age_years INTEGER,
  size VARCHAR(20),                   -- pequeño, mediano, grande
  gender VARCHAR(20),                 -- macho, hembra
  description TEXT,
  photo_url TEXT,
  is_vaccinated BOOLEAN DEFAULT FALSE,
  is_sterilized BOOLEAN DEFAULT FALSE,
  is_compatible_kids BOOLEAN,
  is_compatible_animals BOOLEAN,
  status VARCHAR(20) DEFAULT 'available', -- available, reserved, adopted
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Políticas RLS

- Las protectoras solo pueden ver y editar sus propios animales
- Los animales con `is_public = true` son visibles para cualquier visitante sin autenticación
- Los datos de donantes y contactos son siempre privados por protectora

## Personas del proyecto

| Persona | Problema | Lo que necesita |
|---|---|---|
| María, adoptante | Tiene que entrar a 15 webs distintas para ver opciones | Un buscador único |
| Protectora "Huellitas" | Gestiona animales con WhatsApp y Excel, sin visibilidad en Google | Subir sus animales fácilmente |
| Steeven, dev | Necesita un proyecto real en producción como carta de presentación | Que funcione bien y esté bien hecho |

## Flujo principal — lo mínimo que tiene que funcionar

1. La protectora se registra con email y contraseña
2. Crea su perfil de protectora (nombre, ciudad, contacto)
3. Sube un animal con foto y descripción
4. El animal aparece en el portal público con su propia URL
5. Un adoptante lo encuentra buscando por ciudad o especie
6. El adoptante contacta con la protectora directamente

## Pantallas a construir

### Públicas (sin login)
- `/` — Página de inicio con buscador y animales destacados
- `/animales` — Listado de animales con filtros (ciudad, especie, tamaño)
- `/animales/:id` — Ficha individual de cada animal
- `/protectoras/:slug` — Página pública de cada protectora

### Privadas (requieren login de protectora)
- `/dashboard` — Panel principal de la protectora
- `/dashboard/animales` — Listado de mis animales
- `/dashboard/animales/nuevo` — Formulario para añadir animal
- `/dashboard/animales/:id/editar` — Editar animal existente

## Variables de entorno necesarias

Crear archivo `.env.local` en la raíz con:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Estas claves están en Supabase → Settings → API.

## Convenciones de código

- Commits en inglés con prefijos: `feat:`, `fix:`, `refactor:`, `docs:`
- Componentes en PascalCase: `AnimalCard.jsx`
- Hooks con prefijo use: `useAnimals.js`
- Funciones y variables en camelCase
- CSS con clases en kebab-case o Tailwind si se añade más adelante

## Hoja de ruta

| Fase | Qué | Cuándo |
|---|---|---|
| Fase 0 | Entorno + Auth + Schema DB | Semanas 1–3 |
| Fase 1 | MVP completo de principio a fin | Semanas 4–8 |
| Fase 2 | SEO con Next.js + eventos de baile | Meses 3–5 |
| Fase 3 | Donaciones + plan Pro + monetización | Mes 6+ |

## Contexto adicional

- Perfil del dev: junior, aprende mientras construye
- Presupuesto inicial: 0€ (solo servicios gratuitos)
- El proyecto de baile (congresos + adopciones) se integra en Fase 2
- Este proyecto es la carta de presentación profesional de Steeven
- Prioridad: que funcione bien y esté bien hecho antes que añadir features
