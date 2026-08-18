# A2 DRONE TRAINER – MASTER PROJECT RULES

## 1. STATUS DOKUMENTU

Tento dokument je jediný závazný soubor pravidel pro další práci na projektu A2 Drone Trainer.

Všechny dřívější verze RULES.md, README pokyny a neformální pracovní instrukce, které jsou s tímto dokumentem v rozporu, se považují za neplatné.

---

## 2. CÍL APLIKACE

A2 Drone Trainer je vlastní webová výuková a testovací aplikace pro přípravu na zkoušku dálkově řídícího pilota bezpilotních systémů v podkategorii A2.

Aplikace není oficiální aplikací ÚCL ani EASA a nesmí vytvářet dojem, že je ÚCL nebo EASA schválena či provozována.

Cílem je umožnit studium a procvičování učiva A2 a vytvořit přehlednou simulaci testu.

---

## 3. HLAVNÍ ZDROJ OTÁZEK A UČIVA

### Odronech.cz – A2 Kompletní studijní materiály, Kategorie A2

Pro otázkovou databázi je hlavním zdrojem licencovaný PDF materiál Odronech.cz.

Uživatel má oprávnění použít jeho obsah ve své aplikaci.

To znamená, že lze do aplikace převzít doslova:

- výukový text,
- otázky,
- všechny možnosti odpovědí,
- správné odpovědi,
- vysvětlení,
- tabulky,
- příklady,
- další relevantní části materiálu.

### Zásadní pravidlo

Dosavadní mnou vytvořená sada 30 otázek se NEPOUŽÍVÁ jako základ nové databáze.

Považuje se za zrušenou pracovní verzi.

Nová databáze otázek se vytvoří od začátku z PDF materiálu.

Do nové databáze se nesmí omylem přimíchat staré vlastní otázky.

---

## 4. VĚRNOST ZDROJOVÉMU MATERIÁLU

Při vytěžování PDF:

- zachovej původní české znění,
- zachovej terminologii,
- zachovej strukturu,
- zachovej původní otázky,
- zachovej původní možnosti odpovědí,
- zachovej správnou odpověď,
- zachovej původní vysvětlení.

Neprováděj automatické „vylepšování“ otázek.

Neměň distraktory jen proto, že se zdají příliš jednoduché.

Nepřepisuj otázku podle vlastního názoru.

Nepřekládej český materiál do angličtiny ani ho zpětně nepřekládej z anglických zdrojů.

Pokud není požadována úprava, zdrojový obsah zůstává obsahově nezměněn.

---

## 5. ODDĚLENÍ ZDROJE A OVĚŘENÍ

Zdrojový obsah a jeho ověření jsou dvě různé věci.

Například:

```text
SOURCE
Odronech.cz PDF
strana 87
původní otázka
původní odpovědi
původní vysvětlení

VERIFICATION
ověření aktuálnosti a správnosti
```

Ověření nesmí automaticky změnit originální text.

Pokud je nalezen problém, zachovej původní znění a problém označ.

Případná opravená verze musí být uvedena samostatně.

---

## 6. ČESKÝ VÝKLAD

Český výklad v licencovaném PDF je pro výukový obsah aplikace zásadní.

Nepovažuj český text automaticky za chybný jen proto, že anglický zdroj EASA používá jinou formulaci.

Nejdříve rozliš:

- rozdíl v překladu,
- terminologický rozdíl,
- stylistický rozdíl,
- zjednodušený výklad,
- skutečný věcný rozpor.

Pouze skutečný věcný rozpor vyžaduje další zásah.

---

## 7. PRIORITA AUTORITATIVNÍCH ZDROJŮ

Při ověřování aktuálních právních nebo zkouškových informací používej především:

1. ÚCL – české informace a podmínky zkoušky.
2. Aktuální české znění příslušných právních předpisů.
3. EASA – evropské metodické a vysvětlující informace.
4. EUR-Lex – právní znění evropských předpisů.
5. Odborné technické zdroje – fyzika, meteorologie, elektrotechnika, baterie apod.

Odronech PDF je hlavním zdrojem výukového obsahu a otázek, ale není samo o sobě autoritou pro právní aktuálnost.

---

## 8. JAK PRACOVAT S ROZPOREM

Pokud PDF a aktuální autoritativní zdroj říkají něco odlišného:

1. zachovej původní obsah PDF,
2. přesně identifikuj rozdíl,
3. zjisti, zda jde pouze o terminologii/překlad,
4. pokud jde o skutečný věcný rozpor, označ jej,
5. ověř aktuální stav podle ÚCL / českého právního znění,
6. navrhni případnou opravu samostatně.

Nikdy nesmí být rozpor skryt.

Nikdy nesmí být původní PDF tiše přepsáno.

---

## 9. OTÁZKY – PŮVOD

Každá otázka musí mít evidovaný původ.

Pro otázky z hlavního PDF používej například:

```json
"sourceType": "odronech_pdf"
```

Pro případné vlastní otázky:

```json
"sourceType": "own"
```

