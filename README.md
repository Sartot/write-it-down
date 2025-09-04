# Software Requirements Specification
## For Write It Down Web App

Version 1.0 
Prepared by <author>Lorenzo Sartori</author> @ <organization>UniPR</organization>

Table of Contents
=================
* 1 [Introduction](#1-introduction)
  * 1.1 [Document Purpose](#11-document-purpose)
  * 1.2 [Product Scope](#12-product-scope)
  * 1.3 [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  * 1.4 [References](#14-references)
  * 1.5 [Document Overview](#15-document-overview)
* 2 [Product Overview](#2-product-overview)
  * 2.1 [Product Perspective](#21-product-perspective)
  * 2.2 [Product Functions](#22-product-functions)
  * 2.3 [Product Constraints](#23-product-constraints)
  * 2.4 [User Characteristics](#24-user-characteristics)
  * 2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)
  * 2.6 [Apportioning of Requirements](#26-apportioning-of-requirements)
* 3 [Requirements](#3-requirements)
  * 3.1 [External Interfaces](#31-external-interfaces)
    * 3.1.1 [User Interfaces](#311-user-interfaces)
    * 3.1.3 [Software Interfaces](#313-software-interfaces)
  * 3.2 [Functional](#32-functional)
  * 3.3 [Quality of Service](#33-quality-of-service)
    * 3.3.1 [Performance](#331-performance)
    * 3.3.2 [Security](#332-security)
  * 3.4 [Compliance](#34-compliance)
  * 3.5 [Design and Implementation](#35-design-and-implementation)
    * 3.5.1 [Installation](#351-installation)
    * 3.5.2 [Distribution](#352-distribution)
    * 3.5.3 [Cost](#353-cost)
    * 3.5.4 [Deadline](#354-deadline)
* 4 [Verification](#4-verification)
* 5 [Appendixes](#5-appendixes)


## 1. Introduction
Il seguente documento ha lo scopo di descrivere gli aspetti principali della web app Write It Down, un progetto sviluppato per il corso di tecnologie internet @ UniPR.

### 1.1 Document Purpose
Il documento raccoglie i requisiti software della app. Il documento è rivolto a ingegneri del software, ingegneri di basi di dati, sviluppatori web ed entusiasti delle potenziali applicazioni di framework NextJS e di api per l'utilizzo di Intelligenza Artificiale nella vita di tutti i giorni.

### 1.2 Product Scope
L'obiettivo dell'applicativo è quello di fornire uno strumento semplice e facile da usare per raccogliere note e appunti riguardo una o più materie di studio da parte dell'utente. Inoltre l'applicativo offre un'integrazione con strumenti di Intelligenza Artificiale per funzionare come aiutante durante lo studio basato sugli appunti. 
Ogni utente è in grado di creare un account personale dove verranno salvate le note create.

### 1.3 Definitions, Acronyms and Abbreviations

* **SRS**: Software Requirements Specification
* **API**: Application Programming Interface
* **LLM**: Large Language Model
* **DB**: Database
* **UI/UX**: User Interface/User Experience
* **CRUD**: Create, Read, Update, Delete
* **NextJS**: React framework per applicazioni full-stack
* **TipTap**: Rich text editor per React
* **Better Auth**: Libreria di autenticazione per JavaScript
* **MySQL**: Sistema di gestione database relazionale
* **Gemini**: Modello di intelligenza artificiale di Google
* **shadcn/ui**: Libreria di componenti UI per React

### 1.4 References
Nel corpo del documento sarà fatto riferimento ad alcuni strumenti/librerie software:
* Shadcn/ui: https://ui.shadcn.com/docs
* Better Auth (Autenticazione utente): https://www.better-auth.com/docs/introduction
* TipTap Editor: https://tiptap.dev/docs/editor/getting-started/overview

### 1.5 Document Overview
Questo documento è strutturato in 5 sezioni principali:
1. **Introduction**: Fornisce il contesto e lo scopo del documento
2. **Product Overview**: Descrive le funzionalità e i vincoli del sistema
3. **Requirements**: Specifica i requisiti funzionali e non funzionali
4. **Verification**: Definisce i criteri e metodi di verifica
5. **Appendixes**: Contiene informazioni supplementari e riferimenti tecnici

## 2. Product Overview

### 2.1 Product Perspective
Write It Down è un'applicazione web standalone, sviluppata come progetto universitario per il corso di Tecnologie Internet presso UniPR. L'applicazione è self-contained e non fa parte di una famiglia di prodotti esistente.

**Architettura del Sistema:**
- **Frontend**: Applicazione React basata su Next.js con App Router
- **Backend**: API Routes di Next.js per la logica server-side
- **Database**: MySQL per il salvataggio di dati persistenti
- **Servizi Esterni**: Google Gemini API per funzionalità AI
- **Autenticazione**: Better Auth per gestione utenti e sessioni

**Componenti Principali:**
1. **Client Web** (React/Next.js): Interfaccia utente responsive
2. **Server API** (Next.js API Routes): Logica per la gestione e il salvataggio dei dati
3. **Database MySQL**: Storage per utenti e note
4. **AI Service** (Google Gemini): Generazione domande e valutazioni
5. **Authentication Layer** (Better Auth): Gestione sicurezza e sessioni

### 2.2 Product Functions
* Registrazione di un account personale
* Autenticazione del proprio account tramite email/username e password
* Modifica email/username e password
* Creazione nota
* Modifica nota
* Cancellazione nota
* Interrogazione sulle proprie conoscenze del contenuto della nota da parte di un LLM ( Google Gemini )

![image info](./write-it-down_use-cases.png)

### 2.3 Product Constraints
* Uso di framework ReactJS, in questo caso NextJS
* Uso di un database SQL o NoSQL
* Definizione di route API custom

### 2.4 User Characteristics
Al momento non esiste una distizione tra utente finale e utente admin. Per questioni di test l'API del modello AI non è soggetta a limitazioni.

### 2.5 Assumptions and Dependencies

**Assunzioni:**
- Gli utenti hanno accesso a una connessione internet stabile
- I browser supportano HTML5, CSS3 e JavaScript ES6+
- Il server MySQL è sempre disponibile e configurato correttamente
- L'API di Google Gemini rimane accessibile e stabile
- Gli utenti utilizzano dispositivi con almeno 2GB di RAM

**Dipendenze Esterne:**
- **Google Gemini API**: Servizio critico per funzionalità AI
- **MySQL Database**: Necessario per persistenza dati e il salvataggio della sessione utente ( autenticazione )
- **Node.js Runtime**: Versione 18+ per compatibilità Next.js
- **Better Auth Service**: Per autenticazione e gestione sessioni

**Dipendenze di Sviluppo:**
- React 19.1.0+
- Next.js 15.3.4+
- TipTap 2.24.0+ per rich text editing
- Tailwind CSS per styling
- shadcn/ui per componenti UI

### 2.6 Apportioning of Requirements

**Distribuzione dei Requisiti per Componente:**

| Funzionalità | Frontend (React) | Backend (API) | Database | AI Service |
|--------------|------------------|---------------|----------|------------|
| Autenticazione | Form UI | Validazione, Sessioni | User storage | - |
| Gestione Note | Editor, UI | CRUD operations | Note storage | - |
| AI Questions | Question UI | API integration | - | Content analysis |
| AI Evaluation | Results UI | API integration | - | Answer evaluation |

## 3. Requirements

### 3.1 External Interfaces

#### 3.1.1 User interfaces
Le interfacce utente sono 4:
* Landing page: pagina di atterraggio in cui un nuovo utente arriva. La pagina descrive in poche parole la funzionalità del sistema e offre, attraverso un bottone, la possibilità di registrarsi per provare l'applicativo.
* Pagina di registrazione/accesso utente: la pagina offre la possibilità ad un nuovo utente di registrarsi e a quelli che possiedono già un account di accedere alle proprie note o area utente.
* Pagina di creazione/modifica delle note: la pagina consente all'utente di visualizzare le proprie note e i rispettivi contenuti. La pagina offre anche la possibilità di navigare attraverso le diverse note attraverso una sidebar e di modificarne il contenuto selezionando una nota e scrivendo nell'apposito Rich Text Editor.
* Area Utente: l'area utente consente di visualizzare i dati relativi al proprio account e gestirne alcuni aspetti come modificare la propria email/username e la propria password. La email inserita deve essere in un formato valido e la password deve essere lunga almeno 8 caratteri.

#### 3.1.3 Software interfaces
Per funzionare il software sfrutta alcuni componenti essenziali:
* Server NodeJS per servire le pagine al cliente ed eseguire richieste lato server
* Framework ReactJS: NextJS per gestire richieste lato server in modo complementare al client
* DB relazionale MySQL, l'integrazione avviene tramite il pacchetto npm mysql2
* Servizio di LLM IA Google Gemini, l'integrazione avviene tramite il pacchetto npm @google/genai
* Tiptap Rich Text Editor, l'integrazione avviene tramite il pacchetto npm tiptap
* Icone utilizzate in tutto l'applicativo, l'integrazione avviene tramite il pacchetto npm lucide-react
* Libreria di componenti front-end estendibili shacdn/ui, l'integrazione avviene tramite il pacchetto npm shadcn@latest e includendo separatamente ogni componente utilizzato. La lista di componenti disponibili qui https://ui.shadcn.com/docs/components

### 3.2 Functional

**Requisiti Funzionali Dettagliati:**

**FR-001: Gestione Utenti**
- FR-001.1: L'utente deve poter registrare un nuovo account con email e password
- FR-001.2: L'utente deve poter autenticarsi con credenziali valide
- FR-001.3: L'utente deve poter modificare email e password del proprio account

**FR-002: Gestione Note**
- FR-002.1: L'utente deve poter creare una nuova nota con titolo e contenuto
- FR-002.2: L'utente deve poter modificare titolo e contenuto delle proprie note
- FR-002.3: Il sistema deve salvare automaticamente le modifiche ogni secondo
- FR-002.4: L'utente deve poter eliminare le proprie note
- FR-002.5: Le note devono supportare formattazione rich text (grassetto, corsivo, liste, etc.)

**FR-003: Integrazione AI**
- FR-003.1: Il sistema deve generare domande di studio basate sul contenuto delle note
- FR-003.2: L'utente deve poter rispondere alle domande generate
- FR-003.3: Il sistema deve valutare le risposte e fornire feedback con punteggio
- FR-003.4: Il sistema deve fornire spiegazioni e suggerimenti di studio

**FR-004: Interfaccia Utente**
- FR-004.1: L'applicazione deve essere responsive per desktop e mobile
- FR-004.2: L'utente deve poter navigare tra le note tramite sidebar
- FR-004.3: Il sistema deve mostrare lo stato di salvataggio delle note
- FR-004.4: L'interfaccia deve supportare tema scuro come default

### 3.3 Quality of Service

#### 3.3.1 Performance
L'applicativo dovrebbe permettere di eseguire query sul DB in tempi ragionevoli in modo da permettere al server di restituire il contenuto delle note nel più breve tempo possibile.
L'applicativo dovrebbe permettere all'utente di creare e accedere alle note in tempi ragionevolmente brevi permettendo una navigazione agile e piacevole.
L'applicativo deve interfacciarsi con il modello di IA nel modo più veloce possibile e offrire all'utente un feedback non appena questo è disponibile.

#### 3.3.2 Security
* I dettagli dell'account utente non devono essere condivisi con nessun soggetto al di fuori dell'applicativo stesso. L'indirizzo email è utilizzato solo per la registrazione e l'accesso all'area utente.
* La password creata da un utente deve essere salvata in maniera sicura e non decifrabile sotto forma di hash all'interno del DB per evitare ad ogni costo fughe di dati.
* L'utente deve poter accedere solo alle proprie note. In nessun caso un utente deve essere in grado di visionare e/o modificare le note altrui.

### 3.5 Design and Implementation

#### 3.5.1 Installation
L'installazione del software avviene tramite il comando `npm install --force`.
Al momento il flag --force è necessario per alcuni problemi relativi ad una dipendenza ( @tiptap/core, vedi issue #15880 https://github.com/open-webui/open-webui/issues/15880 ).

Nel file .env è necessario impostare alcune variabili per il processo, in particolare:
* BETTER_AUTH_SECRET : usato da better-auth per la cifratura e la generazione di hash
* BETTER_AUTH_URL : url base della web app
* DB_HOST : indirizzo ip del server MySQL
* DB_USER : utente del server MySQL
* DB_PWD : password dell'utente MySQL
* DB_NAME : nome del database in cui si lavora
* BASE_URL : url base della web app
* GEMINI_KEY : chiave API per Google Gemini

Il server NextJS può essere eseguito con il comando `pnpm dev` oppure `next dev --turbopack`.
Il processo di build può essere eseguito con il comando `pnpm build` oppure `next build`.

#### 3.5.2 Distribution
Il software è stato costruito per funzionare al meglio su dispositivi desktop, tuttavia è disponibile anche una versione per l'utilizzo su dispositivi mobili.

#### 3.5.3 Cost
Costo di sviluppo del progetto: indefinito.

#### 3.5.4 Deadline
Deadline di sviluppo: Agosto 2025.

## 4. Verification

### 4.1 Testing Strategy

**Integration Testing:**
- Test delle API routes con database reale
- Verifica integrazione con servizi esterni
- Test dei flussi di autenticazione completi

**End-to-End Testing:**
- Simulazione percorsi utente completi
- Test su browser multipli (Chrome, Firefox, Safari)
- Verifica responsive design su dispositivi diversi

### 4.3 Known Issues

**Problemi di Sicurezza (Priorità Alta):**
- API Key Google Gemini hardcoded nel codice
- Credenziali database esposte in file di configurazione

**Problemi Tecnici (Priorità Media):**
- Error handling limitato nelle API routes
- Mancanza di rate limiting per API calls
- Mancanza di trigger per `updatedAt` automatico sulla tabella note

**Miglioramenti Futuri:**
- Implementazione caching intelligente
- Aggiunta logging strutturato
- Aggiungere `ON UPDATE CURRENT_TIMESTAMP` per campo `updatedAt`
- Implementare soft delete per note (campo `deleted_at`)
- Aggiungere indice per performance su `updatedAt`

## 5. Appendixes

### 5.1 Database Schema

**Tabelle Better Auth (Implementate):**
```sql
-- Tabella utenti
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL PRIMARY KEY, 
  `name` text NOT NULL, 
  `email` varchar(255) NOT NULL UNIQUE, 
  `emailVerified` boolean NOT NULL, 
  `image` text, 
  `createdAt` datetime NOT NULL, 
  `updatedAt` datetime NOT NULL
);

-- Tabella sessioni
CREATE TABLE `session` (
  `id` varchar(36) NOT NULL PRIMARY KEY, 
  `expiresAt` datetime NOT NULL, 
  `token` varchar(255) NOT NULL UNIQUE, 
  `createdAt` datetime NOT NULL, 
  `updatedAt` datetime NOT NULL, 
  `ipAddress` text, 
  `userAgent` text, 
  `userId` varchar(36) NOT NULL REFERENCES `user` (`id`)
);
```

**Schema Note (Implementato):**
```sql
-- Tabella note (IMPLEMENTATA)
CREATE TABLE `note` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `title` text COLLATE utf8mb4_general_ci,
  `content` longtext COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indici e constraints
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

ALTER TABLE `note`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
```

### 5.2 API Endpoints

**Authentication Routes:**
- `POST /api/auth/sign-in` - Login utente
- `POST /api/auth/sign-up` - Registrazione utente
- `GET /api/auth/session` - Ottieni la sessione utente corrente

**Notes Management:**
- `GET /api/notes?user_id={id}` - Ottieni le note di un dato utente
- `POST /api/notes` - Crea nuova nota
- `PUT /api/notes` - Modifica una nota esistente
- `GET /api/notes/[id]` - Ottieni una nota specifica
- `DELETE /api/notes/[id]` - Cancella una nota specifica

### 5.3 Environment Variables

**Required .env Configuration:**
```bash
# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PWD=your_password
DB_NAME=write-it-down

# Application
BASE_URL=http://localhost:3000

# AI Integration
GEMINI_KEY=your_google_gemini_api_key
```

### 5.4 Deployment Guide

**Development Setup:**
1. `npm install --force` (per dependency conflicts)
2. Configura variabili .env
3. Setup DB MySQL
4. Esegui migrazioni database: `npm run migrate`
5. Esegui ambiente di sviluppo: `pnpm dev`

**Production Deployment:**
1. Esegui build per ambiente di produzione: `pnpm build`
2. Configura varibili .env
3. Setup DB MySQL di produzione
4. Esegui server NodeJS in produzione ( server.js ): `pnpm start`

### 5.5 Technology Stack Details

**Frontend Dependencies:**
- React 19.1.0 - UI library
- Next.js 15.3.4 - Full-stack framework
- TipTap 2.24.0 - Rich text editor
- Tailwind CSS - Styling framework
- shadcn/ui - Component library
- Framer Motion - Animations

**Backend Dependencies:**
- mysql2 3.14.1 - Database connector
- better-auth 1.2.12 - Authentication
- @google/genai 0.7.0 - AI integration
- uuid - ID generation
- moment - Date manipulation