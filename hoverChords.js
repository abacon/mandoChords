function findChord(chordname) {
  var chordName = chordname.trim();
  var chordClass = "";
  var unnatural;

  if (chordName[1] == "b" || chordName[1] == "#") {

    unnatural = true;
    for (var i in chords) {
      if (!chords.hasOwnProperty(i))
        break;

      if (i.length > 1) {
        if (i.match(chordName[0] + chordName[1])) {
          chordClass = i;
        }
      }
    }
  } else {
    chordClass = chordName[0];
  }

  if (unnatural) {
    return chords[chordClass].filter(function(chord) {
      var isRightName = chord.name.split("/").filter(function(name) {
        return name.trim() == chordName;
      });

      return isRightName.length;
    });
  } else {

    return chords[chordClass].filter(function(chord) {
      return chord.name == chordName;
    });
  }
}

function createChordElement(chord_struct) {
  var chordbox = $('<div>').addClass('chord');
  //var chordname = $('<div>').addClass('chordname');
  var chordcanvas = $('<div>');

  chordbox.append(chordcanvas);
  //chordbox.append(chordname);
  //chordname.append(chord_struct.name + chord_struct.variant);

  var paper = Raphael(chordcanvas[0], 108, 246);
  var chord = new ChordBox(paper, 14, 14, 80,246);

  chord.setChord(
      chord_struct.chord,
      chord_struct.position,
      chord_struct.bars,
      chord_struct.position_text,
      ['g', 'd', 'a', 'e']
      );
  chord.draw();

  return chordbox;
}

function addChord() {
  var selection = window.getSelection().toString().trim();

  $("body").append($('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">'));

  var ccdivHTML = '<div class="mandochord-widget ui-draggable" style="position: absolute; left: 0; z-index: 100;"><span class="chordname"></span><div class="chords"></div></div>';

  var ccdiv = $(ccdivHTML);

  $(".chordname", ccdiv).text(selection);
  var pin = $('<a class="pinner fa fa-unlock-alt" style="cursor: pointer;"></a>');
  $(".chordname", ccdiv).append(pin);
  $(".pinner", ccdiv).on("click", function(e) {
    $(e.target)
      .toggleClass("fa-lock fa-unlock-alt")
      .parents(".mandochord-widget")
      .toggleClass("pinned");
  });

  $chords = findChord(selection).map(createChordElement);

  $("div.chords", ccdiv).append($chords);
  ccdiv.css({top: window.scrollY}).draggable();
  $(".mandochord-widget:not(.pinned)").remove();
  $("body").append(ccdiv);
}

addChord();
