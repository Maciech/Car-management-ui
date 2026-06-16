# AutoFleet — Architektura projektu

## Cel aplikacji

AutoFleet to platforma do zarządzania portfelem samochodów przez dealerów i osoby prywatne. Umożliwia śledzenie kosztów, statusów pojazdów, zapraszanie współwłaścicieli oraz publiczną ekspozycję pojazdów na wewnętrznej giełdzie.

---

## Stack technologiczny

| Warstwa     | Technologia                                |
|-------------|--------------------------------------------|
| Frontend    | Angular 21, standalone components, Signals |
| Styling     | CSS custom properties, dual theme system   |
| HTTP        | Angular HttpClient + auth interceptor      |
| Tabele      | AG Grid Community (costs-tab)              |
| Backend     | Spring Boot (Java), REST API               |
| Baza danych | Relacyjna (JPA/Hibernate)                  |
| Auth        | JWT (Bearer token w localStorage)          |
| E-mail      | Spring Mail (SMTP) — zaproszenia do auta   |

---

## Struktura katalogów (frontend)

```
src/app/
├── core/
│   ├── layout/
│   │   ├── shell/          # Główny layout dla zalogowanych (sidebar + topbar + router-outlet)
│   │   ├── sidebar/        # Nawigacja boczna z linkami, wyszukiwarką i logout
│   │   └── topbar/         # Górny pasek z tytułem strony i menu profilu
│   └── theme/
│       └── theme.service   # Zarządzanie motywem (light/dark), persystencja w localStorage
│
├── features/
│   ├── auth/
│   │   ├── login/          # Formularz logowania
│   │   ├── register/       # Wieloetapowy formularz rejestracji (dane → rola → hasło)
│   │   ├── auth-service    # login(), register(), logout(), isLoggedIn() (JWT decode)
│   │   └── auth.guard      # CanActivate — przekierowuje na /login jeśli brak tokenu
│   │
│   ├── marketplace/        # Publiczna giełda samochodów (strona główna /)
│   │   └── marketplace     # Wyszukiwarka + karty aut, własny header z loginem/profilem
│   │
│   ├── cars/
│   │   ├── car-model.ts    # Interface Car (wszystkie pola pojazdu)
│   │   ├── car-service.ts  # CRUD aut + zewnętrzne API (NHTSA makes, CarQuery trims)
│   │   ├── car-search-service.ts  # Wyszukiwanie publiczne (/api/car-search/search)
│   │   │
│   │   ├── add-car-modal/  # Modal dodawania nowego auta (wszystkie pola Car)
│   │   ├── car-card/       # Karta auta (zdjęcia, cena, status) — używana w listach
│   │   ├── cars-list/      # Lista aut zalogowanego użytkownika (/cars)
│   │   ├── car-search-modal/  # Wyszukiwarka ogłoszeń w panelu (sidebar lupa)
│   │   │
│   │   └── car-detail/     # Strona szczegółów auta (/cars/:id)
│   │       ├── car-detail  # Loader + layout — ładuje Car i przekazuje do sekcji
│   │       ├── car-gallery/ # Galeria zdjęć z uplodem
│   │       ├── car-summary/ # Dane techniczne + edycja inline (PUT /api/cars/:id)
│   │       └── car-tabs/
│   │           ├── costs-tab/   # Koszty (AG Grid) + dodawanie/edycja wydatku
│   │           └── profit-tab/  # Podsumowanie finansowe (ROI, zysk, dni posiadania)
│   │
│   ├── dashboard/          # Panel główny (/dashboard) — statystyki portfela
│   │   └── stats-section/  # Karty ze statystykami (aktywne auta, koszty, zysk)
│   │
│   ├── invite/             # Strona przyjmowania zaproszenia do auta (/invite?token=...)
│   ├── mailing/            # mail-service — wysyłanie zaproszeń e-mail
│   └── profile/            # Strona profilu (/profile) — placeholder
│
└── shared/
    ├── data/
    │   └── car-generations  # Słownik generacji popularnych marek (BMW F30, E46 itp.)
    └── ui/
        ├── enums/
        │   ├── car-status.enum   # W_NAPRAWIE | GOTOWE | WYSTAWIONE | SPRZEDANE
        │   └── car-color.enum    # WHITE | BLACK | SILVER | ... (string enum = Java enum name)
        ├── authorization/
        │   └── auth.interceptor  # Dodaje Bearer token do każdego żądania HTTP
        ├── toast-component/      # Globalne powiadomienia (ToastService)
        └── toast-service         # show(message) — używany w całej aplikacji
```

---

## Routing

| Ścieżka        | Komponent           | Auth | Opis                                  |
|----------------|---------------------|------|---------------------------------------|
| `/`            | `Marketplace`       | ❌   | Publiczna giełda aut na sprzedaż      |
| `/login`       | `Login`             | ❌   | Logowanie (+ obsługa token zaproszenia) |
| `/register`    | `RegisterComponent` | ❌   | Rejestracja 3-etapowa                 |
| `/invite`      | `InvitePage`        | ❌   | Przyjęcie zaproszenia do auta         |
| `/dashboard`   | `Dashboard`         | ✅   | Statystyki portfela                   |
| `/cars`        | `CarsList`          | ✅   | Lista własnych aut                    |
| `/cars/:id`    | `CarDetail`         | ✅   | Szczegóły, galeria, koszty, zysk      |
| `/profile`     | `Profile`           | ✅   | Profil użytkownika (WIP)              |

