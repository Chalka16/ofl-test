# A2 Drone Trainer

Vlastní webová aplikace pro přípravu na zkoušku dálkově řídícího pilota UAS v podkategorii A2.

## Čistá V1 struktura

```text
A2_Drone_Trainer/
├── index.html
├── RULES.md
├── README.md
├── css/
│   └── style.css
├── js/
│   └── app.js
└── data/
    └── questions.json
```

Aplikace používá **jeden HTML soubor, jeden CSS soubor, jeden JS soubor a jeden zdroj otázek**. Test není veden jako samostatná paralelní aplikace.

## Aktuální databáze

`data/questions.json`

V tomto balíčku je současný testový vzorek 30 vlastních otázek (`datasetVersion: 0.3-sample`).

Nejde o oficiální databázi otázek ÚCL.

## Funkce

- Učení
- Simulace zkoušky
- Moje chyby
- náhodné pořadí otázek
- náhodné pořadí odpovědí A–D
- okamžité vysvětlení v režimu Učení
- automatický posun k vysvětlení po odpovědi
- plovoucí navigace Předchozí / Další
- výsledek se zaměřením na chybné otázky
- Zopakovat chybné otázky
- ukládání chyb do `localStorage`
- databáze oddělená od kódu

## Co zde záměrně není

- časový limit testu – dokud není samostatně ověřen jako aktuální oficiální parametr
- další paralelní `test.html`, `test.js`, `test.css`
- duplicitní databáze otázek

## Důležitá zásada

Nejdříve ověřit fakta, potom vytvořit výstup a výsledek před předáním znovu zkontrolovat.