Pro otázky přímo z oficiálního zdroje:

```json
"sourceType": "ucl"
```

Otázka z PDF zůstává otázkou z PDF i v případě, že je technicky převedena do JSON.

---

## 10. VLASTNÍ OTÁZKY

Vlastní otázky nejsou zakázány.

Není ale cílem nyní vytvářet novou vlastní sadu místo otázek z PDF.

Nejdříve musí být kompletně vytěžena a zpracována databáze z PDF.

Vlastní otázky lze přidat až následně jako samostatné rozšíření, pokud bude potřeba.

Neexistuje pravidlo, že vlastní otázka musí být odlišná od zdrojové otázky.

---

## 11. OFICIÁLNÍ OTÁZKY

Nikdy netvrď, že otázka je skutečnou otázkou ze zkoušky ÚCL, pokud ji ÚCL oficiálně nezveřejnil.

U otázky z PDF používej například:

> „Otázka převzatá z licencovaného studijního materiálu Odronech.cz.“

U vlastní otázky:

> „Vlastní tréninková otázka.“

---

## 12. DATOVÁ STRUKTURA OTÁZKY

Každá otázka v `data/questions.json` má obsahovat minimálně:

- `id`
- `category`
- `subcategory`
- `difficulty`
- `question`
- `options`
- `correctAnswer`
- `explanation`
- `source`
- `sourceType`
- `sourcePage`, pokud je známá
- `status`
- `verificationLevel`
- `verificationBasis`
- `tags`
- `lastVerified`

Příklad:

```json
{
  "id": "PDF-A2-001",
  "category": "meteorologie",
  "subcategory": "vítr",
  "difficulty": "medium",
  "question": "...",
  "options": [
    "...",
    "...",
    "...",
    "..."
  ],
  "correctAnswer": 1,
  "explanation": "...",
  "source": "Odronech.cz – A2 Kompletní studijní materiály",
  "sourceType": "odronech_pdf",
  "sourcePage": 87,
  "status": "verified",
  "verificationLevel": "source_verified",
  "verificationBasis": "...",
  "tags": ["vítr"],
  "lastVerified": "YYYY-MM-DD"
}
```

---

## 13. SPRÁVNÁ ODPOVĚĎ

Každá otázka musí mít právě jednu správnou odpověď.

Při převodu PDF nesmí dojít k omylu v mapování správné odpovědi.

Před vložením do databáze zkontroluj:

- text otázky,
- všechny čtyři možnosti,
- správnou možnost,
- vysvětlení.

---

## 14. VYTAŽENÍ PDF

Při vytěžování celého PDF postupuj systematicky.

Nejdříve vytvoř inventuru:

- počet kapitol,
- počet podkapitol,
- počet otázek,
- tematické oblasti,
- případné duplicity,
- obrázky,
- tabulky,
- výpočty.

Potom vytvoř databázi otázek.

Každá otázka musí zůstat dohledatelná ke konkrétní části PDF.

Pokud je dostupné číslo stránky, ulož ho.

---

## 15. DUPLICITY

Pokud se stejná otázka v PDF objeví vícekrát:

- neztrácej informaci o výskytu,
- zjisti, zda jde o skutečnou duplicitu,
- neprováděj automatické mazání.

Pokud je vhodné mít v databázi pouze jednu instanci, zachovej informaci o všech známých výskytech.

---

## 16. OBRÁZKY A TABULKY

Pokud otázka nebo vysvětlení závisí na obrázku, grafu nebo tabulce:

- zachovej vazbu na daný obsah,
- nevytvářej odpověď pouze podle odhadu z textu,
- pokud obrázek nelze spolehlivě interpretovat, označ otázku `review`.

---

## 17. VERIFIKAČNÍ ÚROVNĚ

Používej:

### `source_verified`

Obsah odpovídá zdrojovému PDF a nebyl nalezen relevantní rozpor.

### `official`

Tvrzení je přímo potvrzeno aktuálním autoritativním zdrojem.

### `technical_verified`

Technický princip je ověřen odborným technickým zdrojem.

### `review`

Existuje nejistota, rozpor nebo nedostatečné ověření.

### `retired`

Obsah se již nepoužívá, ale zachovává se v historii.

---

## 18. STAVY OTÁZEK

Používej:

- `draft` – ještě nezpracováno/ověřeno,
- `verified` – zkontrolováno a připraveno,
- `review` – vyžaduje kontrolu,
- `retired` – nepoužívá se, ale zůstává v historii.

---

## 19. PRÁVNĚ CITLIVÉ INFORMACE

Vždy zvlášť kontroluj informace, které se mohou měnit:

- počet otázek,
- hranici úspěšnosti,
- požadavky A2,
- minimální vzdálenosti,
- low-speed režim,
- výškové limity,
- třídy UAS,
- provozní omezení,
- registraci,
- požadavky na pilota.

Při změně předpisu identifikuj všechny dotčené otázky.

---

## 20. VÝUKOVÝ REŽIM APLIKACE

