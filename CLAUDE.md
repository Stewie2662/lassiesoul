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

## Principios de seguridad — obligatorios en todo el código

### Generales
- Nunca confiar en datos del cliente — validar siempre en el servidor
- RLS activado en todas las tablas, sin excepciones
- Nunca exponer claves secretas en el frontend
- Variables de entorno para toda credencial, nunca hardcodeadas

### Contra inyección SQL
- Usar siempre el cliente de Supabase con parámetros — nunca 
  concatenar strings para construir queries
- Correcto:   supabase.from('animals').select().eq('id', id)
- Incorrecto: supabase.rpc(`SELECT * WHERE id = ${id}`)

### Autenticación y autorización
- Toda ruta del dashboard requiere sesión activa verificada
- Verificar siempre que el recurso pertenece al usuario autenticado
  antes de leer, editar o borrar
- Tokens JWT gestionados por Supabase Auth — no crear los propios

### Subida de archivos
- Validar tipo MIME y tamaño antes de subir a Supabase Storage
- Solo permitir imágenes: jpg, png, webp
- Tamaño máximo: 5MB por foto

### Datos públicos vs privados
- Solo llegan al portal público los animales con is_public = true
- Los datos de donantes y contactos nunca son públicos
- Las políticas RLS son la última línea de defensa — siempre activas

### Frontend
- Sanitizar cualquier input antes de mostrarlo en pantalla
- No mostrar mensajes de error técnicos al usuario final
- Nunca guardar datos sensibles en localStorage

El sistema tiene tres roles:

- admin (yo, Steeven): acceso total a todo, puede gestionar 
  cualquier protectora y subir animales en su nombre
- shelter: gestiona solo sus propios animales y perfil
- adopter: solo ve el portal público

Empieza por el flujo de admin y shelter juntos:
1. Auth con roles (admin vs shelter)
2. Panel admin: ver todas las protectoras, entrar en cualquiera
3. Panel shelter: ver y gestionar sus propios animales
4. Formulario de animal compartido entre ambos roles

El objetivo es que el admin pueda operar en nombre de cualquier 
protectora para agilizarles la vida.
## Estructura de archivos sensibles o de referencia

- Todo archivo que no sea necesario para el funcionamiento de la app 
  va en la carpeta `docs/` — esta carpeta está en `.gitignore` y 
  nunca se sube a GitHub
- Ejemplos: migraciones SQL, notas, bocetos, scripts de utilidad
- Nunca crear archivos .sql, .md de notas o scripts sueltos 
  en la raíz del proyecto