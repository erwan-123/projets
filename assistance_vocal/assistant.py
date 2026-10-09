import pyttsx3
from datetime import datetime

assistant = pyttsx3.init()

maintenant = datetime.now()

heure = maintenant.hour
minutes = maintenant.minute

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
nom_mois = mois[maintenant.month - 1]

message = (
    f"Bonjour Steve ! "
    f"Il est actuellement {heure} heures {minutes} minutes. "
    f"Nous sommes {jour} {maintenant.day} {nom_mois} {maintenant.year}."
)

print(message)

assistant.say(message)
assistant.runAndWait()