Shell (`/dashboard`, `/cars`, ...) chroniony przez `authGuard` — brak tokenu → redirect na `/login?returnUrl=...`.

---

## Motyw (theme system)

- `ThemeService` — `signal<'light'|'dark'>`, persystencja w `localStorage('app-theme')`
- Przy inicjalizacji ustawia `document.documentElement.setAttribute('data-theme', ...)`
- CSS variables zdefiniowane w `styles.css`:
  - `[data-theme="light"]` — jasny motyw (domyślny)
  - `[data-theme="dark"]` — ciemny motyw
- Sidebar **zawsze ciemny** (own rgba values)
- Toggle dostępny: sidebar (dół), topbar (góra), marketplace header

---

## Autentykacja

- JWT przechowywany w `localStorage('token')`
- `AuthService.isLoggedIn()` — dekoduje payload JWT, sprawdza `exp`
- `authInterceptor` — dołącza `Authorization: Bearer <token>` do każdego żądania (jeśli token istnieje); przy 401 czyści token i przekierowuje na `/login`
- Logout: `localStorage.removeItem('token')` → redirect na `/`

---

## Model pojazdu (`Car`)

```typescript
interface Car {
  carId: number | null;
  brand: string;           // Marka
  model: string;           // Wariant/model
  generation?: string;     // np. F30, E46
  carColor: CarColor;      // enum string (WHITE, BLACK, ...)
  productionYear: number;
  vinNumber: string;
  mileage: number;
  kwPower: number;
  engineCapacity: number;  // cm³
  isImported?: boolean;
  isDamaged: boolean;
  numberOfPreviousOwners: number;
  description: string;
  purchasePrice?: number;
  salePrice?: number;
  isSold: boolean;
  status?: CarStatus;      // W_NAPRAWIE | GOTOWE | WYSTAWIONE | SPRZEDANE
  images: string[];
}
```

> ⚠️ Backend zwraca `CarEntity` z GET (Java Bean boolean getters → `imported` zamiast `isImported`).
> PUT `/api/cars/:id` oczekuje `CarDto` — payload musi mieć `isImported`, `isDamaged`, `isSold`, `kwPower` (nie `kWPower`).
> W `car-summary.ts` `save()` buduje payload ręcznie (nie spread `...car`) właśnie z tego powodu.

---

## Backend REST API (endpoints frontendowe)

| Metoda | Endpoint                              | Auth | Opis                                 |
|--------|---------------------------------------|------|--------------------------------------|
| POST   | `/api/login`                          | ❌   | Logowanie → zwraca JWT (plain text)  |
| POST   | `/api/register`                       | ❌   | Rejestracja użytkownika              |
| GET    | `/api/car-search/search?...`          | ❌   | Wyszukiwanie publiczne aut           |
| GET    | `/api/cars`                           | ✅   | Lista aut użytkownika + udostępnione |
| POST   | `/api/cars`                           | ✅   | Utwórz auto                          |
| GET    | `/api/cars/:id`                       | ✅   | Szczegóły auta (zwraca `CarEntity`)  |
| PUT    | `/api/cars/:id`                       | ✅   | Aktualizuj auto (oczekuje `CarDto`)  |
| GET    | `/api/cars/:id/financial-summary`     | ✅   | ROI, zysk, koszty                    |
| GET    | `/api/cars/getAllMake`                 | ✅   | Lista marek (NHTSA API)              |
| GET    | `/api/cars/getAllModelByMake/:make`    | ✅   | Modele dla marki                     |
| GET    | `/api/cars/getYearRange?make&model`   | ✅   | Zakres lat (CarQuery API)            |
| GET    | `/api/cars/getTrims?make&model&year`  | ✅   | Wersje wyposażenia (CarQuery API)    |
| GET    | `/api/expenses/:carId`                | ✅   | Lista kosztów auta                   |
| POST   | `/api/expenses`                       | ✅   | Dodaj koszt                          |
| PUT    | `/api/expenses/:id`                   | ✅   | Edytuj koszt                         |
| DELETE | `/api/expenses/:id`                   | ✅   | Usuń koszt                           |
| POST   | `/api/images/upload/:carId`           | ✅   | Upload zdjęcia                       |
| GET    | `/api/images/:carId`                  | ✅   | Lista zdjęć auta                     |
| DELETE | `/api/images/:imageId`                | ✅   | Usuń zdjęcie                         |
| POST   | `/api/invitation/send`                | ✅   | Wyślij zaproszenie e-mail do auta    |
| POST   | `/api/invitation/accept?token=...`    | ❌   | Przyjmij zaproszenie                 |
| GET    | `/api/statistics`                     | ✅   | Statystyki portfela użytkownika      |

---

## Znane ograniczenia / TODO

- `/profile` — strona profilu jest placeholderem (pusta)
- Historia auta w `car-detail` (zakładka Historia) — niezaimplementowana
- `/cars/:id` wymaga logowania — anonimowi użytkownicy z marketplace są przekierowywani na login
- `CarColor` w backendzie powinien używać `@JsonCreator` lub `@JsonProperty` dla case-insensitive deserializacji
- Dashboard pokazuje statystyki z całej bazy (nie tylko własne auta) — do poprawy po stronie backendu
