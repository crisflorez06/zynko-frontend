# Parqueadero - Frontend de Gestión

Una interfaz de usuario moderna y reactiva para la **gestión de parqueaderos**, que consume los servicios del [Parqueadero Backend](https://github.com/crisflorez06/parqueadero-backend). Permite a los operarios controlar entradas, salidas, y visualizar el estado del parqueadero en tiempo real.
Construido como una Single-Page Application (SPA) con **Angular**, el proyecto está diseñado para ser intuitivo y eficiente.

---

## ⭐ Características Principales

*   **Autenticación de Usuarios**: Sistema de login para controlar el acceso.
*   **Rutas Protegidas**: Uso de `AuthGuard` para asegurar que solo usuarios autenticados puedan acceder a las funciones principales.
*   **Gestión de Vehículos**: Formularios para registrar la **entrada** y **salida** de vehículos, con cálculo de pago.
*   **Visualización en Tiempo Real**: Una **tabla** que muestra los vehículos actualmente dentro del parqueadero.
*   **Gestión de Operarios**: Módulo para administrar los **turnos**.
*   **Reportes**: Visualización del **total** de ingresos y operaciones.
*   **Impresión de Tickets**: Integración con la librería **QZ Tray** (a través del backend) para la impresión de recibos físicos.

---

## ️ Stack Tecnológico

*   Framework: **Angular 17**
*   Lenguaje: **TypeScript**
*   Componentes de UI: **Angular Material**
*   Manejo de Fechas: **date-fns**
*   Cliente HTTP y Reactividad: **RxJS**
*   Build Tool: **Angular CLI**

---

## Cómo Empezar

### 1. Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18+)
*   [Angular CLI](https://angular.dev/tools/cli)
*   El **servidor del backend debe estar en ejecución**.

### 2. Instalación

Clona el repositorio:

```bash
git clone https://github.com/crisflorez06/parqueadero-frontend
cd parqueadero_frontend
```

Instala las dependencias:

```bash
npm install
```

### 3. Ejecución

Levanta el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en: [http://localhost:4200/](http://localhost:4200/)

---

##  Rutas Principales

*   `/login`: Página de inicio de sesión.
*   `/entrada`: Formulario para registrar el ingreso de un nuevo vehículo.
*   `/salida`: Formulario para registrar la salida y el pago de un vehículo.
*   `/tabla`: Muestra todos los vehículos que se encuentran actualmente en el parqueadero.
*   `/turnos`: Permite gestionar los turnos de los operarios.
*   `/total`: Muestra un resumen de los ingresos y vehículos del día.

---

## Configuración de Impresora

Para habilitar la impresión de tickets, la aplicación se integra con **QZ Tray**. El usuario final debe proporcionar su propio certificado digital (de prueba o producción) y colocarlo en la ruta `src/assets/js/` con el nombre `digital-certificate.txt`.


---

## ‍ Autor

Proyecto desarrollado por **Cristian Flórez**.

---

##  Licencia

Distribuido bajo la licencia [MIT](LICENSE).

---
