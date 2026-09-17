#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
How to be a Hero — Vertical Slice 0.1
Ein minimales, vollständig spielbares Singleplayer-Text-Adventure.
Nur Standardbibliothek. Eine Datei. Terminal.

Inspiriert von den Grundideen von "How to be a Hero":
wenige Attribute, W10-Proben, Entscheidungen mit Konsequenzen.
"""

import random
import sys


# ---------------------------------------------------------------------------
# Konstanten
# ---------------------------------------------------------------------------

LEICHT = 8
MITTEL = 12
SCHWER = 15

START_LP = 10
MAX_LP = 10

# Gegenstands-Namen (einheitlich verwenden, keine Tippfehler-Fallen)
HEILTRANK = "Heiltrank"
SCHLUESSEL = "Schlüssel"
GOLD = "Gold"


# ---------------------------------------------------------------------------
# Held / Spielzustand
# ---------------------------------------------------------------------------

class Held:
    """Alles, was der Prototyp über den Helden wissen muss."""

    def __init__(self, name, staerke, geschick, charisma):
        self.name = name
        self.staerke = staerke
        self.geschick = geschick
        self.charisma = charisma
        self.lp = START_LP
        self.inventar = []          # einfache Textliste
        self.gold = 0               # Gold als Zahl, nicht als 20 einzelne Einträge

        # Zustände, die spätere Szenen beeinflussen
        self.banditen_gewarnt = False
        self.buergermeister_vertraut = False
        self.verwundet = False

        # Weitere Flags für Enden / Flusssteuerung (leicht erweiterbar)
        self.auftrag_erhalten = False
        self.lager_geloest = False
        self.loesungsweg = None     # "kampf" | "schleich" | "ueberreden" | None
        self.lebend = True
        self.beute_gerettet = False

    def tot(self):
        return self.lp <= 0 or not self.lebend


# ---------------------------------------------------------------------------
# Ein-/Ausgabe-Helfer
# ---------------------------------------------------------------------------

def trenne(titel=""):
    """Visueller Abschnitt im Terminal."""
    print()
    print("=" * 60)
    if titel:
        print(titel)
        print("=" * 60)
    print()


def absatz(*zeilen):
    """Mehrere Textzeilen mit Leerzeile danach."""
    for z in zeilen:
        print(z)
    print()


def warte():
    """Kurze Pause, damit der Spieler lesen kann."""
    try:
        input("[Enter]")
    except EOFError:
        print()


def frage_int(prompt, minimum, maximum):
    """Zahl zwischen minimum und maximum abfragen."""
    while True:
        try:
            roh = input(prompt).strip()
            wert = int(roh)
            if minimum <= wert <= maximum:
                return wert
            print(f"Bitte eine Zahl zwischen {minimum} und {maximum} eingeben.")
        except ValueError:
            print("Das war keine Zahl.")
        except EOFError:
            print()
            return minimum


def auswahl(optionen):
    """
    Zeigt nummerierte Optionen und gibt den gewählten Index (0-basiert) zurück.
    optionen: Liste von Strings.
    """
    print()
    for i, text in enumerate(optionen, start=1):
        print(f"  {i}. {text}")
    print()
    nummer = frage_int("Deine Wahl: ", 1, len(optionen))
    print()
    return nummer - 1


def status(held):
    """Kompakte Statuszeile — jederzeit aufrufbar."""
    items = ", ".join(held.inventar) if held.inventar else "—"
    flags = []
    if held.verwundet:
        flags.append("verwundet")
    if held.banditen_gewarnt:
        flags.append("Banditen gewarnt")
    if held.buergermeister_vertraut:
        flags.append("Bürgermeister vertraut dir")
    flag_text = (" | " + ", ".join(flags)) if flags else ""
    print(
        f"[ {held.name} | LP {held.lp}/{MAX_LP} | "
        f"ST {held.staerke} GE {held.geschick} CH {held.charisma} | "
        f"Gold {held.gold} | Beutel: {items}{flag_text} ]"
    )
    print()


# ---------------------------------------------------------------------------
# Würfel / Proben / Schaden / Inventar
# ---------------------------------------------------------------------------

def w10():
    """Ein zehnseitiger Würfel (1–10)."""
    return random.randint(1, 10)


def probe(held, attribut_name, attribut_wert, schwierigkeit, beschreibung=""):
    """
    Klassische HtbaH-nahe Probe:
        W10 + Attribut >= Schwierigkeit  → Erfolg

    Gibt True/False zurück und erzählt das Ergebnis.
    """
    wurf = w10()
    summe = wurf + attribut_wert
    erfolg = summe >= schwierigkeit
    if beschreibung:
        print(f"Probe ({beschreibung}): {attribut_name} {attribut_wert} + W10 ({wurf}) = {summe}  "
              f"gegen {schwierigkeit}")
    else:
        print(f"Probe: {attribut_name} {attribut_wert} + W10 ({wurf}) = {summe}  "
              f"gegen {schwierigkeit}")
    print("→ Erfolg." if erfolg else "→ Misserfolg.")
    print()
    return erfolg


def schaden(held, punkte, grund=""):
    """LP abziehen. Setzt verwundet bei spürbarem Treffer. Prüft Tod."""
    held.lp -= punkte
    if held.lp < 0:
        held.lp = 0
    if punkte >= 3:
        held.verwundet = True
    if grund:
        print(f"Du verlierst {punkte} Lebenspunkte ({grund}). LP: {held.lp}/{MAX_LP}")
    else:
        print(f"Du verlierst {punkte} Lebenspunkte. LP: {held.lp}/{MAX_LP}")
    if held.lp <= 0:
        held.lebend = False
        print("Deine Kräfte verlassen dich.")
    print()


def heilen(held, punkte):
    alt = held.lp
    held.lp = min(MAX_LP, held.lp + punkte)
    gewonnen = held.lp - alt
    print(f"Du heilst {gewonnen} Lebenspunkte. LP: {held.lp}/{MAX_LP}")
    if held.lp >= 8:
        held.verwundet = False
    print()


def hat(held, item):
    return item in held.inventar


def nimm(held, item):
    if item not in held.inventar:
        held.inventar.append(item)
        print(f"→ {item} liegt jetzt in deinem Beutel.")
    else:
        print(f"→ Du hast {item} bereits.")
    print()


def gold_plus(held, menge, grund=""):
    held.gold += menge
    extra = f" ({grund})" if grund else ""
    print(f"→ {menge} Gold{extra}. Beutel: {held.gold} Gold.")
    print()


def vielleicht_heiltrank(held):
    """
    Bietet die Nutzung eines Heiltranks an, wenn sinnvoll.
    Eine zentrale Stelle — kein doppelter Trank-Code in den Szenen.
    """
    if held.tot() or not hat(held, HEILTRANK) or held.lp >= MAX_LP:
        return
    print(f"Du hast einen {HEILTRANK} und {held.lp}/{MAX_LP} LP.")
    if auswahl([f"{HEILTRANK} trinken", "Aufheben für später"]) == 0:
        held.inventar.remove(HEILTRANK)
        heilen(held, 6)
        print("Die bittere Flüssigkeit wärmt dich von innen.")
        print()


# ---------------------------------------------------------------------------
# Charaktererstellung
# ---------------------------------------------------------------------------

def held_erstellen():
    trenne("HELDENERSTELLUNG")
    absatz(
        "In Lindendorf braucht man keinen Auserwählten.",
        "Man braucht jemanden, der geht, wenn andere bleiben.",
        "",
        "Drei Attribute, jeweils 1 bis 10:",
        "  Stärke         — Kraft, Kampf, Hindernisse",
        "  Geschicklichkeit — Schleichen, Spuren, Fingerfertigkeit",
        "  Charisma       — Reden, Lügen, Vertrauen",
    )
    try:
        name = input("Wie heißt dein Held oder deine Heldin? ").strip()
    except EOFError:
        name = ""
    if not name:
        name = "Namenlos"
    print()
    print("Verteile deine Werte. Es gibt kein Punktelimit — aber 3 in allem")
    print("ist ein anderer Held als 9/2/2. Wähle bewusst.")
    print()
    staerke = frage_int("Stärke (1–10): ", 1, 10)
    geschick = frage_int("Geschicklichkeit (1–10): ", 1, 10)
    charisma = frage_int("Charisma (1–10): ", 1, 10)

    held = Held(name, staerke, geschick, charisma)
    trenne("AUFBRUCH")
    absatz(
        f"{held.name} — ST {staerke}, GE {geschick}, CH {charisma}, LP {held.lp}.",
        "Du trägst wenig bei dir. Ein Beutel. Staubige Stiefel.",
        "Lindendorf liegt im Tal, der Wald dahinter hält den Atem an.",
    )
    return held


# ---------------------------------------------------------------------------
# Szene: Dorf
# ---------------------------------------------------------------------------

def szene_dorf(held):
    """
    Auftrag + Informationen. Mehrfach betretbar, bis das Dorf verlassen wird.
    Entscheidungen setzen Zustände für Wald und Lager.
    """
    trenne("LINDENDORF")
    absatz(
        "Rauch steigt senkrecht. Die Felder sind abgeerntet, die Scheunen zu leer.",
        "Am Brunnen stehen Frauen mit verschränkten Armen.",
        "An der Taverne 'Zum letzten Fass' quietscht ein Schild in der Brise.",
        "Das Rathaus ist ein steinerner Klotz mit einer Tür, die zu oft geflickt wurde.",
    )

    tavernen_besucht = False
    rumoren_gehoert = False

    while not held.tot():
        status(held)
        absatz("Was tust du?")
        optionen = [
            "Mit dem Bürgermeister sprechen",
            "Die Taverne besuchen",
            "Am Brunnen lauschen",
            "Das Dorf Richtung Wald verlassen",
        ]
        wahl = auswahl(optionen)

        if wahl == 0:
            _dorf_buergermeister(held)
        elif wahl == 1:
            tavernen_besucht = True
            _dorf_taverne(held, rumoren_gehoert)
        elif wahl == 2:
            rumoren_gehoert = True
            _dorf_brunnen(held)
        else:
            if not held.auftrag_erhalten:
                absatz(
                    "Ohne Auftrag in den Wald zu gehen ist möglich.",
                    "Es ist nur dümmer. Die Banditen haben Gründe, und du kennst sie nicht.",
                )
                if auswahl(["Trotzdem gehen", "Noch im Dorf bleiben"]) == 1:
                    continue
            absatz(
                "Du lässt Lindendorf hinter dir.",
                "Der Weg wird zum Pfad, der Pfad zur Spur zwischen Farnen.",
            )
            warte()
            return

    # Tod im Dorf (unwahrscheinlich, aber sauber)
    return


def _dorf_buergermeister(held):
    absatz(
        "Bürgermeister Holm hat Augen wie nasse Kiesel.",
        "Auf dem Tisch: eine leere Kasse, ein Siegel, ein Brief mit gebrochenem Wachs.",
        '"Sie kommen nachts. Drei Mal schon. Getreide, zwei Ziegen, das Silbergerät der Kirche."',
        '"Ich brauche jemanden, der zum alten Steinbruch geht. Dort lagern sie."',
    )

    if held.auftrag_erhalten and held.buergermeister_vertraut:
        absatz(
            '"Du hast mein Wort und meinen Vorschuss. Geh, bevor sie merken,',
            'dass Lindendorf diesmal nicht nur jammert."',
        )
        return

    print("Du kannst den Auftrag einfach annehmen — oder ihn dir verdienen.")
    wahl = auswahl([
        "Auftrag nüchtern annehmen",
        "Vertrauen gewinnen (Charisma, mittel)",
        "Druck machen und Gold fordern (Charisma, schwer)",
        "Wieder gehen",
    ])

    if wahl == 0:
        held.auftrag_erhalten = True
        absatz(
            '"Gut. Bring zurück, was sie genommen haben. Oder sorge, dass sie nicht wiederkommen."',
            "Holm nickt knapp. Mehr Wärme hat dieses Amt nicht übrig.",
        )
    elif wahl == 1:
        if probe(held, "Charisma", held.charisma, MITTEL, "Vertrauen des Bürgermeisters"):
            held.auftrag_erhalten = True
            held.buergermeister_vertraut = True
            gold_plus(held, 5, "Vorschuss")
            nimm(held, HEILTRANK)
            absatz(
                '"Nimm das. Aus der Apotheke der Witwe Kern. Und fünf Taler, mehr ist nicht da."',
                "Holm sieht dich an, als hättest du etwas unterschrieben, das nicht auf Papier steht.",
            )
        else:
            held.auftrag_erhalten = True
            absatz(
                "Holm bleibt kühl.",
                '"Worte habe ich genug gehört. Tu die Arbeit. Belohnung nach Ergebnis."',
            )
    elif wahl == 2:
        if probe(held, "Charisma", held.charisma, SCHWER, "Gold erpressen"):
            held.auftrag_erhalten = True
            gold_plus(held, 8, "erpresster Vorschuss")
            absatz(
                "Holm zahlt, aber sein Blick sagt: Das vergisst ein Dorf nicht so schnell.",
                "Vertrauen ist das nicht. Nur Notwendigkeit.",
            )
        else:
            held.auftrag_erhalten = True
            absatz(
                '"Du kommst in mein Haus und zählst meine Münzen?"',
                "Holm steht auf. Der Auftrag steht. Freundschaft nicht.",
            )
    else:
        absatz("Du lässt Holm mit seiner leeren Kasse.")


def _dorf_taverne(held, rumoren_gehoert):
    absatz(
        "In der Taverne riecht es nach Gerste, nassem Tuch und Angst, die man wegzutrinken versucht.",
        "Wirtin Mara wischt dieselbe Stelle auf der Theke zum dritten Mal.",
    )
    optionen = [
        "Gerüchte hören",
        "Laut ankündigen, dass du die Banditen jagst",
        "Heiltrank kaufen (5 Gold)" if held.gold >= 5 else "Heiltrank kaufen — zu wenig Gold",
        "Wieder hinaus",
    ]
    wahl = auswahl(optionen)

    if wahl == 0:
        absatz(
            "Ein Holzfäller murmelt:",
            '"Die nehmen nicht den Hauptweg. Östlicher Wildpfad, wo die alte Eiche vom Blitz gespalten ist."',
            "Mara ergänzt leise: \"Einer von ihnen trinkt hier manchmal. Nennt sich Kess. Hört gerne zu.\"",
        )
        if rumoren_gehoert:
            absatz("Das passt zu dem, was am Brunnen schon die Runde machte.")
    elif wahl == 1:
        absatz(
            "Du stellst dich hin und sagst den Raum, was du vorhast.",
            "Zwei Gäste klatschen unsicher. Ein Dritter steht auf und geht, ohne zu zahlen.",
        )
        if probe(held, "Charisma", held.charisma, MITTEL, "den Raum für dich gewinnen"):
            absatz(
                "Mara stellt dir ein Bier hin, das niemand bestellt hat.",
                '"Pass auf Kess auf. Und auf den Graben vor dem Lager. Den haben sie neu gezogen."',
            )
            gold_plus(held, 1, "Biergeld eines Betrunkenen, der an dich glaubt")
        else:
            held.banditen_gewarnt = True
            absatz(
                "Zu viele Ohren. Zu viele offene Münder.",
                "Irgendwo zwischen Theke und Tür ist dein Plan schon weitergereist.",
                "Die Banditen werden wissen, dass jemand kommt.",
            )
    elif wahl == 2:
        if held.gold >= 5:
            if hat(held, HEILTRANK):
                absatz("Mara zuckt mit den Schultern. \"Einen zweiten habe ich nicht.\"")
            else:
                held.gold -= 5
                nimm(held, HEILTRANK)
                absatz("Mara schiebt dir ein kleines Fläschchen zu. \"Witwe Kerns Restbestand.\"")
        else:
            absatz("Fünf Gold. Du hast weniger. Mara hebt nicht einmal den Deckel.")
    else:
        absatz("Die Tür fällt ins Schloss. Draußen ist die Luft ehrlicher.")


def _dorf_brunnen(held):
    absatz(
        "Am Brunnen redet man, als wäre Flüstern eine Form von Gebet.",
        "Die Müllerin sagt, die Banditen hätten einen Schlüssel zum alten Steinbruchtor.",
        "Ein Junge schwört, nachts Trommeln gehört zu haben — oder nur den Wind.",
    )
    if probe(held, "Charisma", held.charisma, LEICHT, "die Leute zum Reden bringen"):
        absatz(
            "Die Müllerin zieht dich beiseite.",
            '"Wenn du gehst, geh nicht stolz. Die haben Posten auf dem Felsen."',
            "Sie drückt dir zwei abgewetzte Münzen in die Hand.",
        )
        gold_plus(held, 2, "Almosen der Müllerin")
    else:
        absatz(
            "Man sieht dich an und verstummt.",
            "Fremde mit Fragen sind in Lindendorf eine eigene Wetterlage.",
        )


# ---------------------------------------------------------------------------
# Szene: Wald
# ---------------------------------------------------------------------------

def szene_wald(held):
    trenne("WALD")
    absatz(
        "Der Wald von Lindendorf ist kein Märchenwald.",
        "Nasses Laub. Krähen. Ein Pfad, der sich entscheidet, kein Pfad mehr zu sein.",
        "Irgendwo voraus liegt der Steinbruch. Dazwischen: Spuren, ein Hindernis, vielleicht Beute.",
    )
    status(held)

    # --- Spuren ---
    absatz("Du findest Abdrücke im Matsch. Zu groß für Ziegen. Zu viele für Wanderer.")
    wahl = auswahl([
        "Die Spuren behutsam lesen (Geschick, leicht)",
        "Geradeaus durch das Unterholz (Stärke, mittel)",
        "In den Wald rufen, ob jemand hilft (Charisma, mittel)",
    ])

    spuren_gefunden = False
    if wahl == 0:
        if probe(held, "Geschicklichkeit", held.geschick, LEICHT, "Spuren lesen"):
            spuren_gefunden = True
            absatz(
                "Ostwärts. Gespaltene Eiche. Danach ein Wildpfad, den Wagen nicht nutzen.",
                "Zwischen den Wurzeln blinkt etwas.",
            )
            if auswahl(["Im Wurzelwerk stochern", "Weitergehen"]) == 0:
                _wald_beute(held)
        else:
            absatz(
                "Die Abdrücke verlieren sich. Du folgst einem Wildwechsel und gewinnst eine Stunde Nässe.",
            )
            if random.randint(1, 2) == 1:
                schaden(held, 1, "Dornen und Stolpern")
    elif wahl == 1:
        if probe(held, "Stärke", held.staerke, MITTEL, "Unterholz durchbrechen"):
            absatz(
                "Du machst dir einen Weg. Laut, aber schnell.",
                "Laut ist im Banditenwald eine Entscheidung.",
            )
            if random.randint(1, 3) == 1:
                held.banditen_gewarnt = True
                absatz("Irgendwo knackt Antwort. Nicht von dir.")
        else:
            schaden(held, 2, "Peitschenhiebe der Zweige, ein böser Sturz")
            absatz("Du kommst durch. Der Wald behält eine Gebühr.")
    else:
        if probe(held, "Charisma", held.charisma, MITTEL, "Hilfe im Wald"):
            absatz(
                "Ein Köhler tritt zwischen die Stämme, als hätte der Rauch ihn ausgespuckt.",
                '"Steinbruch. Östlicher Pfad. Und nimm das, bevor du stirbst und hier liegend stinkst."',
            )
            nimm(held, HEILTRANK)
            spuren_gefunden = True
        else:
            absatz(
                "Dein Ruf hängt im Geäst und kommt nicht zurück.",
                "Dafür antwortet etwas anderes: ein Pfiff, kurz, von weit vorn.",
            )
            held.banditen_gewarnt = True

    if held.tot():
        return
    vielleicht_heiltrank(held)
    if held.tot():
        return

    # --- Hindernis: Graben / gestürzter Baum ---
    absatz(
        "Der Pfad endet an einem Graben. Frisch ausgehoben, mit Pfählen gespickt.",
        "Dahinter ein gestürzter Stamm, nass und glatt. Das ist Absicht, kein Sturm.",
    )
    wahl = auswahl([
        "Hinüberspringen (Geschick, mittel)",
        "Den Stamm zur Seite wuchten (Stärke, mittel)",
        "Entlang des Grabens einen Übergang suchen (Zeit, aber sicherer)",
    ])

    if wahl == 0:
        schwierigkeit = SCHWER if held.verwundet else MITTEL
        if probe(held, "Geschicklichkeit", held.geschick, schwierigkeit, "Sprung über den Graben"):
            absatz("Du landest hart, aber auf der richtigen Seite.")
        else:
            schaden(held, 3, "Pfahl und Fall")
            absatz("Schlamm im Mund. Ein Riss im Ärmel. Der Graben hat sich genommen, was er wollte.")
    elif wahl == 1:
        if probe(held, "Stärke", held.staerke, MITTEL, "Stamm bewegen"):
            absatz("Der Stamm gibt nach. Der Graben bleibt, aber du hast eine Brücke aus Totholz.")
        else:
            schaden(held, 2, "der Stamm rollt zurück")
            absatz("Du kommst trotzdem rüber — auf allen vieren, fluchend.")
    else:
        absatz(
            "Du verlierst Zeit. Der Wald wird dunkler.",
            "Dafür findest du eine Stelle, an der der Graben seicht ist.",
        )
        if not spuren_gefunden and random.randint(1, 2) == 1:
            absatz("Im seichten Wasser liegt ein verlorener Ringbund — und daran ein eiserner Schlüssel.")
            nimm(held, SCHLUESSEL)

    if held.tot():
        return
    vielleicht_heiltrank(held)

    # Kleiner Hinweis vor dem Lager
    if held.banditen_gewarnt:
        absatz(
            "Vor dir wird der Wald dünner. Stimmen. Metall auf Metall.",
            "Sie klingen nicht überrascht. Jemand hat ihnen gesagt, dass ein Gast kommt.",
        )
    else:
        absatz(
            "Vor dir wird der Wald dünner. Rauch. Leise Stimmen.",
            "Das Lager weiß noch nicht, dass der Wald heute Besuch hat.",
        )
    warte()


def _wald_beute(held):
    """Optionale Beute — eine zentrale Stelle."""
    fund = random.choice([GOLD, HEILTRANK, SCHLUESSEL])
    if fund == GOLD:
        gold_plus(held, 4, "vergrabene Münzen unter der Wurzel")
    elif fund == HEILTRANK:
        if hat(held, HEILTRANK):
            gold_plus(held, 3, "statt eines zweiten Tranks: Münzen im Moos")
        else:
            absatz("Ein Fläschchen, in Leder gewickelt. Jemand hat es nicht mehr gebraucht.")
            nimm(held, HEILTRANK)
    else:
        absatz("Ein eiserner Schlüssel, grün vor Feuchtigkeit. Passt zu keinem Dorfschloss.")
        nimm(held, SCHLUESSEL)


# ---------------------------------------------------------------------------
# Szene: Banditenlager
# ---------------------------------------------------------------------------

def szene_lager(held):
    trenne("BANDITENLAGER")
    absatz(
        "Der Steinbruch ist eine Wunde im Hügel.",
        "Drei Zelte. Ein Feuer. Eine Kiste mit dem Siegel der Kirche von Lindendorf.",
        "Ein Mann mit einer Narbe über der Lippe — das wird Kess sein — würfelt mit zwei anderen.",
        "Ein vierter steht oben auf dem Felsen und schaut den Weg entlang, den du gekommen bist.",
    )
    if hat(held, SCHLUESSEL):
        absatz("An der Felsschräge sitzt ein altes Gittertor. Dein Schlüssel juckt im Beutel.")
    status(held)

    if held.banditen_gewarnt:
        absatz("Die Würfelpause ist zu kurz. Kess hebt den Kopf. \"Na. Der Gast aus der Taverne.\"")
    else:
        absatz("Noch sitzen sie. Noch ist der Posten oben gelangweilt.")

    optionen = [
        "Anschleichen (Geschick)",
        "Heraustreten und reden (Charisma)",
        "Angreifen (Stärke)",
    ]
    if hat(held, SCHLUESSEL):
        optionen.append("Mit dem Schlüssel das Seitentor nutzen")

    wahl = auswahl(optionen)

    if wahl == 0:
        _lager_schleichen(held)
    elif wahl == 1:
        _lager_reden(held)
    elif wahl == 2:
        _lager_kampf(held)
    else:
        _lager_seitetor(held)

    if not held.tot() and held.lager_geloest:
        absatz("Das Feuer brennt noch. Die Kiste der Kirche ist leichter, als sie aussieht.")


def _lager_schleichen(held):
    schwierigkeit = SCHWER if held.banditen_gewarnt else MITTEL
    if held.verwundet:
        schwierigkeit = min(18, schwierigkeit + 2)
        absatz("Die Wunde zerrt. Schleichen mit einem Hinken ist ein Widerspruch.")

    if probe(held, "Geschicklichkeit", held.geschick, schwierigkeit, "Anschleichen"):
        held.loesungsweg = "schleich"
        held.lager_geloest = True
        held.beute_gerettet = True
        gold_plus(held, 6, "aus der unbewachten Kiste")
        absatz(
            "Du nimmst das Kirchensilber, zwei Säcke Getreide markierst du dir nur im Kopf.",
            "Kess würfelt eine Acht und flucht über das Glück, das nicht seines ist.",
            "Du bist schon im Gestrüpp, als der Posten endlich blinzelt.",
        )
        if random.randint(1, 2) == 1 and not hat(held, HEILTRANK):
            nimm(held, HEILTRANK)
    else:
        absatz("Ein Stein. Ein Fluch. Drei Köpfe drehen sich.")
        schaden(held, 2, "ein geworfener Becher, dann eine Klinge, die nur streift")
        if held.tot():
            return
        absatz("Jetzt bleibt Reden oder Schlagen.")
        if auswahl(["Jetzt reden", "Jetzt kämpfen"]) == 0:
            _lager_reden(held, erwischt=True)
        else:
            _lager_kampf(held, ueberrascht=False)


def _lager_reden(held, erwischt=False):
    absatz(
        "Kess hat eine Stimme wie ein stumpfer Säbel.",
        '"Lindendorf schickt keine Wache. Lindendorf schickt... dich."',
    )
    schwierigkeit = SCHWER if (held.banditen_gewarnt or erwischt) else MITTEL

    wahl = auswahl([
        "Drohen: Das Dorf hat genug (Charisma)",
        "Handel: Abzug gegen Gold und eine Nacht Vorsprung",
        "Lügen: Hinter dir kommt die Stadtwache",
    ])

    if wahl == 0:
        ok = probe(held, "Charisma", held.charisma, schwierigkeit, "Drohung")
        if ok:
            held.loesungsweg = "ueberreden"
            held.lager_geloest = True
            held.beute_gerettet = True
            absatz(
                "Kess sieht deine Augen länger an als dein Schwert.",
                '"Packen. Bevor ich es mir anders überlege."',
                "Sie lassen die Kirchenkiste. Mehr Großmut steckt nicht in diesem Steinbruch.",
            )
        else:
            absatz("Lachen. Kurzes Lachen. Dann Stahl.")
            _lager_kampf(held, ueberrascht=False)
    elif wahl == 1:
        preis = 5 if held.buergermeister_vertraut else 8
        print(f"Kess will {preis} Gold, sofort, und dass du den Mund hältst.")
        print()
        if held.gold >= preis and auswahl([f"{preis} Gold zahlen", "Nicht zahlen"]) == 0:
            held.gold -= preis
            held.loesungsweg = "ueberreden"
            held.lager_geloest = True
            held.beute_gerettet = False
            absatz(
                f"Du zahlst {preis} Gold. Die Kiste bleibt — leer genug, voll genug.",
                "Kess nickt. Das ist kein Frieden. Das ist eine Pause mit Preis.",
            )
        else:
            absatz("Ohne Münzen ist Handel nur Theater. Theater endet hier mit Messern.")
            _lager_kampf(held, ueberrascht=False)
    else:
        luege_schwer = SCHWER if held.banditen_gewarnt else MITTEL
        if probe(held, "Charisma", held.charisma, luege_schwer, "Lüge von der Wache"):
            held.loesungsweg = "ueberreden"
            held.lager_geloest = True
            held.beute_gerettet = True
            absatz(
                "Kess glaubt nicht an Helden. Er glaubt an Galgen.",
                "In zehn Atemzügen ist das Lager halb leer. Die Kiste bleibt, weil sie schwer ist.",
            )
        else:
            held.banditen_gewarnt = True
            absatz('"Die Wache. Natürlich. Und ich bin der Bischof."')
            _lager_kampf(held, ueberrascht=False)


def _lager_kampf(held, ueberrascht=True):
    absatz(
        "Kein Duell. Ein Gedränge aus Stahl, Feuerlicht und schlechtem Boden.",
    )
    # Erster Schlag
    s1 = MITTEL if ueberrascht and not held.banditen_gewarnt else SCHWER
    if held.verwundet:
        s1 = min(18, s1 + 1)

    if probe(held, "Stärke", held.staerke, s1, "erster Schlag"):
        absatz("Der erste geht zu Boden. Die anderen zögern — das ist mehr wert als Blut.")
        s2 = MITTEL
    else:
        schaden(held, 4, "Kess' Messer findet Stoff und Haut")
        if held.tot():
            return
        s2 = SCHWER
        absatz("Du bleibst stehen, weil Hinfallen hier das Ende wäre.")

    vielleicht_heiltrank(held)
    if held.tot():
        return

    if probe(held, "Stärke", held.staerke, s2, "den Steinbruch halten"):
        held.loesungsweg = "kampf"
        held.lager_geloest = True
        held.beute_gerettet = True
        gold_plus(held, 5, "von den Gürteln der Fliehenden")
        absatz(
            "Kess flieht nicht wie ein Anführer, sondern wie ein Mann, der zählen kann.",
            "Zwei bleiben liegen. Einer stöhnt. Das Lager gehört dem Rauch und dir.",
        )
    else:
        schaden(held, 5, "zu viele Klingen, zu wenig Platz")
        if held.tot():
            return
        # knapper Rückzug möglich
        absatz("Du reißt dir die Kirchenkiste unter den Arm und taumelst in den Wald.")
        if probe(held, "Geschicklichkeit", held.geschick, MITTEL, "mit der Beute entkommen"):
            held.loesungsweg = "kampf"
            held.lager_geloest = True
            held.beute_gerettet = True
            absatz("Sie folgen nicht weit. Verwundete Jäger sind schlechte Jäger.")
        else:
            held.loesungsweg = "kampf"
            held.lager_geloest = True
            held.beute_gerettet = False
            absatz(
                "Die Kiste bleibt im Farn. Du behältst dein Leben, nicht den Auftrag.",
                "Hinter dir lacht jemand, dem das reicht.",
            )


def _lager_seitetor(held):
    absatz(
        "Der Schlüssel dreht sich schwer. Rost redet mit, gibt aber nach.",
        "Du kommst hinter dem Holzstapel raus — näher an der Kiste als am Feuer.",
    )
    wahl = auswahl([
        "Nur die Beute nehmen und verschwinden (Geschick, leicht)",
        "Die Seile der Zelte kappen und Chaos nutzen (Geschick, mittel)",
        "Kess von hinten stellen (Stärke, mittel)",
    ])
    if wahl == 0:
        if probe(held, "Geschicklichkeit", held.geschick, LEICHT, "Beute am Seitentor"):
            held.loesungsweg = "schleich"
            held.lager_geloest = True
            held.beute_gerettet = True
            gold_plus(held, 6, "Kirchensilber")
            absatz("Kein Heldenepos. Eine offene Tür und ein geschlossener Mund.")
        else:
            absatz("Die Kiste schabt über Stein. Kess hört das.")
            _lager_kampf(held, ueberrascht=False)
    elif wahl == 1:
        if probe(held, "Geschicklichkeit", held.geschick, MITTEL, "Zelte sabotieren"):
            held.loesungsweg = "schleich"
            held.lager_geloest = True
            held.beute_gerettet = True
            gold_plus(held, 4, "in der Verwirrung")
            absatz("Stoff stürzt, Glut springt, Männer fluchen auf das Wetter und auf dich.")
        else:
            schaden(held, 2, "ein Wachposten sieht dich am Tau")
            if not held.tot():
                _lager_kampf(held, ueberrascht=False)
    else:
        if probe(held, "Stärke", held.staerke, MITTEL, "Kess stellen"):
            held.loesungsweg = "kampf"
            held.lager_geloest = True
            held.beute_gerettet = True
            gold_plus(held, 5, "Kess' Beutel")
            absatz(
                "Kess ist ein Schwätzer. Schwätzer drehen sich zu langsam um.",
                "Die anderen rennen, als ihr Anführer kniet.",
            )
        else:
            schaden(held, 3, "Kess ist schneller als sein Mund")
            if not held.tot():
                _lager_kampf(held, ueberrascht=False)


# ---------------------------------------------------------------------------
# Ende
# ---------------------------------------------------------------------------

def szene_ende(held):
    trenne("ENDE")

    if held.tot() or held.lp <= 0:
        absatz(
            f"{held.name} bleibt zwischen Lindendorf und dem Steinbruch.",
            "Der Wald nimmt das Geräusch, das Dorf behält die Angst.",
            "Man erzählt später von jemandem, der gegangen ist. Nicht von jemandem, der zurückkam.",
        )
        print("Ende: Der Wald behält dich.")
        return

    status(held)

    # Rückkehr ins Dorf — Belohnung hängt an Zuständen
    absatz("Lindendorf sieht dich früher als Holm. Dann sieht dich Holm.")

    if not held.lager_geloest:
        absatz(
            "Du bringst keine Lösung mit. Nur Dreck und eine Geschichte ohne Schluss.",
            "Holm nickt, als hätte er das erwartet. Die nächste Nacht kommt trotzdem.",
        )
        print("Ende: Unerledigt.")
        return

    # Mehrere Enden
    if held.loesungsweg == "ueberreden" and held.beute_gerettet and held.buergermeister_vertraut:
        absatz(
            "Du hast gesprochen, wo andere schlagen wollten.",
            "Das Silber der Kirche liegt wieder auf Holms Tisch. Holm atmet zum ersten Mal heute.",
            '"Bleib, wenn du willst. Lindendorf zahlt schlecht. Aber es vergisst nicht."',
        )
        gold_plus(held, 6, "Belohnung des Bürgermeisters")
        print("Ende: Das Wort war die Waffe.")

    elif held.loesungsweg == "ueberreden" and not held.beute_gerettet:
        absatz(
            "Die Banditen sind weg. Die Kiste auch nicht voller.",
            "Holm hört zu, ohne Dank. Ein Dorf, das zahlt, damit man es in Ruhe lässt,",
            "hat das schon einmal getan.",
        )
        if held.buergermeister_vertraut:
            absatz("Trotzdem sieht er dich nicht als Feind. Nur als teure Lektion.")
        print("Ende: Gekaufter Frieden.")

    elif held.loesungsweg == "schleich" and held.beute_gerettet:
        absatz(
            "Kein Blut auf dem Marktplatz. Nur eine Kiste, die wieder da ist.",
            "Manche nennen das Feigheit. Holm nennt es Ergebnis.",
        )
        if held.buergermeister_vertraut:
            gold_plus(held, 5, "stille Belohnung")
            absatz('"Die besten Boten sind die, von denen niemand ein Lied singt."')
        else:
            gold_plus(held, 2, "knappe Anerkennung")
        print("Ende: Schattenarbeit.")

    elif held.loesungsweg == "kampf" and held.beute_gerettet and not held.verwundet:
        absatz(
            "Du kommst aufrecht zurück. Das Dorf versteht Stahl besser als Feinheiten.",
            "Ein Junge am Brunnen ahmt deinen Gang nach, bis seine Mutter ihn zieht.",
        )
        gold_plus(held, 8 if held.buergermeister_vertraut else 4, "Siegeslohn")
        print("Ende: Der kurze Ruhm.")

    elif held.loesungsweg == "kampf" and held.verwundet:
        absatz(
            "Du kommst zurück. Das reicht dem Dorf. Es reicht dir fast.",
            "Witwe Kern verbindet, ohne zu fragen, wer angefangen hat.",
        )
        if held.beute_gerettet:
            gold_plus(held, 4 if held.buergermeister_vertraut else 2, "Lohn trotz Wunde")
            print("Ende: Teurer Sieg.")
        else:
            absatz("Die Beute fehlt. Holm zahlt in Blicken, nicht in Münzen.")
            print("Ende: Überlebt, nicht erledigt.")

    else:
        absatz(
            "Das Lager ist kein Lager mehr. Was genau passiert ist, erzählst du unvollständig.",
            "Lindendorf nimmt, was es bekommen kann: eine ruhigere Woche.",
        )
        print("Ende: Genug für ein Tal.")

    print()
    _epilog(held)


def _epilog(held):
    bits = []
    if held.banditen_gewarnt:
        bits.append("Die Banditen wussten von dir, bevor du sie sahst.")
    if held.buergermeister_vertraut:
        bits.append("Holm schuldet dir etwas, das nicht in der Kasse steht.")
    if held.verwundet:
        bits.append("Die Wunde bleibt eine Weile. Narben sind in Lindendorf eine Art Ausweis.")
    if hat(held, SCHLUESSEL):
        bits.append("Der Schlüssel zum Seitentor ist noch da. Türen bleiben eine Versuchung.")
    if not bits:
        bits.append("Du gehst leichter, als du gekommen bist. Das ist selten.")
    for b in bits:
        print("— " + b)
    print()


# ---------------------------------------------------------------------------
# Spielablauf
# ---------------------------------------------------------------------------

def anleitung():
    trenne("SO SPIELT MAN")
    absatz(
        "Du liest eine Szene und wählst eine Zahl + Enter.",
        "",
        "Proben:  W10 + Attribut  >=  Schwierigkeit",
        "  leicht 8   mittel 12   schwer 15",
        "Erfolg und Misserfolg ändern Text, Items, LP und Flags.",
        "",
        "Attribute (1–10): Stärke, Geschicklichkeit, Charisma",
        "Lebenspunkte: 10. Bei 0 ist das Abenteuer vorbei.",
        "Inventar: Heiltrank, Schlüssel, Gold — keine Ausrüstungsslots.",
        "",
        "Orte: Dorf → Wald → Banditenlager → Ende",
        "Im Lager gehen Schleichen, Reden und Kampf alle durch.",
        "",
        "Abbruch jederzeit: Strg+C",
    )
    warte()


def spielen():
    random.seed()
    held = held_erstellen()
    szene_dorf(held)
    if not held.tot():
        szene_wald(held)
    if not held.tot():
        szene_lager(held)
    szene_ende(held)
    trenne()
    print("Version 0.1 — Vertical Slice. Danke fürs Spielen.")
    print()


def hauptmenue():
    while True:
        trenne("HOW TO BE A HERO  —  Lindendorf 0.1")
        absatz(
            "Ein kurzes Textabenteuer im Terminal.",
            "Eine Datei. Keine Installation außer Python 3.",
        )
        wahl = auswahl([
            "Abenteuer starten",
            "Kurzregeln lesen",
            "Beenden",
        ])
        if wahl == 0:
            spielen()
            nochmal = auswahl(["Noch einmal spielen", "Zurück ins Menü", "Beenden"])
            if nochmal == 0:
                spielen()
            elif nochmal == 2:
                print("Der Wald wartet.")
                return
        elif wahl == 1:
            anleitung()
        else:
            print("Der Wald wartet.")
            return


def main():
    try:
        hauptmenue()
    except KeyboardInterrupt:
        print("\n\nAbbruch. Der Wald wartet.")
        sys.exit(0)


if __name__ == "__main__":
    main()
