# A2 Drone Trainer

Vlastní webová aplikace pro přípravu na zkoušku dálkově řídícího pilota UAS v podkategorii A2.

## Stav projektu

Aktuální databáze:

`A2_MASTER_v0.2.json`

Obsahuje první sadu 30 vlastních tréninkových otázek.

**Nejde o oficiální databázi otázek ÚCL.**

## Zdroje

Primární zdroje:

- Úřad pro civilní letectví ČR (ÚCL)
- European Union Aviation Safety Agency (EASA)
- EUR-Lex

Doplňkové technické zdroje se používají pouze tam, kde oficiální dokumentace stanovuje požadovanou znalost, ale neposkytuje dostatečný fyzikální nebo technický výklad.

## Databáze

Každá otázka obsahuje:

- `id`
- `category`
- `subcategory`
- `difficulty`
- `question`
- `options`
- `correctAnswer`
- `explanation`
- `source`
- `status`
- `verificationBasis`
- `verificationLevel`
- `tags`
- `lastVerified`

## Verification levels

`official`  
Přímo ověřeno v aktuálním oficiálním zdroji.

`technical_verified`  
Technický princip ověřený odborným zdrojem; nejde o tvrzení, že jde o oficiální otázku.

`training`  
Vlastní tréninková otázka vytvořená z ověřeného učiva.

## Plán aplikace

### V1

- úvod,
- výběr režimu,
- trénink,
- simulace A2,
- vyhodnocení,
- opakování chybných otázek,
- načítání otázek z JSON.

### Později

- statistiky,
- úspěšnost podle témat,
- obtížnost,
- historie testů,
- automatické opakování slabých oblastí,
- verzování databáze.

## Zásada projektu

**Nejdříve ověřit fakta, potom vytvořit výstup.**

Podrobné závazné zásady jsou v `RULES.md`.

## Poznámka k aktuálnosti

Pravidla A2 a související evropská legislativa se mohou měnit. Databáze proto obsahuje datum posledního ověření každé otázky a otázky mohou být označeny jako `review` nebo `retired`.

## Licenční a obsahová zásada

Komerční přípravné materiály neslouží jako autorita a nemají být mechanicky kopírovány do databáze. Slouží pouze jako doplňkový zdroj pro identifikaci témat a typů otázek.

Aplikace nemá vyvolávat dojem oficiálního schválení nebo provozování ÚCL či EASA.
