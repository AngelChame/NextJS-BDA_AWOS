🎓 Dashboard de Gestión Académica - EVAL-C1
Este proyecto es una plataforma integral para la visualización de reportes académicos, desarrollada con una arquitectura de microservicios orquestada mediante Docker. El sistema permite a la coordinación académica analizar el rendimiento, riesgo y ranking de estudiantes de forma eficiente y segura.

🛠️ Stack Tecnológico
Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Zod.

Base de Datos: PostgreSQL.

Infraestructura: Docker & Docker Compose.

🚀 Despliegue Rápido
Para levantar el entorno completo (Base de Datos + Frontend):

Bash
docker compose up --build
Frontend: http://localhost:3000

Base de Datos: Host: db | Puerto: 5432 (Accesible internamente por la red de Docker).

📊 Arquitectura de Datos y Vistas SQL
Se implementó una lógica de negocio centralizada en la base de datos mediante 5 Vistas (VIEWS) avanzadas:

Rendimiento por Curso: Agregación de promedios y conteo de reprobados mediante CASE y AVG.

Carga Docente: Análisis de grupos y alumnos atendidos utilizando filtros HAVING.

Alumnos en Riesgo: Implementación de CTE (Common Table Expressions) para filtrar estudiantes con promedios < 7 o asistencia < 80%.

Asistencia por Grupo: Cálculo porcentual utilizando lógica de CASE y COALESCE.

Ranking de Alumnos: Uso de Window Functions (RANK()) para clasificar alumnos por programa educativo.

🔐 Seguridad: Gestión de Roles
La aplicación implementa el principio de menor privilegio para garantizar la integridad de los datos:

Usuario app_user: Es el rol que utiliza la aplicación Next.js para conectarse.

Restricciones: Solo tiene permiso SELECT sobre las Vistas. Tiene el acceso denegado a las tablas base (students, grades, etc.) para evitar manipulaciones directas.

⚡ Evidencia de Optimización (EXPLAIN)
Se implementaron índices B-Tree en db/indexes.sql para optimizar las consultas de búsqueda y filtrado.

1. Búsqueda de Alumnos (Reporte 3)
Consulta: EXPLAIN ANALYZE SELECT * FROM students WHERE name ILIKE 'Juan%';

Resultado: Index Scan using idx_students_search on students (cost=0.14..8.16 rows=1 width=132).

Análisis: El uso del índice evita un escaneo secuencial (Seq Scan), reduciendo el tiempo de respuesta significativamente.

2. Filtrado por Email
Consulta: EXPLAIN ANALYZE SELECT * FROM students WHERE email = 'maria@test.com';

Resultado: Index Scan using idx_students_email_unique on students (cost=0.14..8.16 rows=1 width=132).

├── backend/
│   └── db/
│       ├── schema.sql    # Definición de tablas y relaciones
│       ├── seed.sql      # Carga de 30+ registros para pruebas
│       ├── views.sql     # Lógica de las 5 vistas obligatorias
│       ├── indexes.sql   # Optimización B-Tree
│       └── roles.sql     # Configuración de privilegios de app_user
├── frontend/
│   ├── app/              # Dashboard y Reportes Dinámicos
│   ├── lib/db.ts         # Pool de conexión segura
│   └── Dockerfile        # Imagen de Next.js
└── docker-compose.yml    # Orquestación de servicios


Desarrollado por: Ángel Chamé

Matrícula: 243770

Universidad Politécnica de Chiapas