# StockFlow — Sistema de Monitoreo de Inventario

Monorepo con el backend (`inventory-service`) y frontend (`inventory-app`) de la
prueba técnica StockFlow Inc.: monitoreo de inventario en tiempo real, registro
de movimientos y alertas automáticas de stock bajo/crítico.

```
stockflow/
├── inventory-service/   # Backend — Spring Boot 3.5 (Java)
├── inventory-app/       # Frontend — Angular 18 (standalone + signals)
└── README.md            # Este archivo
```

---

## 1. Stack tecnológico y versiones exactas

### Backend — `inventory-service`

| Herramienta / Dependencia | Versión |
|---|---|
| Java (JDK) | 17+ (probado con OpenJDK 21.0.9) |
| Apache Maven | 3.9.16 |
| Spring Boot (parent BOM) | 3.5.16 |
| Spring Web / Data JPA / Validation / Actuator | heredadas del BOM de Spring Boot 3.5.16 |
| H2 Database (in-memory, runtime) | 2.3.232 |
| Resilience4j (`resilience4j-spring-boot3`) | 2.2.0 |
| springdoc-openapi (`springdoc-openapi-starter-webmvc-ui`) | 2.8.5 |
| JaCoCo Maven Plugin (cobertura de tests) | 0.8.12 |
| JUnit 5 + Mockito + AssertJ | vía `spring-boot-starter-test` (BOM 3.5.16) |

### Frontend — `inventory-app`

| Herramienta / Dependencia | Versión |
|---|---|
| Node.js | 22.22.1 |
| npm | 10.9.4 |
| Angular CLI | 18.2.21 |
| Angular (`@angular/core`, `common`, `forms`, `router`, etc.) | ^18.2.0 |
| RxJS | ~7.8.0 |
| TypeScript | ~5.5.2 |
| Zone.js | ~0.14.10 |
| Karma + Jasmine (testing) | karma ~6.4, jasmine-core ~5.2 |

> **Nota de versión Angular:** el enunciado pide "Angular 16+". Se usó Angular
> 18 porque `@defer` (control flow diferido, requisito 3.3) no existe en
> Angular 16/16.x — se introdujo en Angular 17. La 18 cumple "16+" y sí soporta
> `@defer`.

---

## 2. Requisitos previos (instalar en la PC nueva)

- **JDK 17 o superior** — verificar con `java -version`
- **Apache Maven 3.9+** — verificar con `mvn -version` (o usar el wrapper `mvnw` / `mvnw.cmd` incluido en `inventory-service/`, no requiere instalación aparte)
- **Node.js 18.13+ o 20/22 LTS** — verificar con `node -v`
- **Angular CLI 18** — `npm install -g @angular/cli@18` (opcional, `npx ng` también funciona sin instalación global)
- No se requiere Docker, ni base de datos externa, ni ninguna otra configuración: H2 corre en memoria.

---

## 3. Levantar el backend

```bash
cd stockflow/inventory-service

# Windows sin Maven instalado global, usar el wrapper:
mvnw.cmd spring-boot:run

# Con Maven instalado global (cualquier SO):
mvn spring-boot:run
```

Arranca en `http://localhost:8080` sin configuración adicional. Al iniciar,
carga automáticamente 20 productos de ejemplo en 5 categorías (`data.sql`).

### URLs útiles una vez arriba

| Recurso | URL |
|---|---|
| API base | `http://localhost:8080/api/v1` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| Actuator health | `http://localhost:8080/actuator/health` |
| Actuator info | `http://localhost:8080/actuator/info` |
| Actuator metrics | `http://localhost:8080/actuator/metrics` |
| Consola H2 (ver tablas directo) | `http://localhost:8080/h2-console` — JDBC URL: `jdbc:h2:mem:stockflow`, user: `sa`, password: (vacío) |

### Correr los tests del backend

```bash
cd stockflow/inventory-service
mvn test          # corre los 28 tests (unitarios + integración) y genera reporte JaCoCo
mvn verify         # además valida que la cobertura de líneas sea >= 70% (falla el build si no)
```

Reporte de cobertura HTML: `target/site/jacoco/index.html`

---

## 4. Levantar el frontend

```bash
cd stockflow/inventory-app
npm install
npm start          # equivalente a: ng serve
```

Arranca en `http://localhost:4200` sin configuración adicional. Requiere que
el backend esté corriendo en `http://localhost:8080` (URL fija en
`src/app/core/api-config.ts`) — CORS ya está habilitado en el backend para
ese origen.

### Correr los tests del frontend

```bash
cd stockflow/inventory-app
npx ng test --no-watch --browsers=ChromeHeadless
```

Corre los 47 tests (Jasmine/Karma) y valida cobertura >= 70% (configurado en
`karma.conf.js`, falla el comando si no se cumple). Reporte HTML en
`coverage/inventory-app/index.html`.

---

## 5. Decisiones técnicas relevantes

- **Severidad de alertas**: `CRITICAL` si el stock actual cayó a la mitad (o
  menos) del mínimo configurado; `LOW` en cualquier otro caso por debajo del
  mínimo. Regla propia (el documento no especifica el umbral exacto).
- **Health indicator personalizado**: reporta `DOWN` cuando más del 20% de los
  productos están en severidad `CRITICAL`.
- **CORS**: habilitado explícitamente para `http://localhost:4200`, necesario
  porque backend y frontend corren en orígenes distintos en desarrollo.
- **Catálogo del frontend**: el `InventoryStore` carga el catálogo completo
  una sola vez (dataset pequeño, ~20 productos) y hace el filtro por
  categoría y la paginación de la tabla en el cliente, sobre esa lista ya
  cargada — evita ida y vuelta al backend en cada clic de "siguiente".
- **`@defer(on interaction)`**: el historial de movimientos se carga al hacer
  clic sobre la fila del producto en el listado.
- **`@defer(on viewport)`**: el bloque de estadísticas avanzadas del dashboard
  se carga al hacer scroll hasta esa sección.
