# A2 DRONE TRAINER – PROJECT RULES

## 1. ÚČEL

Aplikace slouží jako vlastní výukový a testovací nástroj pro přípravu na zkoušku dálkově řídícího pilota pro podkategorii A2.

Aplikace není oficiální aplikací ÚCL ani EASA a její otázky nesmí být prezentovány jako oficiální databáze ostrých otázek.

## 2. ZÁKLADNÍ PRINCIP

Vždy:

**OVĚŘIT FAKTA → VYHODNOTIT ZDROJE → VYTVOŘIT VÝSTUP → ZNOVU ZKONTROLOVAT VÝSTUP.**

Pokud jde o aktuální legislativu, podmínky zkoušky nebo provozní pravidla, nesmí se spoléhat pouze na vlastní znalosti.

## 3. PRIORITA ZDROJŮ

1. ÚCL – https://www.caa.gov.cz/
2. EASA – https://www.easa.europa.eu/
3. EUR-Lex – https://eur-lex.europa.eu/
4. Autoritativní technické zdroje pro fyziku, elektrotechniku a baterie.
5. Sekundární odborné zdroje.
6. Komerční testové materiály pouze jako inspirace pro témata a formulaci, nikoli jako autorita.

Při rozporu má přednost aktuální autoritativní zdroj. Rozpor se nesmí skrýt.

## 4. AKTUÁLNOST

Vždy ověřuj informace citlivé na změnu, zejména:

- počet otázek A2,
- hranici úspěšnosti,
- požadavky na A2,
- třídy UAS,
- vzdálenosti od osob,
- low-speed režim,
- výškové limity,
- pravidla otevřené kategorie,
- požadavky na pilota,
- registraci,
- provozní omezení.

U každé otázky eviduj datum posledního ověření.

## 5. OFICIÁLNÍ OTÁZKY

Nikdy netvrď:

„Toto je skutečná otázka ze zkoušky ÚCL.“

pokud není oficiálně zveřejněna.

Používej:

„Vlastní tréninková otázka vytvořená podle ověřeného učiva A2.“

## 6. DATABÁZE OTÁZEK

Každá otázka musí mít minimálně:

- unikátní ID,
- kategorii,
- podkategorii,
- otázku,
- 4 možnosti,
- jednu správnou odpověď,
- vysvětlení,
- zdroj,
- stav ověření,
- datum posledního ověření.

Primární soubor databáze:

`data/questions.json`

## 7. ÚROVNĚ OVĚŘENÍ

Používej:

### official
Tvrzení je přímo podloženo aktuálním oficiálním zdrojem ÚCL/EASA.

### technical_verified
Technický princip je ověřen autoritativním technickým zdrojem a podporuje požadované učivo, ale nejde o tvrzení, že jde o oficiální otázku.

### training
Vlastní tréninková otázka založená na ověřených principech.

## 8. TVORBA OTÁZEK

Každá otázka musí mít právě jednu správnou odpověď.

Kontroluj:

- faktickou správnost,
- legislativní správnost,
- jednoznačnost,
- logickou konzistenci,
- jazyk,
- zda jiná odpověď nemůže být také správná.

Pokud otázka není jednoznačná, nesmí být zařazena jako ověřená.

## 9. SITUAČNÍ OTÁZKY

Preferuj otázky, které ověřují pochopení principu.

Příklady vhodných oblastí:

- vítr a rychlost vůči zemi,
- hustota vzduchu,
- teplota,
- baterie a C-rate,
- sériové/paralelní zapojení,
- těžiště,
- užitečné zatížení,
- vzdálenosti od osob,
- low-speed režim.

## 10. KOMERČNÍ TESTOVÉ MATERIÁLY

Komerční materiály mohou být použity pouze jako:

- indikace témat,
- inspirace pro typ otázky,
- podnět k ověření určitého tvrzení.

