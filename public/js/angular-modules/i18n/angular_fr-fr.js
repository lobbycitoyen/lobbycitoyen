'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
"CUSTOM" : {
	
	"ACTIONS" : {
		"save" : "sauvegarder",
		"edit" :"editer",
		"delete" :"supprimer",
		"select" : "sélectionner",
		"select_edit" : "sélectionner / éditer",
		"back_to_document" :"Retour au mode de lecture",
		"more_options" : "Plus d'options",
		"add" : "Ajouter",
		"add_one" : "Ajouter un "




	},
	"HELP" : {
		"fresh_document" : "Votre document est pret ! Un guide est disponible dans le menu d'aide <i class='fa fa-question'></i>",
	},
	"VOTE" : {
		"by_author" : "par",
		"my_documents" : "Mes votes",
		"default_title" :"Votre titre",
		"default_content" :"Votre contenu texte",
	 	"document_options":"Options du vote",
		"instructions" :"IIII",
		"default_published." :"Choisissez un status",
		"create_new" :"Créer nouveau vote"
	},

	"DOCUMENT_FIELDS" : {
		"title" : "titre",
		"published" : "publié",
		"room" : "room",
		"updated" : "Mise à jour"

	},

	
	"USER": {
		"login" : "S\'identifier",
		"loginOrSignup" : "S\'identifier / Créer un compte",
		"login_condition" : "Si vous avez un compte",
		"register": "Créer un compte",
		"no_account_yet" : "Pas encore de compte ?",
		"pick_password" : "Mot de passe",
		"pick_username" : "Votre nom d'utilisateur (public)",
		"pick_email" : "Votre email",
		"logout" : "Se deconnecter",
		"myprofile": "Mon profil",
		"hidden_from_public": "(non partagée)",
		"logged_in_as" : "Vous êtes connecté en tant que",
		"subscribe_title" :"S\'abonner à la newsletter",
		"subscribe_action" :"s\'abonner",
		"subscribe_fields" :"indiquer simplement votre adresse mail",
		"subscribe_option" :"S\'abonner à la newsletter",
		"subscribe_success" :"Vous allez recevoir un mail contenant un lien de confirmation"

	},

} ,
"DATETIME_FORMATS": {
"AMPMS": [
"AM",
"PM"
],
"DAY": [
"dimanche",
"lundi",
"mardi",
"mercredi",
"jeudi",
"vendredi",
"samedi"
],
"MONTH": [
"janvier",
"f\u00e9vrier",
"mars",
"avril",
"mai",
"juin",
"juillet",
"ao\u00fbt",
"septembre",
"octobre",
"novembre",
"d\u00e9cembre"
],
"SHORTDAY": [
"dim.",
"lun.",
"mar.",
"mer.",
"jeu.",
"ven.",
"sam."
],
"SHORTMONTH": [
"janv.",
"f\u00e9vr.",
"mars",
"avr.",
"mai",
"juin",
"juil.",
"ao\u00fbt",
"sept.",
"oct.",
"nov.",
"d\u00e9c."
],
"fullDate": "EEEE d MMMM y",
"longDate": "d MMMM y",
"medium": "d MMM y HH:mm:ss",
"mediumDate": "d MMM y",
"mediumTime": "HH:mm:ss",
"short": "dd/MM/y HH:mm",
"shortDate": "dd/MM/y",
"shortTime": "HH:mm"
},
"NUMBER_FORMATS": {
"CURRENCY_SYM": "\u20ac",
"DECIMAL_SEP": ",",
"GROUP_SEP": "\u00a0",
"PATTERNS": [
{
"gSize": 3,
"lgSize": 3,
"maxFrac": 3,
"minFrac": 0,
"minInt": 1,
"negPre": "-",
"negSuf": "",
"posPre": "",
"posSuf": ""
},
{
"gSize": 3,
"lgSize": 3,
"maxFrac": 2,
"minFrac": 2,
"minInt": 1,
"negPre": "-",
"negSuf": "\u00a0\u00a4",
"posPre": "",
"posSuf": "\u00a0\u00a4"
}
]
},
"id": "fr-fr",
"pluralCat": function (n, opt_precision) { var i = n | 0; if (i == 0 || i == 1) { return PLURAL_CATEGORY.ONE; } return PLURAL_CATEGORY.OTHER;}
});
}]);