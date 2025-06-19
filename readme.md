# Grafové algoritmy pro hledání nejkratší cesty

## 1. Úvod do grafů

### Definice grafu

**Graf** je matematická struktura G = (V, E), kde:
- V je množina vrcholů (vertices/nodes)
- E je množina hran (edges) spojujících dvojice vrcholů

#### Typy grafů:

**Neorientovaný graf**: Hrany nemají směr, spojení mezi vrcholy je obousměrné.
- Hrana {u, v} = {v, u}
- Příklad: silniční síť, sociální sítě

**Orientovaný graf (digraf)**: Hrany mají směr, značené jako (u, v).
- Hrana (u, v) ≠ (v, u)
- Příklad: jednosměrné ulice, webové odkazy

**Ohodnocený graf**: Každá hrana má přiřazenou váhu w(u, v).
- Váha může reprezentovat vzdálenost, čas, cenu
- Může být kladná i záporná

### Kostra grafu

**Kostra (spanning tree)** souvislého grafu G je podgraf, který:
- Obsahuje všechny vrcholy grafu G
- Je souvislý (existuje cesta mezi každými dvěma vrcholy)
- Je acyklický (neobsahuje cykly)

**Minimální kostra** je kostra s nejmenším součtem vah hran.

### Reprezentace grafů

#### Matice sousednosti
- 2D pole A[n][n], kde n je počet vrcholů
- A[i][j] = váha hrany mezi vrcholy i a j
- A[i][j] = 0 nebo ∞ pokud hrana neexistuje

**Výhody:**
- Rychlé zjištění existence hrany O(1)
- Vhodné pro husté grafy

**Nevýhody:**
- Prostorová složitost O(n²)
- Neefektivní pro řídké grafy

#### Seznam sousedů
- Pro každý vrchol seznam jeho sousedů
- Často implementován jako pole linked listů

**Výhody:**
- Prostorová složitost O(V + E)
- Efektivní pro řídké grafy

**Nevýhody:**
- Pomalejší zjištění existence hrany O(deg(v))

### Reálné příklady využití

**Navigační systémy:**
- Vrcholy: křižovatky, města
- Hrany: silnice s váhami (vzdálenost, čas jízdy)

**Počítačové sítě:**
- Vrcholy: routery, servery
- Hrany: síťová spojení s váhami (latence, propustnost)

**Plánování tras:**
- Vrcholy: letiště, stanice
- Hrany: lety, spoje s váhami (cena, čas)

**Sociální sítě:**
- Vrcholy: uživatelé
- Hrany: přátelství, následování

## 2. Problém hledání nejkratší cesty

### Co znamená „nejkratší cesta"

Nejkratší cesta mezi vrcholy u a v je cesta s minimálním součtem vah hran.

**Formálně:** Pro cestu P = v₀, v₁, ..., vₖ je délka cesty:
```
d(P) = Σ w(vᵢ, vᵢ₊₁) pro i = 0 až k-1
```

### Varianty problému:

1. **Single-source shortest path**: Nejkratší cesty z jednoho vrcholu do všech ostatních
2. **Single-destination shortest path**: Nejkratší cesty ze všech vrcholů do jednoho cíle
3. **Single-pair shortest path**: Nejkratší cesta mezi dvěma konkrétními vrcholy
4. **All-pairs shortest path**: Nejkratší cesty mezi všemi páry vrcholů

### Negativní hrany a jejich vliv

**Negativní hrany** mohou způsobit problémy:

1. **Negativní cykly**: Cyklus se záporným součtem vah
   - Teoreticky nekonečně krátká cesta
   - Musí být detekovány

2. **Omezení algoritmů**:
   - Dijkstrův algoritmus nefunguje s negativními hranami
   - Bellman-Ford zvládá negativní hrany i detekuje negativní cykly

## 3. Přehled algoritmů

### a) Dijkstrův algoritmus

**Princip:**
- Greedy algoritmus založený na postupném rozšiřování množiny vrcholů s nejkratší cestou
- Používá prioritní frontu pro výběr vrcholu s nejmenší vzdáleností
- Relaxace hran: aktualizace vzdáleností sousedních vrcholů

**Algoritmus:**
1. Inicializace: vzdálenost startovacího vrcholu = 0, ostatní = ∞
2. Vlož všechny vrcholy do prioritní fronty
3. Dokud není fronta prázdná:
   - Vyber vrchol u s nejmenší vzdáleností
   - Pro každého souseda v vrcholu u:
     - Pokud dist[u] + w(u,v) < dist[v], aktualizuj dist[v]

**Omezení:**
- Nefunguje s negativními hranami
- Greedy volby nejsou optimální při negativních vahách

**Časová složitost:**
- S binární haldou: O((V + E) log V)
- S Fibonacci haldou: O(E + V log V)
- S polem: O(V²)

### b) Bellman-Fordův algoritmus

**Princip:**
- Dynamické programování s postupnou relaxací všech hran
- Provádí V-1 iterací (V = počet vrcholů)
- Každá iterace zkontroluje všechny hrany

**Algoritmus:**
1. Inicializace: dist[start] = 0, ostatní dist[v] = ∞
2. Pro i = 1 až V-1:
   - Pro každou hranu (u, v):
     - Pokud dist[u] + w(u,v) < dist[v], aktualizuj dist[v]
3. Kontrola negativních cyklů (V-tá iterace)

**Výhody:**
- Funguje s negativními hranami
- Detekuje negativní cykly
- Jednoduchá implementace

**Detekce záporných cyklů:**
Pokud lze v V-té iteraci ještě zlepšit některou vzdálenost, existuje negativní cyklus.

**Časová složitost:** O(VE)

### c) Floyd-Warshallův algoritmus

**Princip:**
- Dynamické programování pro all-pairs shortest paths
- Postupně zkoušíme vrcholy jako mezilehlé body cesty
- Matice vzdáleností se postupně aktualizuje

**Algoritmus:**
```
Pro k = 1 až n:
  Pro i = 1 až n:
    Pro j = 1 až n:
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

**Výhody:**
- Řeší all-pairs problém
- Funguje s negativními hranami
- Detekuje negativní cykly

**Časová složitost:** O(V³)
**Prostorová složitost:** O(V²)

## Porovnání algoritmů

| Algoritmus | Časová složitost | Negativní hrany | Použití |
|------------|------------------|----------------|---------|
| Dijkstra | O(E + V log V) | ❌ | Single-source, kladné váhy |
| Bellman-Ford | O(VE) | ✅ | Single-source, detekce cyklů |
| Floyd-Warshall | O(V³) | ✅ | All-pairs |

## Další algoritmy

**A* algoritmus:**
- Rozšíření Dijkstry s heuristikou
- Používá odhad vzdálenosti do cíle
- Efektivní pro konkrétní cíl

**Johnsonův algoritmus:**
- Kombinuje Bellman-Ford a Dijkstru
- Efektivní pro all-pairs s negativními hranami
- Časová složitost: O(V²log V + VE)