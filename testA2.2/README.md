# A2 Drone Trainer

Vlastní webová aplikace pro přípravu na zkoušku dálkově řídícího pilota UAS v podkategorii A2.

## Aktuální struktura

```text
testA2.2/
├── index.html
├── RULES.md
├── README.md
├── CLEANUP.md
├── css/
│   └── style.css
├── js/
│   └── app.js
└── data/
    └── questions.json
```

Aplikace používá jednu společnou databázi otázek a jeden testovací engine. Samostatný `test.html` se nepoužívá.

## Databáze

`data/questions.json` obsahuje 650 otázek vytěžených z licencovaného PDF Odronech.cz. Jedna otázka je označena `review` kvůli víceznačnému označení správných odpovědí ve zdroji a není načítána do aktivního procvičování.

Pro uživatelské filtrování jsou otázky rozděleny do 6 hlavních bloků:

- Meteorologie
- Výkonnost a konstrukce UAS
- Baterie a elektrické systémy
- Rizika a bezpečnost provozu
- Pravidla A2 a Open
- Ostatní témata

Každá otázka má současně podtéma, takže detailnější členění lze později použít bez změny databáze.

## Funkce

- Učení podle tematického bloku
- Simulace zkoušky
- Moje chyby
- náhodné pořadí otázek
- náhodné pořadí odpovědí A–D
- okamžité vysvětlení v režimu Učení a Moje chyby
- automatický posun k vysvětlení po odpovědi
- plovoucí navigace Předchozí / Další
- ukládání chyb do `localStorage`
- databáze oddělená od kódu

## Důležitá zásada

Stávající funkční aplikace se upravuje minimálně. Rozšíření databáze nemá vytvářet paralelní testovací aplikaci ani nový `test.html`.

Nejdříve ověřit fakta, potom vytvořit výstup a výsledek před předáním znovu zkontrolovat.
