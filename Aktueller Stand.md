# Überblick: aktueller Stand timesave25

## Architektur & Laufzeit
- Docker‑Compose Services
- frontend (CRA/React, Tailwind) → http://localhost:3000
- backend (Node.js + Express + Sequelize/raw SQL mix) → http://localhost:5001
- db (MySQL 8) → localhost:3306 (intern: Hostname db)
- phpmyadmin → http://localhost:8080 (Server: db)
- CORS: eigene Minimal‑Middleware in backend/app.js (kein externes Paket notwendig).
- Ports: Host 5001 → container:5000 (Backend), 3000 → 3000 (Frontend), 8080 → 80 (phpMyAdmin).

## Datenbank (Auszug)
- Bestehendes Schema aus lindisc_timesave24qualisens.sql.
- Kern-Tabellen:
- customers … Kunden-Stammdaten
- contracts … Verträge (1:n zu customers)
- contractpos … Vertragspositionen (n:1 zu contracts)
- employees, costcenters … Lookups für Positionen (Anzeige via SEARCHNAME)
- Primärschlüssel im Code via Sequelize‑Attribute in camelCase (z. B. customerId, contractId, …), gemappt auf DB‑Spalten in ALL CAPS.

## Backend
- Entry: backend/app.js
- JSON‑Parsing, CORS‑Middleware, Healthcheck /healthz.
- Router:
- /api/customers (bestehend; CRUD)
- /api/contracts (CRUD, optional withPos=1)
- /api/contractpos (CRUD, Filter ?contractId=…)
- /api/employees (Lookup, optional ?q=…), liefert {id,name}
- /api/costcenters (Lookup, optional ?q=…), liefert {id,name}
- Modelle (Sequelize):
- Customers.js (bereits vorhanden)
- Contracts.js (Spalten inkl. NAME, SEARCHNAME, Gebühren/MWST Felder, Defaults für NOT NULL‑Texte)
- ContractPos.js (Positionen inkl. Menge/Rate/Betrag/VAT)
- Employees.js, Costcenters.js (Lookup: …_ID, SEARCHNAME)
- Assoziationen:
- Customer hasMany Contract
- Contract hasMany ContractPos
- ContractPos belongsTo Contract
- Besonderheiten:
- API nimmt UPPERCASE Felder entgegen (kompatibel zur alten App); Mapping → camelCase.
- Update‑Routen aktualisieren nur übergebene Felder.

## Frontend
- Routing/Struktur
- App.jsx: Tabs Kunden / Verträge
- Kunden
- CustomerList (Liste + Add/Edit/Delete, Validierung via react-hook-form)
- Verträge
- ContractsPage.jsx (Liste, Suche, Auswahl → Detailbereich Positionen)
- ContractForm.jsx (Create/Edit Vertrag)
- ContractPosForm.jsx (Create/Edit Position, Dropdowns für Mitarbeitende & Kostenstellen aus Lookups)
- API‑Clients
- src/api/contracts.js: CRUD für /contracts & /contractpos, shared api (Axios)
- src/api/lookups.js: listEmployees, listCostcenters (nutzen denselben api)
- Styling
- Tailwind aktiv (Utility‑Klassen für Tabellen, Karten, Buttons)

## Build & Run (Daily Use)
### Stack starten
```bash
docker compose up -d
```

### Logs (live)
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Healthcheck
```bash
curl http://localhost:5001/healthz
```


## Typische Fehlerquellen & Fixes
- Frontend „Network Error“ → meist Backend down. Check: docker compose logs -f backend.
- CORS Meldung → in 99% Backend nicht erreichbar; Healthcheck prüfen.
- Module not found (backend) → prüfe, ob Model‑Dateinamen/Importe exakt (Case‑sensitive!) sind.
- Port already in use → Frontend/Backend sauber stoppen: docker compose down und neu starten.

## Nächste sinnvolle Schritte (optional)
- Validierung: Ende ≥ Start in ContractPosForm, Pflichtfelder hervorheben.
- Displaynamen: In Tabellen IDs → Namen (Join/Frontend‑Lookup).
- Filter: Verträge nach Kunde/Status/Zeitraum.
- PDF/Export: Vertrags‑PDF, Positionen summieren, MWST ausweisen.
- Auth: Rollen & Rechte (z. B. Admin vs. Mitarbeiter).
