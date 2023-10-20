# React projekt, ESLint, Prettier

## 1. Inštalácia závislostí

Prvým krokom pre prácu na React projekte je inštalácia všetkých potrebných závislostí pomocou príkazu: "npm install"

## 2. Visual Studio Code

Pre prácu na vývoji odporúčam používať Visual Studio Code, pre lepšiu podporu pre ESLint a Prettier.

## 3. VS Code Extensions

V prípade využívania vývojového prostredia VS Code odporúčam nainštalovať tieto VS Code rozšírenia:

- ESLint: Poskytuje podporu pre ESLint priamo v editore.
- Prettier - Code formatter: Integrácia Prettier do VS Code.

Po nainštalovaní extension ESLint je možné pomocou skratky "CTRL + SHIFT + P", spustiť priamo v IDE funkciu ESLint: Fix all auto-fixable problems, ktorá v otvorenom súbore opraví všetko automatický opraviteľné chyby.

V prípade nainštalovania extension Prettier, odporúčam v nastaveniach VS Code nastaviť funkciu "Default Formatter" na hodnotu "Prettier - Code Formatter" a taktiež zapnúť funkciu "Format on Save" na hodnotu "On" vďaka čomu sa bude daný súbor na ktorom pracujete automatický formátovať pri každom uložení.

## 5. .eslintrc.js a .prettierrc.js

V projekte už existujú základné konfigurácie pre ESLint a Prettier, ktoré je však možné po vzájomnej dohode doplňovať a upravovať tak, aby to všetkým vyhovovalo v najväčšej možnej miere.

## 6. Package.json skripty

V súbore package.json existujú skripty pomocou ktorých je okrem iného možné vykonať aj kontrolu, opravu a formátovanie zdrojového kódu pomocou príkazov z príkazového riadku. Príkazy ako sú lint a format sú užitočné najmä pre tých, ktorí sa rozhodnú využívať iné IDE ako VS Code. Zoznam všetkých príkazov:

- "npm run dev" - Spustí vývojový server, ktorý umožňuje rýchlu a automatickú obnovu pri zmene kódu.
- "npm run build" - Vytvorí produkčnú verziu projektu
- "npm run lint" - Spustí ESLint na kontrolu kvality kódu v projekte/v danom priečinku v ktorom sa nachádzate na súboroch s príponami .js, .cjs, .ts a .tsx
- "npm run lint:fix" - Spustí ESLint kontrolu s možnosťou opraviť niektoré problémy v kóde automaticky.
- "npm run format": Spustí nad priečinkom "/src" formátovanie všetkých súborov v s príponami .ts a .tsx.
- "npm run typecheck" - Kontroluje typy v projekte pomocou TypeScript kompilátora, ale neprodukuje žiadne výstupy. Pomáha odhaľovať typové chyby v kóde.
- "npm run preview" - Spustí preview server, ktorý umožňuje zobraziť a otestovať projekt pred jeho nasadením.