Nesmí se automaticky přebírat jejich odpovědi ani tvrdit, že jde o oficiální otázky ÚCL.

Každé tvrzení z komerčního zdroje musí být ověřeno primárním zdrojem nebo spolehlivým technickým zdrojem.

## 11. LEGISLATIVA

Pokud se změní předpis nebo oficiální metodika:

1. identifikuj dotčené otázky,
2. ověř jejich zdroje,
3. uprav nebo vyřaď zastaralé otázky,
4. zaznamenej změnu,
5. aktualizuj datum ověření.

Historické otázky nemaž bez důvodu; použij stav `retired`.

## 12. STAVY OTÁZEK

Používej:

- `draft` – vytvořeno, neověřeno,
- `verified` – ověřeno,
- `review` – vyžaduje novou kontrolu,
- `retired` – nepoužívá se, ale zůstává v historii.

## 13. SIMULACE ZKOUŠKY

Pokud aktuální ÚCL stanovuje 30 otázek a 75 %:

- test má 30 otázek,
- minimum je 23 správných odpovědí,
- 22/30 = neúspěch,
- 23/30 = úspěch.

Výpočet musí být programově správný, nikoli ručně zaokrouhlený.

Přesný poměr otázek mezi oblastmi se nesmí v aplikaci vydávat za oficiální, pokud není potvrzen aktuálním zdrojem.

## 14. REŽIM UČENÍ

V režimu učení:

- lze okamžitě vyhodnotit odpověď,
- zobrazit správnou odpověď,
- zobrazit vysvětlení,
- zobrazit zdroj.

## 15. REŽIM ZKOUŠKA

V režimu zkoušky:

- správná odpověď se před koncem nezobrazuje,
- vysvětlení se před koncem nezobrazuje,
- otázky mohou být náhodně promíchány,
- odpovědi mohou být náhodně promíchány,
- výsledek se zobrazí až po dokončení.

## 16. OPAKOVÁNÍ CHYB

Aplikace má evidovat chybné odpovědi a umožnit režim:

**Moje chyby**

Tento režim má přednostně procvičovat otázky, ve kterých uživatel chyboval.

## 17. ODDĚLENÍ DAT A KÓDU

Otázky nesmí být natvrdo vložené do HTML.

Databáze musí být oddělena od:

- UI,
- testovací logiky,
- skórování,
- navigace,
- statistik.

## 18. MINIMÁLNÍ ZMĚNY

Při úpravách aplikace:

- neměň fungující části bez důvodu,
- nemaž funkce,
- neměň globální CSS kvůli lokální změně,
- nezasahuj do společných souborů, pokud to není nutné.

## 19. TESTOVÁNÍ

Před vydáním verze ověř:

- načtení databáze,
- výběr odpovědi,
- vyhodnocení,
- navigaci,
- skóre,
- hranici 22/30,
- hranici 23/30,
- výsledek,
- náhodné pořadí,
- mobilní zobrazení.

## 20. PRAVIDLO „NEVÍM“

Pokud nelze tvrzení spolehlivě ověřit, nesmí být vymyšleno.

Použij:

„Tuto informaci se nepodařilo spolehlivě ověřit.“

## 21. KONTROLA PŘED VÝSTUPEM

Před každou změnou databáze nebo aplikace:

1. Identifikuj fakta.
2. Urči, která mohou být zastaralá.
3. Ověř je.
4. Porovnej zdroje.
5. Vyřeš rozpory.
6. Zkontroluj logiku.
7. Vytvoř výstup.
8. Znovu zkontroluj výstup proti zdrojům.

## 22. HLAVNÍ CÍL

Cílem není naučit uživatele mechanicky odpovědi.

Cílem je naučit ho:

**pochopit pravidla, principy a rozhodování potřebné pro bezpečný provoz UAS v A2.**

Faktická správnost má vždy přednost před množstvím otázek, rychlostí tvorby a designem aplikace.
