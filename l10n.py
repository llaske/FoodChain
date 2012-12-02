#!/usr/bin/env python
# -*- coding: utf-8 -*-



from gettext import gettext as igettext
import gettext
import os



class FoodChainLocalization:
    "Class for localization, need to allow forcing localization dynamically"

    def __init__(self):
        "Init strings with default localization"
        self._ = self.gettext_default
        self.set_strings()
        self.lang = None


    def set_locale(self, lang):
        "Force localization"
        if lang == 'en':
            self._ = self.gettext_identity
            self.set_strings()
            return
        if lang != 'fr':
            self._ = self.gettext_default
            self.set_strings()
            return
        self.lang = gettext.translation("org.olpcfrance.FoodChain", localedir=os.path.join(os.getcwd(), 'locale'), languages=[lang])
        self.lang.install()
        self._ = self.gettext_lang
        self.set_strings()


    # Gettext function depending of context
    def gettext_identity(self, s):
        return s

    def gettext_default(self, s):
        return igettext(s)

    def gettext_lang(self, s):
        return self.lang.gettext(s)


    def set_strings(self):
        "Init all strings with the current localization (default or specific)"
        self.strings = {
            "sounddir": self._("en"),
            "learn": self._("Learn"),
            "build": self._("Build"),
            "play": self._("Play"),
            "learndesc": self._("Set cards in the right box to learn what sort of food each animal eat."),
            "builddesc": self._("Set cards in the right order to build the right food chain."),
            "playdesc": self._("Play the food chain: eat and avoid being eaten."),
            "level": self._("Level"),
            "score": self._("Score:"),
            "concept": self._("concept & code:"),
            "arts": self._("arts:"),
            "music": self._("music:"),
            "sound": self._("sound effects:"),	 
            "alligator": self._("Alligator"),
            "animal": self._("Animal"),
            "bat": self._("Bat"),
            "bee": self._("Bee"),
            "bird": self._("Bird"),
            "camel": self._("Camel"),
            "cat": self._("Cat"),
            "chicken": self._("Chicken"),
            "chimp": self._("Chimp"),
            "clam": self._("Clam"),
            "corn": self._("Corn"),
            "cow": self._("Cow"),
            "crab": self._("Crab"),
            "crocodile": self._("Crocodile"),
            "crow": self._("Crow"),
            "dog": self._("Dog"),
            "duck": self._("Duck"),
            "fish": self._("Fish"),
            "flies": self._("Flies"),
            "fox": self._("Fox"),
            "frog": self._("Frog"),
            "giraffe": self._("Giraffe"),
            "goat": self._("Goat"),
            "grass": self._("Grass"),
            "hay": self._("Hay"),
            "hen": self._("Hen"),
            "lamb": self._("Lamb"),
            "mice": self._("Mice"),
            "mole": self._("Mole"),
            "mosquito": self._("Mosquito"),
            "mule": self._("Mule"),
            "owl": self._("Owl"),
            "ox": self._("Ox"),
            "pig": self._("Pig"),
            "rat": self._("Rat"),
            "shark": self._("Shark"),
            "shrimp": self._("Shrimp"),
            "skunk": self._("Skunk"),
            "snail": self._("Snail"),
            "snake": self._("Snake"),
            "spider": self._("Spider"),
            "spike": self._("Spike"),
            "squid": self._("Squid"),
            "squirrel": self._("Squirrel"),
            "starfish": self._("Starfish"),
            "swan": self._("Swan"),
            "tick": self._("Tick"),
            "wheat": self._("Wheat"),
            "herbivore": self._("Herbivore"),
            "carnivore": self._("Carnivore"),
            "omnivore": self._("Omnivore")
        }
