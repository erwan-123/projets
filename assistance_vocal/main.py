import pyttsx3
import time
from datetime import datetime

assistant = pyttsx3.init()

# ==============================
# CONFIGURATION DE LA VOIX
# ==============================

assistant.setProperty("rate", 160)
assistant.setProperty("volume", 1.0)


# ==============================
# FONCTION POUR PARLER
# ==============================

def parler(message):
    print("\nAssistant :", message)
    assistant.say(message)
    assistant.runAndWait()


# ==============================
# DATE ET HEURE
# ==============================

maintenant = datetime.now()

heure = maintenant.hour
minutes = maintenant.minute
jour_numero = maintenant.day
mois_numero = maintenant.month
annee = maintenant.year

jours = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche"
]

mois = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
]

jour = jours[maintenant.weekday()]
nom_mois = mois[mois_numero - 1]


# ==============================
# SIGNE ASTROLOGIQUE
# ==============================

def signe_astrologique(jour, mois):

    if (mois == 3 and jour >= 21) or (mois == 4 and jour <= 19):
        return "Bélier"

    elif (mois == 4 and jour >= 20) or (mois == 5 and jour <= 20):
        return "Taureau"

    elif (mois == 5 and jour >= 21) or (mois == 6 and jour <= 20):
        return "Gémeaux"

    elif (mois == 6 and jour >= 21) or (mois == 7 and jour <= 22):
        return "Cancer"

    elif (mois == 7 and jour >= 23) or (mois == 8 and jour <= 22):
        return "Lion"

    elif (mois == 8 and jour >= 23) or (mois == 9 and jour <= 22):
        return "Vierge"

    elif (mois == 9 and jour >= 23) or (mois == 10 and jour <= 22):
        return "Balance"

    elif (mois == 10 and jour >= 23) or (mois == 11 and jour <= 21):
        return "Scorpion"

    elif (mois == 11 and jour >= 22) or (mois == 12 and jour <= 21):
        return "Sagittaire"

    elif (mois == 12 and jour >= 22) or (mois == 1 and jour <= 19):
        return "Capricorne"

    elif (mois == 1 and jour >= 20) or (mois == 2 and jour <= 18):
        return "Verseau"

    else:
        return "Poissons"


signe = signe_astrologique(jour_numero, mois_numero)


# ==============================
# PROVERBES AFRICAINS
# ==============================

proverbes = {

    "lundi":
        "La patience est un arbre dont la racine est amère, mais dont les fruits sont doux.",

    "mardi":
        "Seul, on va plus vite ; ensemble, on va plus loin.",

    "mercredi":
        "Celui qui veut du miel doit avoir le courage d'affronter les abeilles.",

    "jeudi":
        "Un seul doigt ne peut pas ramasser un caillou.",

    "vendredi":
        "Le chemin le plus long commence toujours par un premier pas.",

    "samedi":
        "Quand les racines sont profondes, il n'y a aucune raison de craindre le vent.",

    "dimanche":
        "Celui qui demande son chemin ne se perd jamais."
}

proverbe_du_jour = proverbes[jour]


# ==============================
# MESSAGE D'ACCUEIL
# ==============================

message_accueil = (
    f"Bonjour Steve. "
    f"Votre système est maintenant opérationnel. "
    f"Nous sommes {jour} {jour_numero} {nom_mois} {annee}, "
    f"et il est actuellement {heure} heures {minutes} minutes. "
    f"Votre signe astrologique est {signe}. "
    f"Voici votre pensée du jour : {proverbe_du_jour} "
    f"Je vous souhaite une excellente journée, "
    f"pleine de réussite et de belles opportunités."
)

parler(message_accueil)


# ==============================
# ANNONCE DE L'HEURE
# ==============================

while True:

    time.sleep(30 * 60)

    maintenant = datetime.now()

    heure = maintenant.hour
    minutes = maintenant.minute

    message_heure = (
        f"Il est actuellement {heure} heures {minutes} minutes."
    )

    parler(message_heure)