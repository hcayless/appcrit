var swapLem = function(oldrdg) {
	if (oldrdg[0].localName == "tei-rdg") { // swapLem is a no-op if we clicked a lem
		var app = oldrdg.parents("tei-app").first();
		var oldlem;
		if ((oldlem = app.find(">tei-lem")).length == 0) {
			if ((oldlem = app.find("tei-rdgGrp>tei-lem")).length == 0) {
				if (app.attr("exclude")) {
					app.attr("exclude").split(/ /).forEach (function(val) {
						if ($(val).find(">tei-lem").length > 0) {
							oldlem = $(val).find(">tei-lem");
						}
					});
				}
			}
		}
		if (oldlem.length > 0) {
			var oldapp = oldlem.parent("tei-app");
			var newlem = $("<tei-lem/>");
			for (var i = 0; i < oldrdg[0].attributes.length; i++) {
				newlem.attr(oldrdg[0].attributes[i].name, oldrdg[0].attributes[i].value);
			}
			newlem.append(oldrdg.html());
			oldrdg.replaceWith(newlem[0].outerHTML);
			var newrdg = $("<tei-rdg/>");
			for (var i = 0; i < oldlem[0].attributes.length; i++) {
				newrdg.attr(oldlem[0].attributes[i].name, oldlem[0].attributes[i].value);
			}
			newrdg.append(oldlem.html());
			oldlem.replaceWith(newrdg[0].outerHTML);
			//reacquire handles to newlem and newrdg in the altered DOM
			newlem = $("#" + newlem.attr("id"));
			newrdg = $("#" + newrdg.attr("id"));
			//TODO: button relocation isn't working...
			var l, btn;
			if (app.find("tei-l").length > 0 && app.find("#button-" + app.attr("id").length == 0)) {
				// the app doesn't contain the button clicked, i.e. not a line-containing app or one containing only a rdg
				l = newlem.find("tei-l").first();
				if (l.length == 0) {
					l = newlem.parents("tei-l");
					if (l.length == 0) {
						l = app.prev("tei-l,tei-app");
						if (l.length > 0 && l[0].localName == "tei-app") {
							l = l.find("tei-lem tei-l").last();
						}
						if (l.length == 0) {
							l = app.next("tei-l,tei-app");
							if (l.length > 0 && l[0].localName == "tei-app") {
								l = l.find("tei-lem tei-l").first();
							}
						}
					}
				}
				btn = $("#button-" + app.attr("id"));
				if (l.find("span.apps").length > 0) {
					l.find("span.apps").first().append(btn.detach());
				} else {
					l.append($("<span class=\"apps\"></span>").append(btn.detach()));
				}
				btn.click(function (){
					$("#dialog-" + $(this).attr("data-app")).dialog("open");
				});
			}
			var oldapp = newrdg.parent("tei-app");
			if (oldapp.attr("id") != app.attr("id")) {
				if (oldlem.find("#button-" + oldapp.attr("id")).length > 0) {
					l = newrdg.parent("tei-app").find(">tei-lem tei-l");
					if (l.length == 0) {
						l = newrdg.parents("tei-l");
						if (l.length == 0) {
							l = oldapp.prev("tei-l,tei-app");
							if (l.length > 0 && l[0].localName == "tei-app") {
								l = l.find("tei-lem tei-l").last();
							}
							if (l.length == 0) {
								l = oldapp.next("tei-l,tei-app");
								if (l[0].localName == "tei-app") {
									l = l.find("tei-lem tei-l").first();
								}
							}
						}
					}
					$("#button-" + oldapp.attr("id")).remove();
					btn = oldlem.find("#button-" + oldapp.attr("id"));
					if (l.find("span.apps").length > 0) {
						l.find("span.apps").first().append(btn.detach());
					} else {
						l.append($("<span class=\"apps\"></span>").append(btn.detach()));
					}
					btn.click(function (){
						$("#dialog-" + $(this).attr("data-app")).dialog("open");
					});
				}
			}
			appToolTips();
		}
	}
};
var applyWit = function(wit) {
	$("tei-text tei-rdg[wit]").each(function(i,elt) {
		var foo = $(elt);
		if (!foo.attr("sameAs")) {
			foo.attr("wit").split(/ /).forEach(function(val) {
				if (val == wit) {
					swapLem(foo);
				}
			});
		}
	});
}
var applySource = function(source) {
	$("tei-text tei-rdg[source]").each(function(i,elt){
		var foo = $(elt);
		if (!foo.attr("sameAs")) {
			foo.attr("source").split(/ /).forEach(function(val) {
				if (val == source) {
					swapLem(foo);
				}
			});
		}
	});
}
var ttip = function(elt) {
	return {
		content: "<div class=\"apparatus\">" + $("#copy-" + $(elt).attr("data-app")).html() + "</div>",
		open: function(event, ui) {
			var app = $("#" + $(this).attr("data-app"));
			app.addClass("highlight");
			if (app.find(">tei-lem").length == 0) {
				var exclude = app.attr("exclude");
				if (exclude) {
					exclude.split(/ /).forEach(function(val) {
						$(val).find("tei-l").addClass("highlight");
					});
				}
			}
			app.find("tei-l").addClass("highlight");
		},
		close: function(event, ui) {
			var app = $("#" + $(this).attr("data-app"));
			app.find("hr").remove();
			app.removeClass("highlight");
			if (app.find(">tei-lem").length == 0) {
				var exclude = app.attr("exclude")
				if (exclude) {
					exclude.split(/ /).forEach(function(val) {
						$(val).find("tei-l").removeClass("highlight");
					});
				}
			}
			app.find("tei-l").removeClass("highlight");
		}
	};
}
var appToolTips = function() {
	$("tei-l button").each(function(i, elt) {
		if ($(elt).tooltip("instance")) {
			$(elt).tooltip("destroy");
		}
		$(elt).attr("title","");
		$(elt).tooltip(ttip(elt));
		$(elt).click(function (){
			$("#dialog-" + $(this).attr("data-app")).dialog("open");
		});
	});
}
// Execute after the document is loaded
$(function() {
	// Add Apparatus div
	$("tei-TEI").after("<div id=\"apparatus\" class=\"apparatus\"><h2>Apparatus</h2></div>");

	// Set up app. crit.
	var witLabels = function(i, elt) {
		// Find labels (@n) for items referenced via @wit and/or @source
		var wit = "";
		var source = "";
		if ($(elt).attr("wit")) {
			$(elt).attr("wit").split(/ /).forEach(function(val) {
				wit += "<span class=\"ref\" data-id=\"" + $(elt).attr("id") + "\" data-ref=\"" + val + "\">" + $(val).attr("n") + "</span>";
			});
		}
		if ($(elt).attr("source")) {
			$(elt).attr("source").split(/ /).forEach(function(val) {
				source += "<span class=\"ref\" data-id=\"" + $(elt).attr("id") + "\" data-ref=\"" + val + "\">" + $(val).attr("n") + "</span>";
			});
		}
		$(elt).after(" <span class=\"source\">" + wit + " " + source + "</span>");
	}

	// Pull content into @sameAs elements
	$("*[sameAs]").each(function(i, elt) {
		var e = $(elt);
		e.html($(e.attr("sameAs")).clone().contents());
		// have to rewrite ids in copied content so there are no duplicates
		e.find("*[id]").each(function(i, elt) {
			$(elt).attr("sameAs", "#" + $(elt).attr("id"));
			$(elt).attr("id", $(elt).attr("id") + Math.random().toString(36).substr(2));
			$($(elt).attr("sameAs")).attr("data-copy", "#" + $(elt).attr("id"));
			$(elt).addClass("app-copy");
		});
	});

	//TODO: Refactor to support deciding which apparatus function to apply
	//			based on its context. E.g., apps with lem/rdg that contain lines
	$("tei-app").each(function(i, elt) {
		var app = $(elt).clone();
		var n, lines
		app.attr("id", "copy-" + app.attr("id"));
		app.find("tei-lem,tei-rdg,tei-rdgGrp").each(witLabels);
		if ((lines = app.find("tei-l")).length > 0) {
			n = $(lines[0]).attr("n");
			if (!n) {
				n = $($(lines[0]).attr("sameAs")).attr("n");
			}
			if (lines.length > 1) {
				if ($(lines[lines.length - 1]).attr("n")) {
					n += "–" + $(lines[lines.length - 1]).attr("n");
				} else {
					n += "–" + $($(lines[lines.length - 1]).attr("sameAs")).attr("n");
				}
			}
			var l = $(elt).find("tei-lem").find("tei-l");
			if (l.length == 0) {
				l = $(elt).next("tei-l,tei-app");
			}
			l.first().append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">…</button>");
			app.find("tei-lem").remove();
			app.find("tei-rdg").remove();
		} else {
			n = $(elt).parent("tei-l").attr("n");
			if (!n) {
				n = $($(elt).parent("tei-l").attr("sameAs")).attr("n");
			}
			$(elt).parent("tei-l").append("<button id=\"button-" + $(elt).attr("id") + "\" title=\"\" class=\"app\" data-app=\"" + $(elt).attr("id") + "\">…</button>");
		}
		app.find("tei-lem:empty").append("— ");
		app.find("tei-rdg:empty").append("— ");
		if ($("#app-l" + n).length == 0 || lines.length > 0) {
			app.prepend("<span class=\"lem\" id=\"app-l" + n +"\">" + n + "</span>");
		}
		app.find("tei-lem,tei-rdg").removeAttr("id");
		$("div#apparatus").append(app);
	});

	// Add line numbers
	$("tei-l").each(function(i,elt){
		var e = $(elt);
		if (Number(e.attr("n")) % 5 == 0 && (elt.parentElement.localName == "tei-ab" || elt.parentElement.localName == "tei-lem")) {
			e.attr("data-lineno",e.attr("n"));
		}
		e.find("button.app").wrapAll("<span class=\"apps\"></span>");
	});

	// Add apparatus links
	appToolTips();

	// Add apparatus dialogs
	$("tei-text tei-app").each(function(i, elt) {
		var dialog = $(elt).clone();
		var content = $("<div/>", {
			id: "dialog-" + dialog.attr("id").replace(/copy/, "dialog"),
			class: "dialog",
			"data-exclude": dialog.attr("exclude")});
		content.appendTo("body");
		content.html(dialog.html());
		if (dialog.attr("exclude")) {
			dialog.attr("exclude").split(/ /).forEach(function(val) {
				content.append($(val).html());
			});
		}
		content.find("tei-lem,tei-rdg,tei-rdgGrp").each(witLabels);
		content.find("*[id]").each(function(i, elt) {
			$(elt).attr("data-id", $(elt).attr("id"));
		});
		content.find("*[id]").removeAttr("id");
		content.find("tei-note[target]").each(function(i, elt) {
			$(elt).attr("data-id", $(elt).attr("target").replace(/#/, ""));
		});
		if ($(elt).find("tei-l").length > 0) {
			content.find("tei-lem,tei-rdg,tei-rdgGrp").remove();
		}
		content.find("tei-lem:empty").append("– ");
		content.find("tei-rdg:empty").append("– ");
		$("#dialog-" + dialog.attr("id").replace(/copy-/,""))
			.dialog({
				autoOpen: false,
				open: function(event) {
					$("#" + $(this).attr("id").replace(/dialog/, "button")).tooltip("destroy");
					$("#" + $(this).attr("id").replace(/dialog-/, "")).addClass("highlight");
					$("#" + $(this).attr("id").replace(/dialog-/, "")).find("tei-l").addClass("highlight");
				},
				close: function(event) {
					$("#" + $(this).attr("id").replace(/dialog-/, "")).removeClass("highlight");
					$("#" + $(this).attr("id").replace(/dialog-/, "")).find("tei-l").removeClass("highlight");
					var btn = $("#" + $(this).attr("id").replace(/dialog/, "button"))
					if (btn.tooltip("instance")) {
						btn.tooltip("destroy");
					}
					appToolTips();
				}
			});
			content.find("tei-rdg,tei-lem,tei-note[data-id],span[data-id]").each(function(i, elt) {
				$(elt).click(function(evt) {
					var rdg = $("#" + $(evt.currentTarget).attr("data-id"));
					swapLem(rdg);
					if (rdg.attr("sameAs")) {
						swapLem($(rdg.attr("sameAs")));
					}
					if (rdg.attr("data-copy")) {
						swapLem($(rdg.attr("data-copy")));
					}
				});
			});
	});
	// Link up sigla in the apparatus to bibliography
	$("span.ref").each(function(i, elt) {
		$(elt).attr("title","");
		$(elt).tooltip({
			content: "<div class=\"ref\">" + $($(elt).attr("data-ref")).html() + "</div>",
		});
	});
	// Mark all lems as original
	$("tei-lem").attr("data-basetext","");
	if (window.location.search) {
		//TODO: Allow user to load document recipes.
	}
	/*
	$("span.source").each(function(i, elt) {
		var source = $(elt);
		if (source.children("*").length > 0) {
			if (source.next("tei-note").length > 0) {
				source = source.next("tei-note");
			}
			if (source.nextAll("span.source").length > 0) {
				if (source.children("*").length > 0) {
					source.children("*").last().append(":");
				} else {
					source.append(":");
				}
			}
		}
	});
	*/
});
