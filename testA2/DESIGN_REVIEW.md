# A2 Drone Trainer – Test V3

## Co bylo opraveno

### UX
- Navigace Předchozí / Další je trvale plovoucí ve spodní části.
- V režimu Učení se po zvolení odpovědi automaticky posune obrazovka k vysvětlení.
- Vysvětlení je v režimu Zkouška během testu skryté.
- Výsledek zobrazuje především skóre a chybné otázky.
- Výsledek obsahuje tlačítko „Zopakovat chybné otázky“.

### Odpovědi
- Pořadí odpovědí se při vykreslení každé otázky náhodně zamíchává.
- Správná odpověď se proto nemůže systematicky objevovat na pozici A.
- `correctAnswer` v JSON zůstává indexem původní možnosti; JS pracuje s mapováním po zamíchání.

### Databáze
Otázky jsou oddělené od HTML a JS v `data/questions.json`.

## Obsahový vzorek

Tato verze obsahuje 10 referenčních otázek. Nejde o kompletní testovou databázi.

Záměrně jsou použity:
- situační otázky,
- výpočty,
- otázky založené na skutečných provozních podmínkách,
- věrohodnější distraktory,
- technické otázky s odděleným označením `technical_verified`.

## Zdrojová kontrola

Aktuální stránka ÚCL uvádí, že A2 zkouška probíhá jako test s 30 otázkami a minimální úspěšností 75 %. EASA v aktuální revizi Easy Access Rules z června 2026 uvádí A2 témata meteorologie, výkonnost UAS a technická/provozní opatření ke zmírnění rizik; současně stanovuje podmínky 30 m / až 5 m v low-speed režimu a referenční pravidlo 1:1.

## Poznámka

Časový limit není v této V3 vydáván za oficiální parametr zkoušky. Vizuální časovač z předchozího prototypu byl proto odstraněn, dokud jeho aktuální hodnotu samostatně neověříme.

## Kontrola před vydáním

- 10 otázek: OK
- 4 možnosti u každé: OK
- unikátní ID: OK
- právě jedna správná možnost: OK
- oddělená databáze: OK
- náhodné pořadí odpovědí: OK
- režim Učení: OK
- režim Zkouška bez vysvětlení před koncem: OK
- automatický scroll k vysvětlení: OK
- plovoucí navigace: OK
- rozbor pouze chybných otázek: OK
- opakování chybných otázek: OK