V režimu UČENÍ:

1. uživatel odpoví,
2. odpověď se okamžitě vyhodnotí,
3. zobrazí se správná odpověď,
4. zobrazí se vysvětlení,
5. zobrazí se zdroj,
6. uživatel pokračuje na další otázku.

Po vyhodnocení se může obrazovka automaticky posunout k vysvětlení a navigaci.

---

## 21. MOJE CHYBY

Aplikace eviduje otázky, ve kterých uživatel chyboval.

Režim MOJE CHYBY musí fungovat stejně jako UČENÍ:

```text
odpověď
↓
vyhodnocení
↓
správná odpověď
↓
vysvětlení
↓
další otázka
```

---

## 22. REŽIM ZKOUŠKA

V režimu ZKOUŠKA:

- správná odpověď se před koncem nezobrazuje,
- vysvětlení se před koncem nezobrazuje,
- otázky mohou být náhodně promíchány,
- odpovědi mohou být náhodně promíchány,
- výsledek se zobrazí až po dokončení.

---

## 23. NÁHODNÉ POŘADÍ ODPOVĚDÍ

Správná odpověď nesmí být systematicky na pozici A.

Při náhodném promíchání odpovědí musí aplikace zachovat správnou vazbu na `correctAnswer`.

---

## 24. SKÓROVÁNÍ

Pokud aktuální oficiální podmínky stanovují 30 otázek a hranici 75 %:

- 30/30 = úspěch,
- 23/30 = úspěch,
- 22/30 = neúspěch.

Výpočet musí být programově správný.

Pokud se oficiální podmínky změní, aplikace se musí aktualizovat podle aktuálního zdroje.

---

## 25. ODDĚLENÍ DAT A KÓDU

Otázky nesmí být natvrdo vložené do HTML.

Primární databáze:

```text
data/questions.json
```

Databáze musí být oddělena od:

- UI,
- testovací logiky,
- skórování,
- navigace,
- statistik.

---

## 26. MINIMÁLNÍ ZMĚNY V APLIKACI

Při úpravách:

- neměň fungující části bez důvodu,
- nemaž funkce,
- neměň globální CSS kvůli lokální změně,
- nezasahuj do společných souborů, pokud to není nutné.

Pokud je požadována pouze drobná změna, proveď pouze tuto změnu.

---

## 27. KONTROLA PŘED VYTVOŘENÍM VÝSTUPU

Před každou změnou:

1. identifikuj požadavek,
2. zjisti zdroj,
3. zjisti, zda jde o zdrojový nebo vlastní obsah,
4. identifikuj fakta citlivá na změnu,
5. ověř je,
6. vytvoř výstup,
7. znovu zkontroluj výstup proti zdroji a zadání.

---

## 28. KONTROLA DATABÁZE

Před vydáním `questions.json` ověř:

- validní JSON,
- unikátní ID,
- přesně 4 možnosti u každé otázky,
- právě jednu správnou odpověď,
- existující vysvětlení,
- zdroj,
- původ otázky,
- stav,
- verifikační úroveň,
- datum ověření.

U zdrojových otázek navíc ověř shodu s PDF.

---

## 29. KONTROLA APLIKACE

Před vydáním verze ověř:

- načtení databáze,
- zobrazení otázky,
- výběr odpovědi,
- okamžité vyhodnocení v UČENÍ,
- okamžité vyhodnocení v MOJE CHYBY,
- vysvětlení,
- další/předchozí,
- náhodné pořadí,
- zkouškový režim,
- skóre,
- hranici 22/30 a 23/30,
- výsledek,
- mobilní zobrazení.

---

## 30. KONTROLA ZIPU

Pokud je vytvořen ZIP:

1. vytvoř ZIP,
2. znovu jej otevři,
3. zkontroluj všechny soubory,
4. zkontroluj cesty,
5. ověř důležité soubory,
6. teprve potom jej nabídni ke stažení.

Nikdy netvrď, že je výstup zkontrolovaný, pokud skutečně zkontrolovaný nebyl.

---

## 31. PRAVIDLO „NEVÍM“

Pokud zdroj nedává dostatečnou odpověď:

> „Tuto informaci se nepodařilo spolehlivě ověřit.“

Nevymýšlej chybějící informace.

Nedoplňuj automaticky vlastní znalosti tak, aby vznikla zdánlivě kompletní odpověď.

---

## 32. HISTORIE

Historické verze mohou zůstat mimo aktivní databázi.

Dosavadní vlastní sada 30 otázek se nepřenáší do nové databáze.

Nová databáze začíná od licencovaného PDF.

---

## 33. HLAVNÍ ZÁSADA

**Nejdříve ověřit zdroj. Potom vytvořit výstup. Nakonec výstup znovu zkontrolovat.**

**Zdrojový obsah PDF zachovat věrně.**

**Nezaměňovat zdrojový obsah za vlastní tvorbu.**

**Nezaměňovat výklad za právní autoritu.**

**Nevymýšlet informace, které zdroj nepodporuje.**
