# Timesave24 – Migration auf Node.js, Express, React & MySQL (Docker)

## 1. Wichtigste Terminal-Commands

### Docker-Container bauen & starten
```bash
docker compose up --build -d
```

### Container stoppen & löschen
```bash
docker compose down
```

### Logs ansehen
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### In Backend-Container einsteigen
```bash
docker compose exec backend sh
```

### Abfrage API (GET Kunden)
```bash
curl http://localhost:5001/api/customers
```

### Kunde erstellen (POST)
```bash
curl -X POST http://localhost:5001/api/customers   -H "Content-Type: application/json"   -d '{
        "SEARCHNAME": "Musterfirma AG",
        "NAME": "Musterfirma AG",
        "TITLE": "Herr Max Muster",
        "IS_COMPANY": 1
      }'
```

---

## 2. Code-Analyse alte Applikation

- **Sprache & Technologie**: PHP, MySQL
- **Hauptfunktionen**:
  - Kundenverwaltung
  - Aufträge
  - Stunden
  - Rechnungen
- **DB-Schema**: Mehrere Tabellen, u. a. `customers` mit vielen Pflichtfeldern (`NOT NULL`)
- **Backend-Logik**: Direkt in PHP-Dateien mit MySQL-Queries (kein ORM)
- **Frontend**: Klassisch mit HTML/PHP gemischt, keine API-Trennung

---

## 3. Struktur neue Applikation

**Technologien**:
- **Backend**: Node.js, Express, Sequelize (ORM für MySQL)
- **Frontend**: React (Vite oder Create React App)
- **Datenbank**: MySQL 8 (Docker-Container)
- **Umgebung**: Docker Compose mit separaten Services

**Docker-Services**:
- `backend` → Express-API, DB-Zugriff via Sequelize
- `frontend` → React-UI mit Formularen
- `db` → MySQL-Datenbank
- `phpmyadmin` → Web-UI für MySQL

**API-Endpoints (bisher)**:
- `GET /api/customers` – Alle Kunden abrufen (Sequelize `findAll`)
- `POST /api/customers` – Neuen Kunden erstellen
- `PUT /api/customers/:id` – Kunden aktualisieren
- `DELETE /api/customers/:id` – Kunden löschen

---

## 4. Installationsangaben

### Voraussetzungen
- Docker & Docker Compose installiert
- Projektverzeichnis mit `backend/`, `frontend/`, `db/` vorhanden

### Setup-Schritte
1. **Pakete im Backend installieren**  
   (im Container, da bind-mounted)
   ```bash
   docker compose exec backend sh
   npm install sequelize mysql2
   exit
   ```

2. **Sequelize-Verbindung konfigurieren**  
   → `backend/sequelize.js` enthält DB-Config über ENV-Variablen

3. **React-Frontend installieren** (falls lokal)  
   ```bash
   docker compose exec frontend sh
   npm install
   ```

4. **Starten**
   ```bash
   docker compose up --build -d
   ```

5. **Test**  
   Öffne:
   - Backend: [http://localhost:5001/api/customers](http://localhost:5001/api/customers)
   - Frontend: [http://localhost:3000](http://localhost:3000)

---

## 5. Bisher erstellte Files und Bedeutung

| Datei / Pfad                              | Bedeutung |
|-------------------------------------------|-----------|
| **`docker-compose.yml`**                  | Definition aller Container (backend, frontend, db, phpmyadmin) und Volumes |
| **`backend/app.js`**                      | Startpunkt Express-Server, bindet JSON-Parser und API-Routen ein |
| **`backend/routes/customers.js`**         | API-Endpunkte für Kunden (GET/POST/PUT/DELETE), Zugriff via Sequelize |
| **`backend/sequelize.js`**                | Sequelize-Instanz mit DB-Verbindungsparametern |
| **`backend/models/Customer.js`**          | Sequelize-Model für Tabelle `customers` mit allen Feldern |
| **`frontend/src/App.jsx`**                | Root-Komponente des React-Frontends, bindet CustomerForm ein |
| **`frontend/src/components/CustomerForm.jsx`** | Formular zur Kundenerfassung, sendet POST an Backend |
| **`db/init.sql`**                         | Initiales SQL-Skript (wird beim ersten DB-Start ausgeführt) |
| **`public/index.html`**                   | HTML-Grundgerüst für React-App |
| **`src/index.js`**                        | Bootstrap-Datei, rendert React-App in `#root` |

---

**Stand**:  
- Backend & Frontend laufen in Docker  
- DB-Verbindung via Sequelize aktiv  
- Kunden-CRUD ist funktionsfähig  
- Frontend-Formular speichert Daten in MySQL
