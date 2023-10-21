# React projekt, ESLint, Prettier

## 1. Inštalácia závislostí

Prvým krokom pre prácu na React projekte je inštalácia všetkých potrebných závislostí pomocou príkazu: "npm install"

## 2. Visual Studio Code

Pre lepšiu podporu pre ESLint a Prettier odporúčam používať pre prácu na projekte Visual Studio Code.

## 3. VS Code Extensions

Ak používate Visual Studio Code, odporúčam nainštalovať tieto rozšírenia:

- ESLint: Poskytuje priamu podporu pre ESLint v editore.
- Prettier - Code formatter: Integruje Prettier do Visual Studio Code.

Po inštalácii rozšírenia ESLint môžete pomocou klávesovej skratky "CTRL + SHIFT + P" spustiť funkciu "ESLint: Fix all auto-fixable problems" priamo v IDE, ktorá opraví všetky automaticky opraviteľné chyby v aktuálnom súbore.

Po inštalácii rozšírenia Prettier odporúčam nastaviť vo voľbách Visual Studio Code "Default Formatter" na "Prettier - Code Formatter" a povoliť možnosť "Format on Save" na "On". Tým sa súbor automaticky formátuje pri každom uložení.

## 5. .eslintrc.js a .prettierrc.js

V projekte už existujú základné konfigurácie pre ESLint a Prettier, ktoré je však možné po vzájomnej dohode doplňovať a upravovať tak, aby to všetkým vyhovovalo v čo najväčšej možnej miere.

## 6. Package.json skripty

V súbore package.json existujú skripty pomocou ktorých je okrem iného možné vykonať aj kontrolu, opravu a formátovanie zdrojového kódu pomocou príkazov z príkazového riadku. Niektoré príkazy môžu byť užitočné najmä pre tých, ktorí sa rozhodnú využívať iné IDE ako VS Code. Zoznam všetkých príkazov:

- "npm run dev" - Spustí vývojový server, ktorý umožňuje rýchlu a automatickú obnovu pri zmene kódu.
- "npm run build" - Vytvorí produkčnú verziu projektu
- "npm run preview" - Spustí preview server, ktorý umožňuje zobraziť a otestovať projekt pred jeho nasadením.
- "npm run lint" - Spustí ESLint na kontrolu kvality kódu a formátovania v danom adresári v ktorom sa nachádzate na súboroch s príponami .js, .cjs, .ts a .tsx
- "npm run lint:fix" - Spustí ESLint kontrolu s možnosťou opraviť niektoré problémy v kóde vrátane formátovacích chýb automaticky.

V scriptoch existujú aj príkazy run format a typecheck.

- "npm run format": Spustí nad priečinkom "/src" formátovanie všetkých súborov v s príponami .ts a .tsx.
- "npm run typecheck" - Kontroluje typy v projekte pomocou TypeScript kompilátora, pomáha odhaľovať typové chyby v kóde.

Tieto príkazy však nie je potrebné využívať keďže typecheck by sa mal vykonávať aj v rámci príkazov lint a lint:fix. V rámci príkazu lint:fix sa vykonáva taktiež aj automatické formátovanie.

## 7. Husky pre-commit hook

V projekte existuje taktiež pre-commit hook, ktorý pri pokuse o commit vykonáva kontrolu kódu pomocou príkazu lint. V prípade, že v kóde sa nenachádzajú chyby, commit sa vykoná, v opačnom prípade by mal byť commit zablokovaný.
