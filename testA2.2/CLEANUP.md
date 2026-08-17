# ÚKLID PROJEKTU – CO NECHAT A CO SMAZAT

## NECHAT

```text
index.html
css/style.css
js/app.js
data/questions.json
README.md
RULES.md
```

Toto je nyní jediná používaná struktura aplikace.

## SMAZAT

```text
test.html
test.js
test.css
questions.json
```

Tyto soubory jsou staré paralelní varianty testu/databáze a jejich ponechání by způsobovalo zmatek.

## Důležité

Pokud máš ve složce současně:

```text
data/questions.json
questions.json
```

ponech pouze:

```text
data/questions.json
```

Pokud máš současně:

```text
js/app.js
test.js
```

ponech pouze:

```text
js/app.js
```

Pokud máš současně:

```text
css/style.css
test.css
```

ponech pouze:

```text
css/style.css
```

Aplikace se spouští přes:

```text
index.html
```

a `index.html` načítá:

```text
css/style.css
js/app.js
data/questions.json
```

## MACOS

Složku:

```text
__MACOSX
```

nepotřebuješ. Je to pouze pomocná metadata složka vytvořená macOS při zipování.
